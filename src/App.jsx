import { useRef, useState, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Sky, Environment } from '@react-three/drei'
import { Player } from './components/game/Player'
import { Camera } from './components/game/Camera'
import { World } from './components/game/World'
import { NPC } from './components/game/NPC'
import { EnemyGroup, DEFAULT_ENEMIES } from './components/game/Enemy'
import { HUD } from './components/ui/HUD'
import { VirtualJoystick } from './components/ui/VirtualJoystick'
import { CameraControl } from './components/ui/CameraControl'
import { ActionButton } from './components/ui/ActionButton'
import { Dialog } from './components/ui/Dialog'
import { Menu } from './components/ui/Menu'
import { usePlayerControls } from './hooks/usePlayerControls'
import { WORLD_CONFIG } from './constants/config'

function Game() {
  const playerRef = useRef()

  return (
    <>
      {/* ライティング */}
      <ambientLight intensity={WORLD_CONFIG.ambientLightIntensity} />
      <directionalLight
        position={[50, 50, 25]}
        intensity={WORLD_CONFIG.directionalLightIntensity}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={100}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />

      {/* 空 */}
      <Sky sunPosition={[100, 50, 100]} />

      {/* カメラコントロール */}
      <Camera playerRef={playerRef} />

      {/* プレイヤー */}
      <Player onRef={(ref) => { playerRef.current = ref.current }} />

      {/* ワールド */}
      <World />

      {/* 敵キャラクター */}
      <Suspense fallback={null}>
        <EnemyGroup enemies={DEFAULT_ENEMIES} />
      </Suspense>

      {/* NPC */}
      <NPC
        position={[5, 0.5, 5]}
        name="村人A"
        dialog="ようこそ、旅の方。この村は平和な場所じゃ。"
        color="#2ecc71"
      />
      <NPC
        position={[-5, 0.5, 8]}
        name="商人"
        dialog="何かお探しですか？武器や防具、道具など取り揃えております。"
        color="#9b59b6"
      />
      <NPC
        position={[0, 0.5, -10]}
        name="兵士"
        dialog="この先は危険だ。魔物がうろついている。気をつけろ！"
        color="#e74c3c"
      />
    </>
  )
}

function GameUI() {
  // キーボード入力の設定
  usePlayerControls()

  return (
    <>
      <HUD />
      <VirtualJoystick />
      <CameraControl />
      <ActionButton />
      <Dialog />
      <Menu />
    </>
  )
}

function LoadingScreen() {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
        color: '#ffd700',
        fontSize: '24px',
        fontFamily: 'monospace',
      }}
    >
      Loading...
    </div>
  )
}

export default function App() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Suspense fallback={<LoadingScreen />}>
        <Canvas
          shadows
          camera={{ fov: 60, near: 0.1, far: 1000 }}
          style={{ width: '100%', height: '100%' }}
        >
          <Game />
        </Canvas>
      </Suspense>
      <GameUI />
    </div>
  )
}
