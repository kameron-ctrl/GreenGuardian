from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
import logging


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


try:
    from backend.model.predictor import Predictor
    from backend.schemas import PredictionResponse
except ImportError:

    class Predictor:
        def predict(self, img):
            return "Healthy", 0.95
    
    class PredictionResponse:
        def __init__(self, label, confidence):
            self.label = label
            self.confidence = confidence

app = FastAPI(
    title="Green Guardian ML API",
    description="Diagnose plant diseases from leaf images",
    version="0.1.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["POST"],
    allow_headers=["*"],
)


predictor = Predictor()

@app.post("/predict", response_model=PredictionResponse)
async def predict(file: UploadFile = File(...)):
    logger.info("\n=== Received Prediction Request ===")
    logger.info(f"Filename: {file.filename}")
    logger.info(f"Content type: {file.content_type}")


    allowed_types = [
        "image/jpeg", 
        "image/jpg", 
        "image/png",
        "image/heic", 
        "image/webp",
        "application/octet-stream"  
    ]
    
    if file.content_type not in allowed_types:
        error_msg = f"Unsupported file type: {file.content_type}"
        logger.error(error_msg)
        raise HTTPException(
            status_code=415, 
            detail=error_msg
        )

    try:
        #Read file content
        contents = await file.read()
        if not contents:
            error_msg = "Empty file received"
            logger.error(error_msg)
            raise HTTPException(status_code=400, detail=error_msg)
            
        logger.info(f"Received file size: {len(contents)} bytes")
        
        #Process image
        try:
            img = Image.open(io.BytesIO(contents)).convert("RGB")
        except Exception as e:
            error_msg = f"Image processing error: {str(e)}"
            logger.error(error_msg)
            raise HTTPException(status_code=400, detail="Invalid image file")

        #Get prediction
        label, confidence = predictor.predict(img)
        logger.info(f"Prediction successful: {label} ({confidence:.2%})")
        
        return PredictionResponse(label=label, confidence=confidence)
        
    except Exception as e:
        logger.exception("Unexpected error during prediction")
        raise HTTPException(
            status_code=500, 
            detail=f"Internal server error: {str(e)}"
        )
