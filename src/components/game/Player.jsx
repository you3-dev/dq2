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

  // SkeletonUtils.clone()でスケルトン付きモデルを正しくクローン
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene])

  // アニメーション - modelRefを使用
  const { actions, mixer } = useAnimations(animations, modelRef)

  useEffect(() => {
    if (groupRef.current && onRef) {
      onRef(groupRef)
    }
  }, [onRef])

  // アニメーション制御
  useEffect(() => {
    console.log('Available animations:', Object.keys(actions))
    console.log('Actions:', actions)

    // Jog_Fwd_Loopをデフォルトで再生してみる（テスト）
    const jogAction = actions['Jog_Fwd_Loop']
    if (jogAction) {
      console.log('Playing Jog_Fwd_Loop')
      jogAction.reset().play()
    }
  }, [actions])

  useFrame((state, delta) => {
    if (!groupRef.current || gameState !== 'playing') return

    // アニメーションミキサーを更新
    if (mixer) {
      mixer.update(delta)
    }

    const { moveX, moveZ } = input
    const moving = moveX !== 0 || moveZ !== 0

    // 移動状態が変わったらアニメーション切り替え
    if (moving !== isMoving.current) {
      isMoving.current = moving
      const jogAction = actions['Jog_Fwd_Loop']

      if (jogAction) {
        if (moving) {
          jogAction.reset().fadeIn(0.2).play()
        } else {
          jogAction.fadeOut(0.5)
        }
      }
    }

    // 入力がある場合のみ移動
    if (moving) {
      // カメラの向きを基準にした移動方向を計算
      const moveAngle = Math.atan2(moveX, moveZ) + cameraAngle

      // 移動速度
      const speed = PLAYER_CONFIG.moveSpeed * delta

      // 移動ベクトル
      velocity.current.x = Math.sin(moveAngle) * speed
      velocity.current.z = Math.cos(moveAngle) * speed

      // 位置更新
      groupRef.current.position.x += velocity.current.x
      groupRef.current.position.z += velocity.current.z

      // キャラクターの向きを移動方向に
      groupRef.current.rotation.y = moveAngle

      // ストアに位置を保存
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
        object={clone}
        scale={1}
        rotation={[0, Math.PI, 0]}
        castShadow
        receiveShadow
      />
    </group>
  )
}
