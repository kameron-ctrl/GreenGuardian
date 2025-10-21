import torch
from torchvision import transforms
from PIL import Image
import json
import os
import io


MODEL_PATH = os.path.join(os.path.dirname(__file__), "model.pt")
LABELS_PATH = os.path.join(os.path.dirname(__file__), "labels.json")

class Predictor:
    def __init__(self):

        self.device = "cpu"
        

        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"Model not found at {MODEL_PATH}")
        

        print(f"Loading model from {MODEL_PATH}")
        self.model = torch.load(MODEL_PATH, map_location=self.device)
        self.model.eval()


        if not os.path.exists(LABELS_PATH):
            raise FileNotFoundError(f"Labels not found at {LABELS_PATH}")
            
        with open(LABELS_PATH) as f:
            self.labels = json.load(f)


        self.transforms = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
        ])
        
        print(f"Model loaded successfully. Device: {self.device}")

    def predict(self, img: Image.Image):
        """Make prediction on PIL Image"""

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
        _predictor = Predictor()
    return _predictor


def predict_disease(image_bytes: bytes) -> dict:

    try:
       
        image = Image.open(io.BytesIO(image_bytes))
        
        
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        
        predictor = get_predictor()
        label, confidence = predictor.predict(image)
        
        return {
            "label": label,
            "confidence": float(confidence)
        }
        
    except Exception as e:
        print(f"Prediction error: {str(e)}")
        raise Exception(f"Failed to process image: {str(e)}")