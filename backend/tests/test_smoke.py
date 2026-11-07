"""Smoke tests: the API starts, the real model classifies the sample leaf, and bad uploads are rejected."""

import json
from pathlib import Path

import main

LABELS = set(json.loads((Path(main.__file__).parent / "model" / "labels.json").read_text()).values())


def test_health(client):
    response = client.get("/")

    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_predict_classifies_the_sample_leaf(client, leaf_jpg):
    response = client.post("/predict", files={"file": ("leaf.jpg", leaf_jpg, "image/jpeg")})

    assert response.status_code == 200, response.text
    body = response.json()
    assert body["label"] in LABELS
    assert 0.0 <= body["confidence"] <= 1.0


def test_predict_requires_multipart(client, leaf_jpg):
    response = client.post("/predict", content=leaf_jpg, headers={"content-type": "image/jpeg"})

    assert response.status_code == 400


def test_predict_rejects_files_that_are_not_images(client):
    response = client.post("/predict", files={"file": ("notes.txt", b"just some text", "text/plain")})

    assert response.status_code == 400


def test_predict_rejects_oversized_uploads(client, leaf_jpg, monkeypatch):
    monkeypatch.setattr(main, "MAX_UPLOAD_BYTES", 1024)

    response = client.post("/predict", files={"file": ("leaf.jpg", leaf_jpg, "image/jpeg")})

    assert response.status_code == 413
