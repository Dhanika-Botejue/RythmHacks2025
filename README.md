# ReadBuddy

An intelligent reading platform that helps children improve their reading skills through real-time gaze tracking and personalized feedback.

## AI/ML Algorithms Used

### 1. **Pupil Detection & Gaze Tracking**
- **Algorithm**: Computer Vision-based Eye Detection
- **Method**: Darkest pixel detection with thresholding and contour analysis
- **Implementation**:
  - Uses OpenCV for real-time video processing from webcam
  - Applies binary thresholding with adaptive threshold calculation
  - Detects the darkest area in the frame (pupil) using nested loop search with spatial sampling
  - Applies morphological dilation for noise reduction
  - Uses contour filtering by area and aspect ratio to identify the pupil
  - Fits an ellipse to the detected contour for precise pupil center localization

### 2. **Coordinate System Transformation**
- **Algorithm**: Normalization and gaze coordinate mapping
- **Method**: 
  - Converts pixel coordinates (top-left 0,0) to normalized gaze coordinates (center 0,0)
  - Applies gaze multiplier (gazemulti = 10) for sensitivity amplification
  - Maps pupil position to screen coordinates using coordinate transformation
  - Clips coordinates to valid range [0,1]

### 3. **Word Position Estimation**
- **Algorithm**: Layout estimation and positional tracking
- **Method**:
  - Calculates DOM element positions for each word in the text
  - Estimates word dimensions based on font metrics (fontSize, lineHeight)
  - Tracks line wrapping by calculating words-per-line estimates
  - Converts pixel positions to normalized gaze coordinate system
  - Calculates center coordinates for each word with boundary detection

### 4. **Closest Word Detection (Distance Algorithm)**
- **Algorithm**: Euclidean Distance Calculation
- **Method**:
  - Calculates distance from gaze point to each word's center using: `√[(x₂-x₁)² + (y₂-y₁)²]`
  - Implements boundary checking with tolerance (0.05 units)
  - Returns the word within bounds with minimum distance
  - Uses spatial proximity for real-time word tracking

### 5. **Gaze Time Tracking**
- **Algorithm**: Time-based accumulation with Map data structure
- **Method**:
  - Tracks continuous gaze time on each word using timestamps
  - Calculates time deltas between gaze updates
  - Accumulates total gaze time per word across reading sessions
  - Identifies words with longest gaze duration

### 6. **Reading Analytics**
- **Algorithm**: Statistical analysis and pattern recognition
- **Features**:
  - Top-k retrieval (Top 5 most gazed words)
  - Sorting algorithm: O(n log n) merge sort by gaze time
  - Struggling words identification based on gaze duration
  - Progress tracking with percentage calculations

## Key Features

- **Real-time Gaze Tracking**: Uses computer vision to track eye movements during reading
- **Smart Word Detection**: Automatically detects which word the user is looking at
- **Reading Analytics**: Tracks gaze time per word to identify difficult vocabulary
- **Personalized Feedback**: Shows word definitions and highlights struggling areas
- **Teacher Dashboard**: Comprehensive analytics for educators to monitor student progress

## Technical Stack

- **Frontend**: Next.js, React, TypeScript, TailwindCSS, Framer Motion
- **Backend**: FastAPI, Python, OpenCV, NumPy
- **AI/ML**: Computer Vision (OpenCV), Real-time video processing
- **Database**: MongoDB for user data storage

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- Webcam access

### Installation

```bash
# Install backend dependencies
pip install -r backend/requirements.txt

# Install frontend dependencies
cd frontend && npm install
```

### Running the Application

```bash
# Start backend server
cd backend && python main.py

# Start frontend
cd frontend && npm run dev
```

## How It Works

1. User logs in and selects a story
2. Webcam captures eye movements in real-time
3. Pupil detection algorithm identifies the darkest area (pupil) in each frame
4. Gaze coordinates are transformed to normalized screen space
5. Words are positioned and tracked using DOM measurements
6. Distance algorithm finds the closest word to the gaze point
7. Time tracking accumulates gaze duration per word
8. Analytics identify struggling words and reading patterns
9. Top 5 most gazed words are displayed in completion screen
10. Teachers can view comprehensive student progress in dashboard
