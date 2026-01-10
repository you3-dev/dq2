import { useRef, useEffect } from 'react'
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

  // AnimationMixerをセットアップ
  useEffect(() => {
    if (scene && animations.length > 0) {
      // Armatureを探す
      let armature = null
      scene.traverse((child) => {
        if (child.name === 'Armature') {
          armature = child
        }
      })

      if (!armature) {
        console.warn('Armature not found')
        return
      }

      console.log('Using Armature as mixer root')

      // ミキサーをArmatureに対して作成（トラック名はそのまま）
      const mixer = new THREE.AnimationMixer(armature)
      mixerRef.current = mixer

      const jogClip = animations.find(clip => clip.name === 'Jog_Fwd_Loop')
      if (jogClip) {
        console.log('Original track name:', jogClip.tracks[0]?.name)
        const action = mixer.clipAction(jogClip)
        actionRef.current = action
        action.play()
        console.log('Animation started')
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
    // アニメーションミキサーを更新
    if (mixerRef.current) {
      mixerRef.current.update(delta)
    }

    if (!groupRef.current || gameState !== 'playing') return

    const { moveX, moveZ } = input
    const moving = moveX !== 0 || moveZ !== 0

    if (moving !== isMoving.current) {
      isMoving.current = moving

      if (actionRef.current) {
        if (moving) {
          actionRef.current.paused = false
        } else {
          actionRef.current.paused = true
        }
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
        object={scene}
        scale={1}
        rotation={[0, Math.PI, 0]}
        castShadow
        receiveShadow
      />
    </group>
  )
}
