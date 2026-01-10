import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from '../../stores/gameStore'
import { PLAYER_CONFIG } from '../../constants/config'

export function Player({ onRef }) {
  const meshRef = useRef()
  const { input, cameraAngle, updatePlayerPosition, updatePlayerRotation, gameState } = useGameStore()
  const velocity = useRef(new THREE.Vector3())

  useEffect(() => {
    if (meshRef.current && onRef) {
      onRef(meshRef)
    }
  }, [onRef])

  useFrame((state, delta) => {
    if (!meshRef.current || gameState !== 'playing') return

    const { moveX, moveZ } = input

    // 入力がある場合のみ移動
    if (moveX !== 0 || moveZ !== 0) {
      // カメラの向きを基準にした移動方向を計算
      const moveAngle = Math.atan2(moveX, moveZ) + cameraAngle

      // 移動速度
      const speed = PLAYER_CONFIG.moveSpeed * delta

      // 移動ベクトル
      velocity.current.x = Math.sin(moveAngle) * speed
      velocity.current.z = Math.cos(moveAngle) * speed

      // 位置更新
      meshRef.current.position.x += velocity.current.x
      meshRef.current.position.z += velocity.current.z

      // キャラクターの向きを移動方向に
      meshRef.current.rotation.y = moveAngle

      // ストアに位置を保存
      updatePlayerPosition([
        meshRef.current.position.x,
        meshRef.current.position.y,
        meshRef.current.position.z,
      ])
      updatePlayerRotation(moveAngle)
    }
  })

  return (
    <group ref={meshRef} position={[0, 0.5, 0]}>
      {/* プレイヤーの仮モデル（後でGLTFに置き換え） */}
      {/* 体 */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <capsuleGeometry args={[0.3, 0.6, 8, 16]} />
        <meshStandardMaterial color="#4a90d9" />
      </mesh>

      {/* 頭 */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#f5c6a5" />
      </mesh>

      {/* 髪の毛 */}
      <mesh position={[0, 1.35, 0]} castShadow>
        <sphereGeometry args={[0.28, 16, 16]} />
        <meshStandardMaterial color="#5c3317" />
      </mesh>

      {/* 目印（前方向） */}
      <mesh position={[0, 1.2, -0.3]} castShadow>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#333" />
      </mesh>
    </group>
  )
}
