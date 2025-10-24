from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os

app = FastAPI(title="Green Guardian API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
        body = await request.body()
        
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
    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))