from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
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
    """health check endpoint"""
    return {
        "status": "healthy",
        "service": "Green Guardian API",
        "version": "1.0.0"
    }

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """predict plant disease from leaf image"""
    try:

        contents = await file.read()
        

        print(f"Received file: {file.filename}")
        print(f"Content type: {file.content_type}")
        print(f"Size: {len(contents)} bytes")
        

        if len(contents) > 0:
            print(f"First 4 bytes (hex): {contents[:4].hex()}")
            

            is_jpeg = contents.startswith(b'\xff\xd8\xff')
            is_png = contents.startswith(b'\x89PNG')
            
            if not (is_jpeg or is_png):
                raise HTTPException(
                    status_code=400, 
                    detail=f"Invalid image format. Expected JPEG or PNG, got: {contents[:10].hex()}"
                )
        
        if len(contents) == 0:
            raise HTTPException(status_code=400, detail="Empty file received")
        

        result = predict_disease(contents)
        
        return result
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))