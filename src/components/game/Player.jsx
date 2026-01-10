import { useRef, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
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
  const mixerRef = useRef(null)
  const actionRef = useRef(null)
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

  // AnimationMixerをセットアップ
  useEffect(() => {
    if (!clonedScene || animations.length === 0) return

    // デバッグ: ボーン構造を確認
    let boneCount = 0
    let skinnedMeshCount = 0
    let skeletonRoot = null

    clonedScene.traverse((child) => {
      if (child.type === 'Bone') {
        boneCount++
        // rootボーンを見つける（Armatureの直接の子）
        if (child.name === 'root') {
          skeletonRoot = child
        }
      }
      if (child.isSkinnedMesh) {
        skinnedMeshCount++
        console.log('SkinnedMesh:', child.name, 'has skeleton:', !!child.skeleton)
        if (child.skeleton) {
          console.log('  Skeleton bones count:', child.skeleton.bones.length)
        }
      }
    })

    console.log('Total bones found:', boneCount)
    console.log('Total SkinnedMeshes:', skinnedMeshCount)
    console.log('Skeleton root found:', skeletonRoot?.name)

    // スケルトンルートをミキサーのルートに使用
    const mixerRoot = skeletonRoot || clonedScene
    console.log('Using mixer root:', mixerRoot.name || 'clonedScene')

    const mixer = new THREE.AnimationMixer(mixerRoot)
    mixerRef.current = mixer

    const jogClip = animations.find(clip => clip.name === 'Jog_Fwd_Loop')
    if (jogClip) {
      console.log('Animation clip found, tracks:', jogClip.tracks.length)
      console.log('Sample tracks:', jogClip.tracks.slice(0, 3).map(t => t.name))

      const action = mixer.clipAction(jogClip)
      actionRef.current = action
      action.play()
      console.log('Animation action played')
    }

    return () => {
      mixer.stopAllAction()
      mixerRef.current = null
    }
  }, [clonedScene, animations])

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
        object={clonedScene}
        scale={1}
        rotation={[0, Math.PI, 0]}
        castShadow
        receiveShadow
      />
    </group>
  )
}
