import os
from pathlib import Path

def delete_empty_class_folders(base_dir):
    base = Path(base_dir)
    removed = 0
    for folder in base.glob("*"):
        if folder.is_dir():
            if not any(folder.glob("*.[jp][pn]g")):
                print(f"🗑️ Deleting empty folder: {folder}")
                os.rmdir(folder)
                removed += 1
    print(f"✅ Removed {removed} empty class folders from: {base}")

# Use this for all three splits
delete_empty_class_folders("dataset/train")
delete_empty_class_folders("dataset/val")
delete_empty_class_folders("dataset/test")
