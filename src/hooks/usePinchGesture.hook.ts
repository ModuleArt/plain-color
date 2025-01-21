import { useEffect, useRef } from 'react'

// Declare GestureEvent interface if needed
interface GestureEvent extends UIEvent {
  readonly scale: number
  readonly rotation: number
}

export const usePinchGesture = (
  callbacks: { onZoomIn?: () => void; onZoomOut?: () => void },
  sensitivity = 1 // Sensitivity factor: lower = more sensitive
) => {
  const lastScale = useRef(1) // Tracks the previous scale for gesture events
  const wheelAccumulator = useRef(0) // Tracks accumulated delta for wheel events

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      if (event.ctrlKey) {
        event.preventDefault()

        // Scale `deltaY` by sensitivity: higher sensitivity reduces `deltaY`'s impact
        const scaledDelta = event.deltaY * (1 / sensitivity)

        wheelAccumulator.current += scaledDelta

        // Trigger zoom based on accumulated value
        if (wheelAccumulator.current <= -10) {
          callbacks.onZoomIn && callbacks.onZoomIn()
          wheelAccumulator.current = 0
        } else if (wheelAccumulator.current >= 10) {
          callbacks.onZoomOut && callbacks.onZoomOut()
          wheelAccumulator.current = 0
        }
      }
    }

    const handleGestureChange = (event: GestureEvent) => {
      const scaleChange = event.scale - lastScale.current

      // Trigger zoom if scale change exceeds sensitivity threshold
      if (Math.abs(scaleChange) >= sensitivity * 0.1) {
        if (scaleChange > 0) {
          callbacks.onZoomIn && callbacks.onZoomIn()
        } else if (scaleChange < 0) {
          callbacks.onZoomOut && callbacks.onZoomOut()
        }
        lastScale.current = event.scale // Update last scale
      }
    }

    const handleGestureEnd = () => {
      lastScale.current = 1 // Reset scale after gesture ends
    }

    // Attach event listeners
    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('gesturechange', handleGestureChange as EventListener)
    window.addEventListener('gestureend', handleGestureEnd as EventListener)

    return () => {
      // Cleanup event listeners
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('gesturechange', handleGestureChange as EventListener)
      window.removeEventListener('gestureend', handleGestureEnd as EventListener)
    }
  }, [callbacks, sensitivity])
}
