from fastapi import FastAPI, HTTPException, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import cv2
import base64
import uvicorn

import eyedetection

app = FastAPI()

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

cap = None

@app.get("/togglegaze")
async def initgaze():
    global running, cap
    running = not running

    if (running):
        cap = cv2.VideoCapture(0)
        if not cap.isOpened():
            print("Error: Could not open video.")
            return JSONResponse({"error": "Could not open camera"}, status_code=500)
        return JSONResponse({"status": "started"})
    else:
        if cap is not None:
            cap.release()
        cv2.destroyAllWindows()
        return JSONResponse({"status": "stopped"})

@app.get("/getgaze")
async def gaze():
    global cap
    if cap is None or not running:
        return JSONResponse({"error": "Camera not initialized"}, status_code=400)
    
    try:
        ret, frame = cap.read()
        if not ret:
            return JSONResponse({"error": "Could not read frame"}, status_code=500)

        if frame is None:
            return JSONResponse({"error": "Frame is None"}, status_code=500)

        frame, x, y = eyedetection.process(frame)
        
        if frame is None:
            return JSONResponse({"error": "Processed frame is None"}, status_code=500)
            
        _, buffer = cv2.imencode('.jpg', frame)
        jpg_bytes = base64.b64encode(buffer).decode('utf-8')
        return JSONResponse({
            "image": jpg_bytes,
            "x": x,
            "y": y
        })
    except Exception as e:
        print(f"Error in gaze endpoint: {str(e)}")
        import traceback
        traceback.print_exc()
        return JSONResponse({"error": f"Internal error: {str(e)}"}, status_code=500)


if (__name__ == "__main__"):
    uvicorn.run("main:app", reload=True)
