import { useState, useEffect, useCallback, useRef } from 'react'

interface GazeData {
  image: string
  x: number
  y: number
}

interface UseGazeTrackingReturn {
  isTracking: boolean
  gazeData: GazeData | null
  error: string | null
  startTracking: () => Promise<void>
  stopTracking: () => Promise<void>
  toggleTracking: () => Promise<void>
}

export const useGazeTracking = (): UseGazeTrackingReturn => {
  const [isTracking, setIsTracking] = useState(false)
  const [gazeData, setGazeData] = useState<GazeData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const API_BASE_URL = 'http://127.0.0.1:8000'

  const startTracking = useCallback(async () => {
    try {
      setError(null)
      const response = await fetch(`${API_BASE_URL}/togglegaze`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to start gaze tracking')
      }
      
      setIsTracking(true)
      
      // Start polling for gaze data
      intervalRef.current = setInterval(async () => {
        try {
          const gazeResponse = await fetch(`${API_BASE_URL}/getgaze`)
          const gazeData = await gazeResponse.json()
          
          if (gazeResponse.ok) {
            setGazeData(gazeData)
          } else {
            console.warn('Failed to get gaze data:', gazeData.error)
          }
        } catch (err) {
          console.warn('Error fetching gaze data:', err)
        }
      }, 100) // Poll every 100ms for smooth tracking
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start gaze tracking')
      setIsTracking(false)
    }
  }, [])

  const stopTracking = useCallback(async () => {
    try {
      setError(null)
      
      // Clear the polling interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      
      const response = await fetch(`${API_BASE_URL}/togglegaze`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to stop gaze tracking')
      }
      
      setIsTracking(false)
      setGazeData(null)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to stop gaze tracking')
    }
  }, [])

  const toggleTracking = useCallback(async () => {
    if (isTracking) {
      await stopTracking()
    } else {
      await startTracking()
    }
  }, [isTracking, startTracking, stopTracking])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  return {
    isTracking,
    gazeData,
    error,
    startTracking,
    stopTracking,
    toggleTracking
  }
}
