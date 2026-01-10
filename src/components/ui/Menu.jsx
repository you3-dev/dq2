import { useCallback } from 'react'
import { useGameStore } from '../../stores/gameStore'

export function Menu() {
  const { menuOpen, toggleMenu, player, inventory } = useGameStore()

  if (!menuOpen) return null

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'auto',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) toggleMenu()
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(0, 0, 50, 0.95)',
          border: '3px solid #ffd700',
          borderRadius: '12px',
          padding: '20px',
          minWidth: '300px',
          maxWidth: '90%',
          maxHeight: '80%',
          overflow: 'auto',
        }}
      >
        {/* タイトル */}
        <h2
          style={{
            color: '#ffd700',
            fontSize: '20px',
            marginBottom: '20px',
            textAlign: 'center',
            fontFamily: 'monospace',
          }}
        >
          メニュー
        </h2>

        {/* ステータス */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            padding: '15px',
            marginBottom: '15px',
          }}
        >
          <h3 style={{ color: '#ffd700', marginBottom: '10px', fontSize: '14px' }}>
            ステータス
          </h3>
          <div style={{ color: '#fff', fontSize: '14px', fontFamily: 'monospace' }}>
            <div style={{ marginBottom: '5px' }}>レベル: {player.level}</div>
            <div style={{ marginBottom: '5px' }}>HP: {player.hp} / {player.maxHp}</div>
            <div style={{ marginBottom: '5px' }}>MP: {player.mp} / {player.maxMp}</div>
            <div style={{ marginBottom: '5px' }}>EXP: {player.exp}</div>
            <div>ゴールド: {player.gold} G</div>
          </div>
        </div>

        {/* どうぐ */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            padding: '15px',
            marginBottom: '15px',
          }}
        >
          <h3 style={{ color: '#ffd700', marginBottom: '10px', fontSize: '14px' }}>
            どうぐ
          </h3>
          <div style={{ color: '#fff', fontSize: '14px', fontFamily: 'monospace' }}>
            {inventory.length === 0 ? (
              <div style={{ color: '#888' }}>なにも もっていない</div>
            ) : (
              inventory.map((item, index) => (
                <div key={index} style={{ marginBottom: '5px' }}>
                  ・{item.name}
                </div>
              ))
            )}
          </div>
        </div>

        {/* メニュー項目 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <MenuButton onClick={() => {}}>つよさ</MenuButton>
          <MenuButton onClick={() => {}}>どうぐ</MenuButton>
          <MenuButton onClick={() => {}}>じゅもん</MenuButton>
          <MenuButton onClick={() => {}}>そうび</MenuButton>
          <MenuButton onClick={() => {}}>さくせん</MenuButton>
          <MenuButton onClick={toggleMenu}>とじる</MenuButton>
        </div>
      </div>
    </div>
  )
}

function MenuButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '12px 20px',
        backgroundColor: 'rgba(255, 215, 0, 0.2)',
        border: '2px solid #ffd700',
        borderRadius: '8px',
        color: '#fff',
        fontSize: '16px',
        fontFamily: 'monospace',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'background-color 0.2s',
      }}
      onMouseEnter={(e) => {
        e.target.style.backgroundColor = 'rgba(255, 215, 0, 0.4)'
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = 'rgba(255, 215, 0, 0.2)'
      }}
    >
      {children}
    </button>
  )
}
