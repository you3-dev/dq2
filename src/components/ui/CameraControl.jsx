import { useRef, useEffect, useCallback, useState } from 'react'
import { useGameStore } from '../../stores/gameStore'
import { CAMERA_CONFIG } from '../../constants/config'

export function CameraControl() {
  const areaRef = useRef(null)
  const { setCameraAngle, cameraAngle, gameState } = useGameStore()
  const [touchId, setTouchId] = useState(null)
  const lastX = useRef(0)

  const handleStart = useCallback((clientX, id) => {
    if (gameState !== 'playing') return
    setTouchId(id)
    lastX.current = clientX
  }, [gameState])

  const handleMove = useCallback((clientX, id) => {
    if (id !== touchId) return

    const deltaX = clientX - lastX.current
    lastX.current = clientX

    setCameraAngle(cameraAngle - deltaX * CAMERA_CONFIG.rotationSpeed)
  }, [touchId, cameraAngle, setCameraAngle])

  const handleEnd = useCallback((id) => {
    if (id !== undefined && id !== touchId) return
    setTouchId(null)
  }, [touchId])

  // タッチイベント
  const handleTouchStart = useCallback((e) => {
    e.preventDefault()
    const touch = e.touches[0]
    handleStart(touch.clientX, touch.identifier)
  }, [handleStart])

  const handleTouchMove = useCallback((e) => {
    e.preventDefault()
    for (let i = 0; i < e.touches.length; i++) {
      const touch = e.touches[i]
      handleMove(touch.clientX, touch.identifier)
    }
  }, [handleMove])

  const handleTouchEnd = useCallback((e) => {
    e.preventDefault()
    for (let i = 0; i < e.changedTouches.length; i++) {
      handleEnd(e.changedTouches[i].identifier)
    }
  }, [handleEnd])

  // マウスイベント
  const handleMouseDown = useCallback((e) => {
    handleStart(e.clientX, 'mouse')
  }, [handleStart])

  const handleMouseMove = useCallback((e) => {
    handleMove(e.clientX, 'mouse')
  }, [handleMove])

  const handleMouseUp = useCallback(() => {
    handleEnd('mouse')
  }, [handleEnd])

  useEffect(() => {
    if (touchId === 'mouse') {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)

      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [touchId, handleMouseMove, handleMouseUp])

  return (
    <div
      ref={areaRef}
      style={{
        position: 'absolute',
        right: 0,
        top: 0,
        width: '50%',
        height: '100%',
        touchAction: 'none',
        userSelect: 'none',
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
    />
  )
}
