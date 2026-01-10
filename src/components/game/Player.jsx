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

    // デバッグ: ボーン構造とArmatureを確認
    let boneCount = 0
    let skinnedMeshCount = 0
    let armature = null

    clonedScene.traverse((child) => {
      if (child.type === 'Bone') {
        boneCount++
      }
      // Armatureオブジェクトを見つける（スケルトンの親）
      if (child.name === 'Armature' || child.type === 'Object3D' && child.children.some(c => c.type === 'Bone')) {
        if (!armature && child.name === 'Armature') {
          armature = child
        }
      }
      if (child.isSkinnedMesh) {
        skinnedMeshCount++
        console.log('SkinnedMesh:', child.name, 'skeleton bones:', child.skeleton?.bones.length)
      }
    })

    console.log('Total bones:', boneCount, 'SkinnedMeshes:', skinnedMeshCount)
    console.log('Armature found:', armature?.name)

    // clonedScene全体をミキサーのルートに使用
    // これによりトラック名 "root.position" が正しく解決される
    const mixer = new THREE.AnimationMixer(clonedScene)
    mixerRef.current = mixer

    // 利用可能なアニメーションを確認
    console.log('Available animations:', animations.map(a => a.name))

    // Jog_Fwd_Loopアニメーションを探す
    let clip = animations.find(c => c.name === 'Jog_Fwd_Loop')
    if (!clip && animations.length > 0) {
      // 見つからない場合は最初のアニメーションを使用
      clip = animations[0]
      console.log('Using fallback animation:', clip.name)
    }

    if (clip) {
      console.log('Animation:', clip.name, 'duration:', clip.duration, 'tracks:', clip.tracks.length)

      // トラック名のサンプルを表示
      const sampleTracks = clip.tracks.slice(0, 5).map(t => t.name)
      console.log('Sample track names:', sampleTracks)

      // ボーンがシーンツリー内で見つかるか確認
      const rootBone = clonedScene.getObjectByName('root')
      const pelvisBone = clonedScene.getObjectByName('pelvis')
      console.log('Can find root bone:', !!rootBone, rootBone?.type)
      console.log('Can find pelvis bone:', !!pelvisBone, pelvisBone?.type)

      // SkinnedMeshからスケルトンのボーン名を取得
      let firstSkeleton = null
      clonedScene.traverse((child) => {
        if (child.isSkinnedMesh && child.skeleton && !firstSkeleton) {
          firstSkeleton = child.skeleton
        }
      })
      if (firstSkeleton) {
        console.log('Skeleton bone names:', firstSkeleton.bones.slice(0, 5).map(b => b.name))
        // ボーンの親を確認
        const rootInSkeleton = firstSkeleton.bones.find(b => b.name === 'root')
        if (rootInSkeleton) {
          console.log('Root bone parent:', rootInSkeleton.parent?.name, rootInSkeleton.parent?.type)
        }
      }

      const action = mixer.clipAction(clip)
      actionRef.current = action
      action.setLoop(THREE.LoopRepeat)
      action.play()
      console.log('Animation started')
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
