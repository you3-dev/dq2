import { useCallback } from 'react'
import { useGameStore } from '../../stores/gameStore'

export function ActionButton() {
  const { setInput, gameState } = useGameStore()

  const handlePress = useCallback(() => {
    if (gameState !== 'playing') return
    setInput({ action: true })
    // 短い遅延後にリセット
    setTimeout(() => setInput({ action: false }), 100)
  }, [setInput, gameState])

  return (
    <button
      onTouchStart={(e) => {
        e.preventDefault()
        handlePress()
      }}
      onMouseDown={handlePress}
      style={{
        position: 'absolute',
        right: '30px',
        bottom: '50px',
        width: '70px',
        height: '70px',
        borderRadius: '50%',
        backgroundColor: 'rgba(255, 200, 50, 0.8)',
        border: '3px solid rgba(255, 255, 255, 0.8)',
        color: '#333',
        fontSize: '14px',
        fontWeight: 'bold',
        cursor: 'pointer',
        touchAction: 'none',
        userSelect: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
      }}
    >
      はなす
    </button>
  )
}
