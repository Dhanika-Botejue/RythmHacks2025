import cv2
import mediapipe
from math import sqrt
import numpy
import pyautogui

LEFT_WINK_COUNTER = 0
RIGHT_WINK_COUNTER = 0
LEFT_WINK_TOTAL = 0
RIGHT_WINK_TOTAL = 0
LEFT_WINK_CLICKED = False  # Track if we've already clicked for current left wink
RIGHT_WINK_CLICKED = False  # Track if we've already clicked for current right wink

FONT = cv2.FONT_HERSHEY_SIMPLEX

# MediaPipe Face Mesh landmarks for eyes
# Right eye indices: outer to inner
RIGHT_EYE = [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246]
# Left eye indices: outer to inner  
LEFT_EYE = [362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398]

# Key points for eye aspect ratio calculation (EAR)
# Standard MediaPipe landmarks: outer corner, inner corner, top, bottom
RIGHT_EYE_KEY = [33, 133, 159, 145, 158, 153]  # Right eye: outer, inner, top1, bottom1, top2, bottom2
LEFT_EYE_KEY = [362, 263, 386, 374, 387, 373]  # Left eye: outer, inner, top1, bottom1, top2, bottom2

mediapipe_face_mesh = mediapipe.solutions.face_mesh
face_mesh = mediapipe_face_mesh.FaceMesh(
    max_num_faces=1, 
    min_detection_confidence=0.6, 
    min_tracking_confidence=0.7,
    refine_landmarks=True  # Enable refined landmarks for better accuracy
)

# Configure pyautogui
pyautogui.FAILSAFE = True  # Move mouse to corner to stop (safety feature)
pyautogui.PAUSE = 0.01  # Small pause between actions

video_capture = cv2.VideoCapture(0)

def landmarksDetection(image, results, draw=False):
    image_height, image_width= image.shape[:2]
    mesh_coordinates = [(int(point.x * image_width), int(point.y * image_height)) for point in results.multi_face_landmarks[0].landmark]
    if draw :
        [cv2.circle(image, i, 2, (0, 255, 0), -1) for i in mesh_coordinates]
    return mesh_coordinates

# Euclaidean distance to calculate the distance between the two points
def euclaideanDistance(point, point1):
    x, y = point
    x1, y1 = point1
    distance = sqrt((x1 - x)**2 + (y1 - y)**2)
    return distance

# Calculate Eye Aspect Ratio (EAR) - returns individual eye ratios
def calculate_ear(landmarks, eye_indices):
    """
    Calculate Eye Aspect Ratio using 6 key points
    EAR = (vertical_dist_1 + vertical_dist_2) / (2 * horizontal_dist)
    Lower EAR = eye closed, Higher EAR = eye open
    """
    # Extract eye corner and middle points
    outer_corner = landmarks[eye_indices[0]]
    inner_corner = landmarks[eye_indices[1]]
    top_mid = landmarks[eye_indices[2]]
    bottom_mid = landmarks[eye_indices[3]]
    top_outer = landmarks[eye_indices[4]]
    bottom_outer = landmarks[eye_indices[5]]
    
    # Calculate horizontal distance (between outer and inner corners)
    horizontal_dist = euclaideanDistance(outer_corner, inner_corner)
    
    # Calculate vertical distances (top to bottom)
    vertical_dist_1 = euclaideanDistance(top_mid, bottom_mid)
    vertical_dist_2 = euclaideanDistance(top_outer, bottom_outer)
    
    # Calculate EAR using standard formula
    if horizontal_dist == 0:
        return 0.0
    
    ear = (vertical_dist_1 + vertical_dist_2) / (2.0 * horizontal_dist)
    return ear

# Blinking Ratio - returns individual eye ratios  
def blinkRatio(image, landmarks, right_indices, left_indices):
    right_eye_ratio = calculate_ear(landmarks, right_indices)
    left_eye_ratio = calculate_ear(landmarks, left_indices)
    
    # Return both individual ratios and combined ratio
    eyes_ratio = (right_eye_ratio + left_eye_ratio) / 2
    return eyes_ratio, right_eye_ratio, left_eye_ratio

# Wink detection thresholds
EAR_THRESHOLD_CLOSED = 0.22  # Eye is considered closed when EAR is below this
EAR_THRESHOLD_OPEN = 0.25    # Eye is considered open when EAR is above this
WINK_FRAMES = 3              # Number of consecutive frames for wink detection

while True:
    ret, frame = video_capture.read()
    if not ret:
        break

    frame = cv2.resize(frame, None, fx=1.5, fy=1.5, interpolation=cv2.INTER_CUBIC)
    frame_height, frame_width = frame.shape[:2]
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)  # Fixed: MediaPipe expects RGB
    results = face_mesh.process(rgb_frame)
    
    if results.multi_face_landmarks:
        mesh_coordinates = landmarksDetection(frame, results, False)

        # Calculate eye aspect ratios using key landmarks
        eyes_ratio, right_eye_ratio, left_eye_ratio = blinkRatio(
            frame, mesh_coordinates, RIGHT_EYE_KEY, LEFT_EYE_KEY
        )

        # Draw eye landmarks for visualization
        for idx in LEFT_EYE_KEY + RIGHT_EYE_KEY:
            if idx < len(mesh_coordinates):
                cv2.circle(frame, mesh_coordinates[idx], 2, (0, 255, 0), -1)

        # Display instructions
        cv2.putText(frame, "Wink LEFT = Left Click | Wink RIGHT = Right Click", 
                   (30, 40), FONT, 0.7, (0, 255, 0), 2)

        # Detect LEFT wink (left eye closed, right eye open)
        left_eye_closed = left_eye_ratio < EAR_THRESHOLD_CLOSED
        right_eye_open = right_eye_ratio > EAR_THRESHOLD_OPEN
        
        if left_eye_closed and right_eye_open:
            LEFT_WINK_COUNTER += 1
            # Perform left click when wink is detected
            if LEFT_WINK_COUNTER >= WINK_FRAMES and not LEFT_WINK_CLICKED:
                LEFT_WINK_TOTAL += 1
                LEFT_WINK_CLICKED = True
                pyautogui.click(button='left')
                print(f"LEFT WINK DETECTED! Left click performed. Total: {LEFT_WINK_TOTAL}")
        else:
            # Reset click flag when wink ends
            if LEFT_WINK_COUNTER > 0:
                LEFT_WINK_COUNTER = 0
                LEFT_WINK_CLICKED = False

        # Detect RIGHT wink (right eye closed, left eye open)
        right_eye_closed = right_eye_ratio < EAR_THRESHOLD_CLOSED
        left_eye_open = left_eye_ratio > EAR_THRESHOLD_OPEN
        
        if right_eye_closed and left_eye_open:
            RIGHT_WINK_COUNTER += 1
            # Perform right click when wink is detected
            if RIGHT_WINK_COUNTER >= WINK_FRAMES and not RIGHT_WINK_CLICKED:
                RIGHT_WINK_TOTAL += 1
                RIGHT_WINK_CLICKED = True
                pyautogui.click(button='right')
                print(f"RIGHT WINK DETECTED! Right click performed. Total: {RIGHT_WINK_TOTAL}")
        else:
            # Reset click flag when wink ends
            if RIGHT_WINK_COUNTER > 0:
                RIGHT_WINK_COUNTER = 0
                RIGHT_WINK_CLICKED = False

        # Visual feedback for current state
        wink_status = ""
        if LEFT_WINK_COUNTER > 0:
            if LEFT_WINK_CLICKED:
                wink_status = "LEFT CLICK PERFORMED!"
                cv2.rectangle(frame, (10, 60), (600, 100), (0, 255, 0), -1)
                cv2.putText(frame, wink_status, (20, 85), FONT, 0.7, (0, 0, 0), 2)
            else:
                wink_status = "LEFT WINK IN PROGRESS..."
                cv2.rectangle(frame, (10, 60), (600, 100), (0, 0, 255), -1)
                cv2.putText(frame, wink_status, (20, 85), FONT, 0.7, (255, 255, 255), 2)
        elif RIGHT_WINK_COUNTER > 0:
            if RIGHT_WINK_CLICKED:
                wink_status = "RIGHT CLICK PERFORMED!"
                cv2.rectangle(frame, (10, 60), (600, 100), (0, 255, 0), -1)
                cv2.putText(frame, wink_status, (20, 85), FONT, 0.7, (0, 0, 0), 2)
            else:
                wink_status = "RIGHT WINK IN PROGRESS..."
                cv2.rectangle(frame, (10, 60), (600, 100), (255, 0, 0), -1)
                cv2.putText(frame, wink_status, (20, 85), FONT, 0.7, (255, 255, 255), 2)

        # Display wink counters and debug info
        cv2.rectangle(frame, (20, 120), (550, 220), (0, 0, 0), -1)
        cv2.putText(frame, f'Left Winks: {LEFT_WINK_TOTAL}', 
                   (30, 150), FONT, 0.8, (0, 0, 255), 2)
        cv2.putText(frame, f'Right Winks: {RIGHT_WINK_TOTAL}', 
                   (30, 180), FONT, 0.8, (0, 0, 255), 2)
        cv2.putText(frame, f'Left EAR: {left_eye_ratio:.3f} | Right EAR: {right_eye_ratio:.3f}', 
                   (30, 210), FONT, 0.5, (255, 255, 255), 1)
        
        # Status indicators
        left_status = "CLOSED" if left_eye_closed else "OPEN"
        right_status = "CLOSED" if right_eye_closed else "OPEN"
        left_color = (0, 0, 255) if left_eye_closed else (0, 255, 0)
        right_color = (0, 0, 255) if right_eye_closed else (0, 255, 0)
        
        cv2.putText(frame, f'L: {left_status}', (300, 150), FONT, 0.6, left_color, 2)
        cv2.putText(frame, f'R: {right_status}', (300, 180), FONT, 0.6, right_color, 2)

    else:
        cv2.putText(frame, "No face detected", (30, 40), FONT, 0.8, (0, 0, 255), 2)

    cv2.imshow('Wink Detection - MediaPipe', frame)
    if cv2.waitKey(1) & 0xFF == 27:  # Press ESC to exit
        break

cv2.destroyAllWindows()
video_capture.release()
