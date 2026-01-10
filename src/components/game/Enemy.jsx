import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

// 敵モデルのプリロード
useGLTF.preload('/models/enemies/GreenBlob.gltf')
useGLTF.preload('/models/enemies/PinkBlob.gltf')
useGLTF.preload('/models/enemies/GreenSpikyBlob.gltf')
useGLTF.preload('/models/enemies/Mushnub.gltf')

// 敵タイプとモデルのマッピング
const ENEMY_MODELS = {
  slime: '/models/enemies/GreenBlob.gltf',
  slime_pink: '/models/enemies/PinkBlob.gltf',
  slime_spiky: '/models/enemies/GreenSpikyBlob.gltf',
  mushroom: '/models/enemies/Mushnub.gltf',
}

export function Enemy({
  type = 'slime',
  position = [0, 0, 0],
  scale = 1,
  wanderRadius = 3,
  wanderSpeed = 0.5,
}) {
  const groupRef = useRef()
  const modelRef = useRef()
  const initialPos = useRef(new THREE.Vector3(...position))
  const targetPos = useRef(new THREE.Vector3(...position))
  const time = useRef(Math.random() * 100)

  const modelPath = ENEMY_MODELS[type] || ENEMY_MODELS.slime
  const { scene } = useGLTF(modelPath)
  const clonedScene = useMemo(() => scene.clone(), [scene])

  useFrame((state, delta) => {
    if (!groupRef.current) return

    time.current += delta

    // ゆらゆら動くアニメーション
    const bounceY = Math.sin(time.current * 3) * 0.1
    groupRef.current.position.y = position[1] + bounceY + 0.3

    // ランダムに歩き回る
    if (time.current % 3 < delta) {
      // 3秒ごとに新しい目標位置を設定
      const angle = Math.random() * Math.PI * 2
      const distance = Math.random() * wanderRadius
      targetPos.current.set(
        initialPos.current.x + Math.cos(angle) * distance,
        position[1],
        initialPos.current.z + Math.sin(angle) * distance
      )
    }

    // 目標位置に向かって移動
    const currentPos = groupRef.current.position
    const dx = targetPos.current.x - currentPos.x
    const dz = targetPos.current.z - currentPos.z
    const dist = Math.sqrt(dx * dx + dz * dz)

    if (dist > 0.1) {
      currentPos.x += (dx / dist) * wanderSpeed * delta
      currentPos.z += (dz / dist) * wanderSpeed * delta

      // 移動方向を向く
      const angle = Math.atan2(dx, dz)
      groupRef.current.rotation.y = angle
    }

    // スケールのパルス（呼吸アニメーション）
    const breathScale = 1 + Math.sin(time.current * 2) * 0.05
    groupRef.current.scale.setScalar(scale * breathScale)
  })

  return (
    <group ref={groupRef} position={position}>
      <primitive
        ref={modelRef}
        object={clonedScene}
        scale={1}
        castShadow
        receiveShadow
      />
    </group>
  )
}

// 複数の敵を配置するコンポーネント
export function EnemyGroup({ enemies = [] }) {
  return (
    <group>
      {enemies.map((enemy, index) => (
        <Enemy
          key={index}
          type={enemy.type}
          position={enemy.position}
          scale={enemy.scale || 1}
          wanderRadius={enemy.wanderRadius || 3}
          wanderSpeed={enemy.wanderSpeed || 0.5}
        />
      ))}
    </group>
  )
}

// デフォルトの敵配置（テスト用）
export const DEFAULT_ENEMIES = [
  { type: 'slime', position: [10, 0, 10], scale: 0.8, wanderRadius: 4 },
  { type: 'slime_pink', position: [-8, 0, 12], scale: 0.7, wanderRadius: 3 },
  { type: 'slime', position: [15, 0, -8], scale: 0.9, wanderRadius: 5 },
  { type: 'slime_spiky', position: [-12, 0, -10], scale: 0.8, wanderRadius: 4 },
  { type: 'mushroom', position: [20, 0, 5], scale: 0.8, wanderRadius: 3 },
]
