import { useEffect, useCallback } from 'react'
import { useGameStore } from '../stores/gameStore'

export function usePlayerControls() {
  const { setInput, gameState } = useGameStore()

  const handleKeyDown = useCallback((e) => {
    if (gameState !== 'playing') return

    switch (e.key.toLowerCase()) {
      case 'w':
      case 'arrowup':
        setInput({ moveZ: -1 })
        break
      case 's':
      case 'arrowdown':
        setInput({ moveZ: 1 })
        break
      case 'a':
      case 'arrowleft':
        setInput({ moveX: -1 })
        break
      case 'd':
      case 'arrowright':
        setInput({ moveX: 1 })
        break
      case ' ':
      case 'enter':
        setInput({ action: true })
        break
      case 'escape':
        setInput({ cancel: true })
        break
    }
  }, [setInput, gameState])

  const handleKeyUp = useCallback((e) => {
    switch (e.key.toLowerCase()) {
      case 'w':
      case 's':
      case 'arrowup':
      case 'arrowdown':
        setInput({ moveZ: 0 })
        break
      case 'a':
      case 'd':
      case 'arrowleft':
      case 'arrowright':
        setInput({ moveX: 0 })
        break
      case ' ':
      case 'enter':
        setInput({ action: false })
        break
      case 'escape':
        setInput({ cancel: false })
        break
    }
  }, [setInput])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [handleKeyDown, handleKeyUp])
}
