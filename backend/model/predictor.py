import torch
from torchvision import transforms
from PIL import Image
import json
import os

#File paths (can be set with environment variables or defaults)
MODEL_PATH = os.getenv("MODEL_WEIGHTS", "model.pt")
LABELS_PATH = os.getenv("LABELS_PATH", os.path.join(os.path.dirname(__file__), "labels.json"))

class Predictor:
    def __init__(self):
        # Set device to GPU if available
        self.device = "cuda" if torch.cuda.is_available() else "cpu"

        #Load the trained model
        self.model = torch.load(MODEL_PATH, map_location=self.device)
        self.model.eval()

        #Load label names
        with open(LABELS_PATH) as f:
            self.labels = json.load(f)

        #Image preprocessing
        self.transforms = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
        ])

    def predict(self, img: Image.Image):
        #Preprocess image and make prediction
        img_tensor = self.transforms(img).unsqueeze(0).to(self.device)
        with torch.no_grad():
            outputs = self.model(img_tensor)
            probs = torch.softmax(outputs, dim=1)
            conf, pred_idx = probs.max(dim=1)

        #Return label and confidence
        label_id = str(pred_idx.item())
        label_name = self.labels.get(label_id, "Unknown")
        return label_name, conf.item()
