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
      // Armatureとその子ボーンを探す
      let armature = null
      const boneNames = []

      scene.traverse((child) => {
        if (child.name === 'Armature') {
          armature = child
        }
        if (child.isBone) {
          boneNames.push(child.name)
        }
      })

      console.log('Armature found:', !!armature)
      console.log('Bone names in model:', boneNames.slice(0, 10))

      // アニメーションのトラック名を取得
      const jogClip = animations.find(clip => clip.name === 'Jog_Fwd_Loop')
      if (jogClip) {
        const trackBoneNames = jogClip.tracks.map(t => t.name.split('.')[0])
        const uniqueTrackBones = [...new Set(trackBoneNames)]
        console.log('Track bone names:', uniqueTrackBones.slice(0, 10))

        // ボーン名がマッチするかチェック
        const firstTrackBone = uniqueTrackBones[0]
        const foundInModel = boneNames.includes(firstTrackBone)
        console.log(`First track bone "${firstTrackBone}" found in model:`, foundInModel)

        // もしマッチしない場合、トラック名を修正
        if (!foundInModel && armature) {
          console.log('Trying to remap animation tracks...')

          // Armatureの最初の子を探す
          let rootBone = null
          armature.traverse((child) => {
            if (child.isBone && !rootBone) {
              rootBone = child
            }
          })

          if (rootBone) {
            console.log('Root bone in armature:', rootBone.name)
          }
        }
      }

      // ミキサーをシーン全体に対して作成（パス解決のため）
      const mixer = new THREE.AnimationMixer(scene)
      mixerRef.current = mixer

      if (jogClip) {
        // アニメーショントラックのパスを修正
        const modifiedClip = jogClip.clone()
        modifiedClip.tracks = jogClip.tracks.map(track => {
          const newTrack = track.clone()
          // トラック名を "Armature.ボーン名.プロパティ" に変更
          const parts = track.name.split('.')
          if (parts.length >= 2) {
            const boneName = parts[0]
            const property = parts.slice(1).join('.')
            newTrack.name = `Armature.${boneName}.${property}`
          }
          return newTrack
        })

        console.log('Modified track example:', modifiedClip.tracks[0]?.name)

        const action = mixer.clipAction(modifiedClip)
        actionRef.current = action
        action.play()
        console.log('Animation started with modified tracks')
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
