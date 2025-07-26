import os
import shutil
import random
import argparse
from pathlib import Path

def is_valid_image(file: Path):
    return file.suffix.lower() in [".jpg", ".jpeg", ".png"]

def split_data(input_dir, output_dir, train_ratio=0.8, val_ratio=0.1, test_ratio=0.1, seed=42):
    assert abs(train_ratio + val_ratio + test_ratio - 1.0) < 1e-6, "Ratios must sum to 1.0"
    random.seed(seed)

    input_dir = Path(input_dir)
    output_dir = Path(output_dir)
    splits = ['train', 'val', 'test']

    for split in splits:
        (output_dir / split).mkdir(parents=True, exist_ok=True)

    for class_dir in input_dir.iterdir():
        if not class_dir.is_dir():
            continue
        class_name = class_dir.name

        # ✅ Match JPG, JPEG, PNG
        images = [f for f in class_dir.iterdir() if is_valid_image(f)]

        total = len(images)
        if total == 0:
            print(f"⚠️ Skipping {class_name} (no valid images found)")
            continue

        random.shuffle(images)
        n_train = int(train_ratio * total)
        n_val = int(val_ratio * total)
        n_test = total - n_train - n_val

        split_map = {
            'train': images[:n_train],
            'val': images[n_train:n_train + n_val],
            'test': images[n_train + n_val:]
        }

        for split, split_images in split_map.items():
            split_class_dir = output_dir / split / class_name
            split_class_dir.mkdir(parents=True, exist_ok=True)
            for img_path in split_images:
                shutil.copy(img_path, split_class_dir / img_path.name)

        print(f"{class_name}: {n_train} train, {n_val} val, {n_test} test — {total} total")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Split dataset into train/val/test")
    parser.add_argument('--input', type=str, required=True, help='Path to raw dataset')
    parser.add_argument('--output', type=str, required=True, help='Path to output base folder')
    parser.add_argument('--train', type=float, default=0.8, help='Train split ratio')
    parser.add_argument('--val', type=float, default=0.1, help='Validation split ratio')
    parser.add_argument('--test', type=float, default=0.1, help='Test split ratio')
    parser.add_argument('--seed', type=int, default=42, help='Random seed')
    args = parser.parse_args()

    split_data(args.input, args.output, args.train, args.val, args.test, args.seed)
