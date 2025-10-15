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
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Green Guardian API",
        "version": "1.0.0"
    }

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """Predict plant disease from leaf image"""
    try:
        
        contents = await file.read()
        
        
        result = predict_disease(contents)
        
        return result
    
    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))