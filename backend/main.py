from fastapi import FastAPI, HTTPException, APIRouter, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import cv2
import base64

import eyedetection

origins = [
    "http://localhost:3000",
    "https://readbuddy-eight.vercel.app/"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

running = False

@app.get("initializegaze"):
async def initgaze():
    running = not running

    if (running):
        cap = cv2.VideoCapture(0)
        if not cap.isOpened():
            print("Error: Could not open video.")
    else:
        cap.release()
        cv2.destroyAllWindows()

@app.get("getgaze")
async def gaze():
    ret, frame = cap.read()
    if not ret:
        break

    frame,x,y = eyedetection.process(frame)
    _, buffer = cv2.imencode('.jpg', image)
    jpg_bytes = base64.b64encode(buffer).decode('utf-8')
    return JSONResponse({
        "image": jpg_bytes,
        "x": x,
        "y": y
    })


if (__name__ == "__main__"):
    uvicorn.run("main:app", reload=True)
