import { useCallback, useEffect, useState } from 'react'
import { useGameStore } from '../../stores/gameStore'

export function Dialog() {
  const { dialog, closeDialog } = useGameStore()
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  // タイピングエフェクト
  useEffect(() => {
    if (!dialog.isOpen) {
      setDisplayedText('')
      return
    }

    setIsTyping(true)
    setDisplayedText('')

    let index = 0
    const text = dialog.text
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1))
        index++
      } else {
        setIsTyping(false)
        clearInterval(interval)
      }
    }, 50) // 1文字50ms

    return () => clearInterval(interval)
  }, [dialog.isOpen, dialog.text])

  const handleClick = useCallback(() => {
    if (isTyping) {
      // タイピング中はスキップ
      setDisplayedText(dialog.text)
      setIsTyping(false)
    } else if (dialog.choices.length === 0) {
      // 選択肢がなければ閉じる
      closeDialog()
    }
  }, [isTyping, dialog.text, dialog.choices, closeDialog])

  if (!dialog.isOpen) return null

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        right: '20px',
        pointerEvents: 'auto',
      }}
      onClick={handleClick}
      onTouchStart={handleClick}
    >
      <div
        style={{
          backgroundColor: 'rgba(0, 0, 50, 0.95)',
          border: '3px solid #ffd700',
          borderRadius: '12px',
          padding: '20px',
          color: '#fff',
          fontFamily: 'monospace',
          fontSize: '16px',
          lineHeight: '1.6',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* 話者名 */}
        {dialog.speaker && (
          <div
            style={{
              position: 'absolute',
              top: '-15px',
              left: '20px',
              backgroundColor: '#ffd700',
              color: '#000',
              padding: '5px 15px',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '14px',
            }}
          >
            {dialog.speaker}
          </div>
        )}

        {/* テキスト */}
        <div style={{ minHeight: '60px', marginTop: dialog.speaker ? '10px' : 0 }}>
          {displayedText}
          {isTyping && (
            <span
              style={{
                display: 'inline-block',
                width: '10px',
                height: '16px',
                backgroundColor: '#fff',
                marginLeft: '2px',
                animation: 'blink 0.5s infinite',
              }}
            />
          )}
        </div>

        {/* 選択肢 */}
        {!isTyping && dialog.choices.length > 0 && (
          <div style={{ marginTop: '15px' }}>
            {dialog.choices.map((choice, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation()
                  choice.action?.()
                  closeDialog()
                }}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '10px 15px',
                  marginTop: index > 0 ? '8px' : 0,
                  backgroundColor: 'rgba(255, 215, 0, 0.2)',
                  border: '2px solid #ffd700',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '14px',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                {choice.text}
              </button>
            ))}
          </div>
        )}

        {/* 続きを示す矢印 */}
        {!isTyping && dialog.choices.length === 0 && (
          <div
            style={{
              position: 'absolute',
              bottom: '10px',
              right: '15px',
              color: '#ffd700',
              animation: 'bounce 1s infinite',
            }}
          >
            ▼
          </div>
        )}
      </div>

      {/* アニメーション用CSS */}
      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(5px); }
        }
      `}</style>
    </div>
  )
}
