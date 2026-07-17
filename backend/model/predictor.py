import torch
from torch import nn
from torchvision import models, transforms
from PIL import Image
import json
import os
import io
import time


MODEL_PATH = os.path.join(os.path.dirname(__file__), "model_state.pt")
LABELS_PATH = os.path.join(os.path.dirname(__file__), "labels.json")

class Predictor:
    def __init__(self):
        start_time = time.time()
        self.device = "cpu"
        
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"Model not found at {MODEL_PATH}")
        
        if not os.path.exists(LABELS_PATH):
            raise FileNotFoundError(f"Labels not found at {LABELS_PATH}")
        
        with open(LABELS_PATH) as f:
            self.labels = json.load(f)

        print(f"Loading model from {MODEL_PATH}")
        model_load_start = time.time()
        # Rebuild the architecture (ResNet18 + resized head) and load only the
        # saved weights with weights_only=True. This avoids torch.load's arbitrary
        # pickle execution path that a full-module checkpoint would require.
        num_classes = len(self.labels)
        self.model = models.resnet18(weights=None)
        self.model.fc = nn.Linear(self.model.fc.in_features, num_classes)
        state_dict = torch.load(MODEL_PATH, map_location=self.device, weights_only=True)
        self.model.load_state_dict(state_dict)
        self.model.to(self.device)
        self.model.eval()
        print(f"Model loaded in {time.time() - model_load_start:.2f}s")

        self.transforms = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
        ])
        
        print(f"Predictor initialized in {time.time() - start_time:.2f}s. Device: {self.device}")

    def predict(self, img: Image.Image):
        img_tensor = self.transforms(img).unsqueeze(0).to(self.device)
        
        with torch.no_grad():
            outputs = self.model(img_tensor)
            probs = torch.softmax(outputs, dim=1)
            conf, pred_idx = probs.max(dim=1)

        label_id = str(pred_idx.item())
        label_name = self.labels.get(label_id, "Unknown")
        return label_name, conf.item()


_predictor = None

def get_predictor():
    """Get or create the global predictor instance"""
    global _predictor
    if _predictor is None:
        print("Initializing predictor...")
        init_start = time.time()
        _predictor = Predictor()
        print(f"Predictor ready in {time.time() - init_start:.2f}s")
    return _predictor


def predict_disease(image_bytes: bytes) -> dict:
    """
    Predict plant disease from image bytes
    
    Args:
        image_bytes: Raw image bytes from uploaded file
        
    Returns:
        dict with 'label' and 'confidence' keys
    """
    try:
        request_start = time.time()
        print(f"Processing prediction request...")
        
        # Load image
        image = Image.open(io.BytesIO(image_bytes))
        if image.mode != 'RGB':
            image = image.convert('RGB')
        print(f"Image loaded in {time.time() - request_start:.2f}s")
        
        # Get predictor (may trigger initialization)
        predictor = get_predictor()
        
        # Make prediction
        pred_start = time.time()
        label, confidence = predictor.predict(image)
        print(f"Prediction completed in {time.time() - pred_start:.2f}s")
        print(f"Total request time: {time.time() - request_start:.2f}s")
        
        return {
            "label": label,
            "confidence": float(confidence)
        }
        
    except Exception as e:
        print(f"Prediction error: {str(e)}")
        import traceback
        traceback.print_exc()
        raise Exception(f"Failed to process image: {str(e)}")