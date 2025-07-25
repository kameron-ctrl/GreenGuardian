import torch
import os
import json
from torchvision import datasets, models, transforms
from torch import nn, optim
from torch.utils.data import DataLoader
from sklearn.metrics import accuracy_score

#------------------------------
#Config
#------------------------------
dataset_path = "dataset"
train_path = os.path.join(dataset_path, "train")
val_path = os.path.join(dataset_path, "val")
test_path = os.path.join(dataset_path, "test")

batch_size = 32
epochs = 10
lr = 1e-3
device = "cuda" if torch.cuda.is_available() else "cpu"

#------------------------------
#Image Transformations
#------------------------------
def get_transforms():
    return transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
    ])

#------------------------------
#Load Datasets
#------------------------------
train_ds = datasets.ImageFolder(train_path, transform=get_transforms())
val_ds = datasets.ImageFolder(val_path, transform=get_transforms())
test_ds = datasets.ImageFolder(test_path, transform=get_transforms())

train_loader = DataLoader(train_ds, batch_size=batch_size, shuffle=True)
val_loader = DataLoader(val_ds, batch_size=batch_size)
test_loader = DataLoader(test_ds, batch_size=batch_size)

#------------------------------
#Model Setup
#------------------------------
model = models.resnet18(weights=models.ResNet18_Weights.IMAGENET1K_V1)
model.fc = nn.Linear(model.fc.in_features, len(train_ds.classes))
model = model.to(device)

criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=lr)

#------------------------------
#Training Loop
#------------------------------
print("Starting training...")
for epoch in range(epochs):
    model.train()
    total_loss = 0.0

    for x, y in train_loader:
        x, y = x.to(device), y.to(device)
        optimizer.zero_grad()
        out = model(x)
        loss = criterion(out, y)
        loss.backward()
        optimizer.step()
        total_loss += loss.item()

    avg_loss = total_loss / len(train_loader)
    print(f"Epoch {epoch+1}/{epochs} - Training Loss: {avg_loss:.4f}")

#------------------------------
#Save Model + Labels
#------------------------------
torch.save(model, "model.pt")
print("Model saved to model.pt")

os.makedirs("app/model", exist_ok=True)
with open("app/model/labels.json", "w") as f:
    json.dump({i: cls for i, cls in enumerate(train_ds.classes)}, f, indent=2)

#------------------------------
#Evaluation on Test Set
#------------------------------
model.eval()
y_true, y_pred = [], []

with torch.no_grad():
    for x, y in test_loader:
        x = x.to(device)
        out = model(x)
        preds = torch.argmax(out, dim=1).cpu().numpy()
        y_pred.extend(preds)
        y_true.extend(y.numpy())

acc = accuracy_score(y_true, y_pred)
print(f"Test Accuracy: {acc * 100:.2f}%")
