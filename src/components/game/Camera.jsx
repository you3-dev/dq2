import { useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { useGameStore } from '../../stores/gameStore'
import { CAMERA_CONFIG } from '../../constants/config'

export function Camera({ playerRef }) {
  const { camera } = useThree()
  const { cameraAngle } = useGameStore()
  const initialized = useRef(false)

  useEffect(() => {
    camera.fov = CAMERA_CONFIG.fov
    camera.updateProjectionMatrix()
  }, [camera])

  useFrame(() => {
    if (!playerRef?.current) return

    const playerPos = playerRef.current.position

    // カメラの目標位置を計算（プレイヤーの後方斜め上）
    const offsetX = Math.sin(cameraAngle) * CAMERA_CONFIG.distance
    const offsetZ = Math.cos(cameraAngle) * CAMERA_CONFIG.distance

    const targetX = playerPos.x + offsetX
    const targetY = playerPos.y + CAMERA_CONFIG.height
    const targetZ = playerPos.z + offsetZ

    // 初期化時は即座に配置
    if (!initialized.current) {
      camera.position.set(targetX, targetY, targetZ)
      initialized.current = true
    } else {
      // スムーズな追従
      camera.position.x += (targetX - camera.position.x) * CAMERA_CONFIG.smoothing
      camera.position.y += (targetY - camera.position.y) * CAMERA_CONFIG.smoothing
      camera.position.z += (targetZ - camera.position.z) * CAMERA_CONFIG.smoothing
    }

    // プレイヤーを注視
    camera.lookAt(
      playerPos.x,
      playerPos.y + CAMERA_CONFIG.lookAtOffset,
      playerPos.z
    )
  })

  return null
}
