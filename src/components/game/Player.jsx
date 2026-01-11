import { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { useGameStore } from '../../stores/gameStore'
import { PLAYER_CONFIG } from '../../constants/config'
import { getModelPath } from '../../utils/paths'

// プレイヤーモデルのパス
const PLAYER_MODEL_PATH = getModelPath('characters/Knight_Golden_Female.gltf')

// モデルをプリロード
useGLTF.preload(PLAYER_MODEL_PATH)

export function Player({ onRef }) {
  const groupRef = useRef()
  const mixerRef = useRef(null)
  const actionsRef = useRef({})
  const currentActionRef = useRef('Idle')
  const { player, input, cameraAngle, updatePlayerPosition, updatePlayerRotation, gameState } = useGameStore()
  const velocity = useRef(new THREE.Vector3())
  const isMoving = useRef(false)

  // GLTFモデルとアニメーションをロード
  const { scene, animations } = useGLTF(PLAYER_MODEL_PATH)

  // AnimationMixerとアクションのセットアップ
  useEffect(() => {
    if (!scene || animations.length === 0) return

    console.log('Setting up Player animations')

    // AnimationMixerを作成
    const mixer = new THREE.AnimationMixer(scene)
    mixerRef.current = mixer

    // 利用可能なアニメーション: Run, Idle
    const runClip = animations.find(c => c.name === 'Run') || animations.find(c => c.name.includes('Run'))
    const idleClip = animations.find(c => c.name === 'Idle') || animations.find(c => c.name.includes('Idle'))

    const actions = {}

    if (runClip) {
      const action = mixer.clipAction(runClip)
      action.setLoop(THREE.LoopRepeat)
      actions['Run'] = action
    }

    if (idleClip) {
      const action = mixer.clipAction(idleClip)
      action.setLoop(THREE.LoopRepeat)
      actions['Idle'] = action
    }

    actionsRef.current = actions

    // 初期アニメーション再生
    const startAnim = actions['Idle'] ? 'Idle' : (actions['Run'] ? 'Run' : null)
    if (startAnim && actions[startAnim]) {
      actions[startAnim].play()
      currentActionRef.current = startAnim
    }

    return () => {
      mixer.stopAllAction()
      mixerRef.current = null
      actionsRef.current = {}
    }
  }, [scene, animations])

  useEffect(() => {
    if (groupRef.current && onRef) {
      onRef(groupRef)
    }
  }, [onRef])

  // マップ切り替え時などのテレポート同期
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.position.set(player.position[0], player.position[1], player.position[2])
      groupRef.current.rotation.y = player.rotation
    }
  }, [player.position[0], player.position[1], player.position[2], player.rotation])

  // アニメーション切り替え関数
  const fadeToAction = (name, duration = 0.2) => {
    const previousName = currentActionRef.current
    if (previousName === name) return

    const actions = actionsRef.current
    const previousAction = actions[previousName]
    const activeAction = actions[name]

    if (previousAction && activeAction) {
      previousAction.fadeOut(duration)
      activeAction.reset().fadeIn(duration).play()
      currentActionRef.current = name
    } else if (activeAction) {
      activeAction.play()
      currentActionRef.current = name
    }
  }

  useFrame((state, delta) => {
    // アニメーションミキサーを更新
    if (mixerRef.current) {
      mixerRef.current.update(delta)
    }

    if (!groupRef.current || gameState !== 'playing') return

    const { moveX, moveZ } = input
    const moving = moveX !== 0 || moveZ !== 0

    // 移動状態が変化した時にアニメーションを制御
    if (moving !== isMoving.current) {
      isMoving.current = moving
      if (moving) {
        fadeToAction('Run', 0.2)
      } else {
        fadeToAction('Idle', 0.2)
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
    <group ref={groupRef} position={player.position} rotation={[0, player.rotation, 0]}>
      <primitive
        object={scene}
        scale={0.5}
        rotation={[0, 0, 0]}
        castShadow
        receiveShadow
      />
    </group>
  )
}
