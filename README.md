# Green Guardian
Green Guardian is a full-stack, AI-powered mobile and web application that detects disease from pictures of plant leaves. The model identifies over
30 different disease classes and return fast, real-time predictions with confidence levels included. 

- Mobile image capture using Expo React Native
- FastAPI backend that uses PyTorch modeling
- Using ML, which creates custom data splitting, training, and testing
- Supports .jpg, .jpeg, .png and .heic files
- Designed for local hosting (for now)

## Tech Stack 
|  Layer 	|  Technology 	|
|:-:	|---	|
|  Front end 	|   Expo + ReactNative (future mobile use)	|
|  Backend 	|   FastAPI + Uvicorn	|
|  Machine Learning 	|  Pytorch 	|
|  Database 	|   [PlantVillage](https://www.kaggle.com/datasets/emmarex/plantdisease)	|
|  Devtools	|  Python, Typescript, CORS, Axios, PIL 	|
|  Dev Ops | Docker, Amazon Web Services AWS|

## WEBSITE URL
[Green Guardian 
](https://d25t8i75m01j.cloudfront.net/)
# If you want to run locally, follow these steps!

## Set Up Backend!
1. Clone the repo 
```python
git clone https://github.com/kameron-ctrl/GreenGuardian
cd GreenGuardian
```
2. Install the backend dependencies
```python
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```
3. Train or download model
Train using:
```python
python train.py
```
<p>or place ```model.pt``` into ```backend/model/``` <p>
4. Run the backend 

```python
uvicorn backend.main:app --host 0.0.0.0 --port 8000

```

## Set up Frontend!
1. Navigate to frontend folder

```python
cd frontend
npm install
```
2. Start Expo Server

```python
npx expo start
```
3. Setup your backend IP
in ```index.tsx``` replace:
```python
const apiUrl = 'http://YOUR-IP:8000/predict';
```
With your actual IP addresss


# Works in progress!
- Advice based on prediction
- Image history and Prediction logging
- Better trained data
