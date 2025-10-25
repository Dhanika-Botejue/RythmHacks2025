import mediapipe as mp
import cv2
import gaze

mp_face_mesh = mp.solutions.face_mesh  # initialize the face mesh model

# camera stream:
cap = cv2.VideoCapture(0)  # chose camera index (try 1, 2, 3)

if not cap.isOpened():
    print("Error: Could not open camera")
    cap.release()
    exit()

print("Camera opened successfully")

with mp_face_mesh.FaceMesh(
        max_num_faces=1,  # number of faces to track in each frame
        refine_landmarks=True,  # includes iris landmarks in the face mesh model
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5) as face_mesh:
    print("Starting video loop...")
    while cap.isOpened():
        success, image = cap.read()
        if not success:  # no frame input
            print("Ignoring empty camera frame.")
            continue
        # To improve performance, optionally mark the image as not writeable to
        # pass by reference.
        image.flags.writeable = False
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)  # frame to RGB for the face-mesh model
        results = face_mesh.process(image)
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)  # frame back to BGR for OpenCV

        if results.multi_face_landmarks:
            try:
                gaze.gaze(image, results.multi_face_landmarks[0])
            except Exception as e:
                print(f"Error in gaze function: {e}")  # gaze estimation

        image = cv2.flip(image, 1)
        cv2.imshow('output window', image)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
            
cap.release()
cv2.destroyAllWindows()