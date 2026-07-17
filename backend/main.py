from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
import logging
import os
import time

logger = logging.getLogger("green_guardian")
logging.basicConfig(level=logging.INFO)

app = FastAPI(title="Green Guardian API")

# Restrict CORS to configured frontend origins. Set ALLOWED_ORIGINS as a
# comma-separated list in the Lambda environment (e.g. "https://app.example.com").
# Falls back to localhost dev origins when unset. Credentials are disabled because
# the API uses no cookies/sessions — combining "*" with credentials is unsafe.
_raw_origins = os.environ.get("ALLOWED_ORIGINS", "").strip()
ALLOWED_ORIGINS = [o.strip() for o in _raw_origins.split(",") if o.strip()] or [
    "http://localhost:3000",
    "http://localhost:3411",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Reject uploads larger than this before buffering them into memory (default 10 MB).
MAX_UPLOAD_BYTES = int(os.environ.get("MAX_UPLOAD_BYTES", 10 * 1024 * 1024))

# Best-effort per-IP rate limiting. NOTE: Lambda memory is per-container, so this
# only throttles within a single warm container. Real enforcement belongs at the
# API Gateway level (throttling / usage plan) — see SECURITY.md.
RATE_LIMIT_MAX = int(os.environ.get("RATE_LIMIT_MAX", 30))
RATE_LIMIT_WINDOW_SECONDS = int(os.environ.get("RATE_LIMIT_WINDOW_SECONDS", 60))
_request_log: dict[str, list[float]] = {}


def _client_ip(request: Request) -> str:
    """Best-effort client IP, honoring API Gateway's X-Forwarded-For."""
    forwarded = request.headers.get("x-forwarded-for", "")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def _is_rate_limited(ip: str) -> bool:
    """Sliding-window check; records the request timestamp when allowed."""
    now = time.time()
    window_start = now - RATE_LIMIT_WINDOW_SECONDS
    recent = [t for t in _request_log.get(ip, []) if t > window_start]
    if len(recent) >= RATE_LIMIT_MAX:
        _request_log[ip] = recent
        return True
    recent.append(now)
    _request_log[ip] = recent
    return False


from model.predictor import predict_disease

@app.get("/")
def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Green Guardian API",
        "version": "1.0.0"
    }

@app.post("/predict")
async def predict(request: Request):
    """
    Predict plant disease from leaf image
    Manually parses multipart/form-data to avoid Mangum corruption
    """
    try:
        client_ip = _client_ip(request)
        if _is_rate_limited(client_ip):
            raise HTTPException(
                status_code=429,
                detail="Too many requests. Please wait a moment and try again.",
            )

        # Reject oversized uploads before reading them into memory.
        content_length = request.headers.get("content-length")
        if content_length is not None:
            try:
                if int(content_length) > MAX_UPLOAD_BYTES:
                    raise HTTPException(status_code=413, detail="Image too large.")
            except ValueError:
                raise HTTPException(status_code=400, detail="Invalid Content-Length header.")

        body = await request.body()

        # Guard against a missing/spoofed Content-Length by checking the real size.
        if len(body) > MAX_UPLOAD_BYTES:
            raise HTTPException(status_code=413, detail="Image too large.")

        print(f"Raw body length: {len(body)} bytes")
        print(f"Content-Type: {request.headers.get('content-type')}")
        print(f"First 20 bytes (hex): {body[:20].hex()}")
        
        content_type = request.headers.get('content-type', '')
        if 'multipart/form-data' not in content_type:
            raise HTTPException(status_code=400, detail="Must be multipart/form-data")
        
        boundary = None
        for part in content_type.split(';'):
            part = part.strip()
            if part.startswith('boundary='):
                boundary = part.split('=', 1)[1].strip('"')
                break
        
        if not boundary:
            raise HTTPException(status_code=400, detail="No boundary in Content-Type")
        
        print(f"Boundary: {boundary}")
        
        boundary_bytes = f'--{boundary}'.encode()
        parts = body.split(boundary_bytes)
        
        file_data = None
        for part in parts:
            if b'name="file"' in part:
                header_end = part.find(b'\r\n\r\n')
                if header_end == -1:
                    header_end = part.find(b'\n\n')
                    if header_end != -1:
                        file_data = part[header_end + 2:].rstrip(b'\r\n-')
                else:
                    file_data = part[header_end + 4:].rstrip(b'\r\n-')
                break
        
        if not file_data:
            raise HTTPException(status_code=400, detail="No file found in request")
        
        print(f"Extracted file data: {len(file_data)} bytes")
        print(f"First 16 bytes (hex): {file_data[:16].hex()}")
        

        is_jpeg = file_data.startswith(b'\xff\xd8\xff')
        is_png = file_data.startswith(b'\x89PNG')
        
        if not (is_jpeg or is_png):
            print(f"WARNING: File doesn't start with JPEG or PNG magic bytes")
            print(f"  Got: {file_data[:10].hex()}")
            raise HTTPException(
                status_code=400,
                detail=f"Invalid image format. First bytes: {file_data[:10].hex()}"
            )
        
        print(f"✓ Valid image detected ({'JPEG' if is_jpeg else 'PNG'})")
        

        result = predict_disease(file_data)
        
        return result
    
    except HTTPException:
        raise
    except Exception:
        # Log full detail server-side (CloudWatch); return a generic message so
        # internal paths / library internals are not leaked to the caller.
        logger.exception("Prediction request failed")
        raise HTTPException(
            status_code=500,
            detail="Internal error while processing the image. Please try again.",
        )