import { useRef, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGameStore } from '../stores/gameStore'
import { CAMERA_CONFIG } from '../constants/config'

export function useCamera(playerRef) {
  const { cameraAngle, setCameraAngle } = useGameStore()
  const targetPosition = useRef([0, 0, 0])

  const updateCamera = useCallback((camera, delta) => {
    if (!playerRef.current) return

    const playerPos = playerRef.current.position

    // カメラの目標位置を計算（プレイヤーの後方斜め上）
    const offsetX = Math.sin(cameraAngle) * CAMERA_CONFIG.distance
    const offsetZ = Math.cos(cameraAngle) * CAMERA_CONFIG.distance

    targetPosition.current = [
      playerPos.x + offsetX,
      playerPos.y + CAMERA_CONFIG.height,
      playerPos.z + offsetZ,
    ]

    // スムーズな追従
    camera.position.x += (targetPosition.current[0] - camera.position.x) * CAMERA_CONFIG.smoothing
    camera.position.y += (targetPosition.current[1] - camera.position.y) * CAMERA_CONFIG.smoothing
    camera.position.z += (targetPosition.current[2] - camera.position.z) * CAMERA_CONFIG.smoothing

    // プレイヤーを注視
    camera.lookAt(
      playerPos.x,
      playerPos.y + CAMERA_CONFIG.lookAtOffset,
      playerPos.z
    )
  }, [cameraAngle, playerRef])

  const rotateCamera = useCallback((deltaX) => {
    setCameraAngle(cameraAngle + deltaX * CAMERA_CONFIG.rotationSpeed)
  }, [cameraAngle, setCameraAngle])

  return { updateCamera, rotateCamera, cameraAngle }
}
