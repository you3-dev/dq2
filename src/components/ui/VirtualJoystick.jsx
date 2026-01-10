import { useRef, useEffect, useState, useCallback } from 'react'
import { useGameStore } from '../../stores/gameStore'

const JOYSTICK_SIZE = 120
const KNOB_SIZE = 50
const MAX_DISTANCE = (JOYSTICK_SIZE - KNOB_SIZE) / 2

export function VirtualJoystick() {
  const containerRef = useRef(null)
  const [isActive, setIsActive] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [touchId, setTouchId] = useState(null)
  const { setInput, gameState } = useGameStore()

  const handleStart = useCallback((clientX, clientY, id) => {
    if (gameState !== 'playing') return

    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    setIsActive(true)
    setTouchId(id)
    updatePosition(clientX - centerX, clientY - centerY)
  }, [gameState])

  const updatePosition = useCallback((deltaX, deltaY) => {
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    const clampedDistance = Math.min(distance, MAX_DISTANCE)
    const angle = Math.atan2(deltaY, deltaX)

    const x = Math.cos(angle) * clampedDistance
    const y = Math.sin(angle) * clampedDistance

    setPosition({ x, y })

    // 正規化された入力値（-1 to 1）
    const normalizedX = x / MAX_DISTANCE
    const normalizedY = y / MAX_DISTANCE

    setInput({
      moveX: normalizedX,
      moveZ: normalizedY,
    })
  }, [setInput])

  const handleMove = useCallback((clientX, clientY, id) => {
    if (!isActive || id !== touchId) return

    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    updatePosition(clientX - centerX, clientY - centerY)
  }, [isActive, touchId, updatePosition])

  const handleEnd = useCallback((id) => {
    if (id !== undefined && id !== touchId) return

    setIsActive(false)
    setTouchId(null)
    setPosition({ x: 0, y: 0 })
    setInput({ moveX: 0, moveZ: 0 })
  }, [touchId, setInput])

  // タッチイベント
  const handleTouchStart = useCallback((e) => {
    e.preventDefault()
    const touch = e.touches[0]
    handleStart(touch.clientX, touch.clientY, touch.identifier)
  }, [handleStart])

  const handleTouchMove = useCallback((e) => {
    e.preventDefault()
    for (let i = 0; i < e.touches.length; i++) {
      const touch = e.touches[i]
      handleMove(touch.clientX, touch.clientY, touch.identifier)
    }
  }, [handleMove])

  const handleTouchEnd = useCallback((e) => {
    e.preventDefault()
    for (let i = 0; i < e.changedTouches.length; i++) {
      handleEnd(e.changedTouches[i].identifier)
    }
  }, [handleEnd])

  // マウスイベント（デバッグ用）
  const handleMouseDown = useCallback((e) => {
    handleStart(e.clientX, e.clientY, 'mouse')
  }, [handleStart])

  const handleMouseMove = useCallback((e) => {
    handleMove(e.clientX, e.clientY, 'mouse')
  }, [handleMove])

  const handleMouseUp = useCallback(() => {
    handleEnd('mouse')
  }, [handleEnd])

  useEffect(() => {
    if (isActive && touchId === 'mouse') {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)

      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isActive, touchId, handleMouseMove, handleMouseUp])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        left: '30px',
        bottom: '30px',
        width: JOYSTICK_SIZE,
        height: JOYSTICK_SIZE,
        borderRadius: '50%',
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        border: '3px solid rgba(255, 255, 255, 0.5)',
        touchAction: 'none',
        userSelect: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
    >
      {/* ノブ */}
      <div
        style={{
          width: KNOB_SIZE,
          height: KNOB_SIZE,
          borderRadius: '50%',
          backgroundColor: isActive ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.7)',
          border: '2px solid rgba(0, 0, 0, 0.3)',
          transform: `translate(${position.x}px, ${position.y}px)`,
          transition: isActive ? 'none' : 'transform 0.1s ease-out',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
        }}
      />
    </div>
  )
}
