import { useGameStore } from '../../stores/gameStore'

export function HUD() {
  const { player, toggleMenu } = useGameStore()

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: '10px',
        pointerEvents: 'none',
      }}
    >
      {/* ステータス表示 */}
      <div
        style={{
          backgroundColor: 'rgba(0, 0, 50, 0.8)',
          border: '2px solid #ffd700',
          borderRadius: '8px',
          padding: '10px 15px',
          color: '#fff',
          fontFamily: 'monospace',
          fontSize: '14px',
          display: 'inline-block',
          minWidth: '150px',
        }}
      >
        <div style={{ marginBottom: '5px' }}>
          <span style={{ color: '#ffd700' }}>Lv.</span>
          <span style={{ marginLeft: '5px' }}>{player.level}</span>
        </div>

        {/* HP */}
        <div style={{ marginBottom: '3px' }}>
          <span style={{ color: '#ff6b6b' }}>HP</span>
          <span style={{ marginLeft: '10px' }}>
            {player.hp} / {player.maxHp}
          </span>
        </div>
        <div
          style={{
            width: '100%',
            height: '8px',
            backgroundColor: '#333',
            borderRadius: '4px',
            overflow: 'hidden',
            marginBottom: '8px',
          }}
        >
          <div
            style={{
              width: `${(player.hp / player.maxHp) * 100}%`,
              height: '100%',
              backgroundColor: '#4ade80',
              transition: 'width 0.3s ease',
            }}
          />
        </div>

        {/* MP */}
        <div style={{ marginBottom: '3px' }}>
          <span style={{ color: '#60a5fa' }}>MP</span>
          <span style={{ marginLeft: '10px' }}>
            {player.mp} / {player.maxMp}
          </span>
        </div>
        <div
          style={{
            width: '100%',
            height: '8px',
            backgroundColor: '#333',
            borderRadius: '4px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${(player.mp / player.maxMp) * 100}%`,
              height: '100%',
              backgroundColor: '#60a5fa',
              transition: 'width 0.3s ease',
            }}
          />
        </div>

        {/* ゴールド */}
        <div style={{ marginTop: '8px' }}>
          <span style={{ color: '#ffd700' }}>G</span>
          <span style={{ marginLeft: '10px' }}>{player.gold}</span>
        </div>
      </div>

      {/* メニューボタン */}
      <button
        onClick={toggleMenu}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          width: '50px',
          height: '50px',
          borderRadius: '8px',
          backgroundColor: 'rgba(0, 0, 50, 0.8)',
          border: '2px solid #ffd700',
          color: '#ffd700',
          fontSize: '20px',
          cursor: 'pointer',
          pointerEvents: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        ≡
      </button>
    </div>
  )
}
