import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGameStore } from '../../stores/gameStore'

export function NPC({ position, name, dialog, color = '#e74c3c' }) {
  const meshRef = useRef()
  const { input, openDialog, player, gameState } = useGameStore()
  const wasActionPressed = useRef(false)

  useFrame(() => {
    if (!meshRef.current) return

    // プレイヤーとの距離を計算
    const distance = Math.sqrt(
      Math.pow(player.position[0] - position[0], 2) +
      Math.pow(player.position[2] - position[2], 2)
    )

    // アクションボタンが押された時
    if (input.action && !wasActionPressed.current && gameState === 'playing') {
      if (distance < 3) {
        openDialog(name, dialog)
      }
    }
    wasActionPressed.current = input.action

    // NPCをプレイヤーの方向に向ける（近くにいる時）
    if (distance < 5 && distance > 0) {
      const angle = Math.atan2(
        player.position[0] - position[0],
        player.position[2] - position[2]
      )
      meshRef.current.rotation.y = angle
    }
  })

  return (
    <group ref={meshRef} position={position}>
      {/* 体 */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <capsuleGeometry args={[0.3, 0.6, 8, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* 頭 */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#f5c6a5" />
      </mesh>

      {/* 目印（前方向） */}
      <mesh position={[0, 1.2, -0.3]} castShadow>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#333" />
      </mesh>

      {/* 名前表示用のビルボード（オプション） */}
      <sprite position={[0, 2, 0]} scale={[2, 0.5, 1]}>
        <spriteMaterial transparent opacity={0} />
      </sprite>
    </group>
  )
}
