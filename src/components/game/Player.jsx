import { useRef, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'
import { SkeletonUtils } from 'three-stdlib'
import { useGameStore } from '../../stores/gameStore'
import { PLAYER_CONFIG } from '../../constants/config'
import { getModelPath } from '../../utils/paths'

// プレイヤーモデルのパス
const PLAYER_MODEL_PATH = getModelPath('characters/Female_Ranger.gltf')

// モデルをプリロード
useGLTF.preload(PLAYER_MODEL_PATH)

export function Player({ onRef }) {
  const groupRef = useRef()
  const modelRef = useRef()
  const { input, cameraAngle, updatePlayerPosition, updatePlayerRotation, gameState } = useGameStore()
  const velocity = useRef(new THREE.Vector3())
  const isMoving = useRef(false)

  // GLTFモデルとアニメーションをロード
  const { scene, animations } = useGLTF(PLAYER_MODEL_PATH)

  // SkeletonUtils.cloneでスケルトンごと正しくクローン
  const clonedScene = useMemo(() => {
    const clone = SkeletonUtils.clone(scene)
    return clone
  }, [scene])

  // useAnimationsフックでアニメーションをセットアップ
  const { actions, names, mixer } = useAnimations(animations, modelRef)

  // デバッグとアニメーション開始
  useEffect(() => {
    console.log('Available animation names:', names)
    console.log('Actions:', Object.keys(actions))

    // Jog_Fwd_Loopアニメーションを再生
    const jogAction = actions['Jog_Fwd_Loop']
    if (jogAction) {
      console.log('Playing Jog_Fwd_Loop animation')
      jogAction.reset().setLoop(THREE.LoopRepeat).play()
    } else if (names.length > 0) {
      // フォールバック: 最初のアニメーションを再生
      const firstAction = actions[names[0]]
      if (firstAction) {
        console.log('Playing fallback animation:', names[0])
        firstAction.reset().setLoop(THREE.LoopRepeat).play()
      }
    }
  }, [actions, names])

  useEffect(() => {
    if (groupRef.current && onRef) {
      onRef(groupRef)
    }
  }, [onRef])

  useFrame((state, delta) => {
    if (!groupRef.current || gameState !== 'playing') return

    const { moveX, moveZ } = input
    const moving = moveX !== 0 || moveZ !== 0

    // 移動状態が変化した時にアニメーションを制御
    if (moving !== isMoving.current) {
      isMoving.current = moving
      const jogAction = actions['Jog_Fwd_Loop']
      if (jogAction) {
        jogAction.paused = !moving
      }
    }

    if (moving) {
      const moveAngle = Math.atan2(moveX, moveZ) + cameraAngle
      const speed = PLAYER_CONFIG.moveSpeed * delta

      velocity.current.x = Math.sin(moveAngle) * speed
      velocity.current.z = Math.cos(moveAngle) * speed

      groupRef.current.position.x += velocity.current.x
      groupRef.current.position.z += velocity.current.z
      groupRef.current.rotation.y = moveAngle

      updatePlayerPosition([
        groupRef.current.position.x,
        groupRef.current.position.y,
        groupRef.current.position.z,
      ])
      updatePlayerRotation(moveAngle)
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <primitive
        ref={modelRef}
        object={clonedScene}
        scale={1}
        rotation={[0, Math.PI, 0]}
        castShadow
        receiveShadow
      />
    </group>
  )
}
