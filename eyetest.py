from l2cs import Pipeline, render
import cv2
import torch

cam = 0

gaze_pipeline = Pipeline(
    weights='gaze.pkl',
    arch='ResNet50',
    device=torch.device('cpu')
)
 
cap = cv2.VideoCapture(cam)
while True:
    _, frame = cap.read()    

    results = gaze_pipeline.step(frame)
    frame = render(frame, results)

    frame = cv2.flip(frame,1)
    cv2.imshow('feed', frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break