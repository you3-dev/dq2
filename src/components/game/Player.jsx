import { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { useGameStore } from '../../stores/gameStore'
import { PLAYER_CONFIG } from '../../constants/config'
import { getModelPath } from '../../utils/paths'

// プレイヤーモデルのパス
const PLAYER_MODEL_PATH = getModelPath('characters/Female_Ranger.gltf')

// モデルをプリロード
useGLTF.preload(PLAYER_MODEL_PATH)

export function Player({ onRef }) {
  const groupRef = useRef()
  const mixerRef = useRef(null)
  const actionRef = useRef(null)
  const { input, cameraAngle, updatePlayerPosition, updatePlayerRotation, gameState } = useGameStore()
  const velocity = useRef(new THREE.Vector3())
  const isMoving = useRef(false)

  // GLTFモデルとアニメーションをロード
  const { scene, animations } = useGLTF(PLAYER_MODEL_PATH)

  // AnimationMixerを手動でセットアップ
  useEffect(() => {
    if (scene && animations.length > 0) {
      console.log('Setting up AnimationMixer manually')
      console.log('Scene:', scene)
      console.log('Animations:', animations)

      // 新しいミキサーを作成
      const mixer = new THREE.AnimationMixer(scene)
      mixerRef.current = mixer

      // Jog_Fwd_Loopアニメーションを取得
      const jogClip = animations.find(clip => clip.name === 'Jog_Fwd_Loop')
      if (jogClip) {
        console.log('Found Jog_Fwd_Loop clip:', jogClip)
        console.log('Clip duration:', jogClip.duration)
        console.log('Clip tracks:', jogClip.tracks.length)

        const action = mixer.clipAction(jogClip)
        actionRef.current = action
        action.play()
        console.log('Animation action started')
      }
    }

    return () => {
      if (mixerRef.current) {
        mixerRef.current.stopAllAction()
      }
    }
  }, [scene, animations])

  useEffect(() => {
    if (groupRef.current && onRef) {
      onRef(groupRef)
    }
  }, [onRef])

  useFrame((state, delta) => {
    // アニメーションミキサーを更新（重要！）
    if (mixerRef.current) {
      mixerRef.current.update(delta)
    }

    if (!groupRef.current || gameState !== 'playing') return

    const { moveX, moveZ } = input
    const moving = moveX !== 0 || moveZ !== 0

    // 移動状態が変わったらアニメーション切り替え
    if (moving !== isMoving.current) {
      isMoving.current = moving

      if (actionRef.current) {
        if (moving) {
          actionRef.current.paused = false
        } else {
          // 停止時はアニメーションを一時停止
          actionRef.current.paused = true
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
        object={scene}
        scale={1}
        rotation={[0, Math.PI, 0]}
        castShadow
        receiveShadow
      />
    </group>
  )
}
