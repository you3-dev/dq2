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
  const frameCount = useRef(0)
  const rootBoneRef = useRef(null)
  const { input, cameraAngle, updatePlayerPosition, updatePlayerRotation, gameState } = useGameStore()
  const velocity = useRef(new THREE.Vector3())
  const isMoving = useRef(false)

  // GLTFモデルとアニメーションをロード
  const { scene, animations } = useGLTF(PLAYER_MODEL_PATH)

  // 手動でAnimationMixerをセットアップ
  useEffect(() => {
    if (!scene || animations.length === 0) return

    console.log('Setting up AnimationMixer manually')
    console.log('Scene:', scene.name, scene.type)
    console.log('Animations:', animations.map(a => a.name))

    // SkinnedMeshを見つけてスケルトン情報を確認
    let skinnedMesh = null
    scene.traverse((child) => {
      if (child.isSkinnedMesh && !skinnedMesh) {
        skinnedMesh = child
        console.log('Found SkinnedMesh:', child.name)
        console.log('Skeleton bones:', child.skeleton?.bones.length)
        console.log('Skeleton root:', child.skeleton?.bones[0]?.name)
      }
    })

    // AnimationMixerを作成（シーン全体をルートに）
    const mixer = new THREE.AnimationMixer(scene)
    mixerRef.current = mixer

    // アニメーションクリップを取得
    const clip = animations.find(c => c.name === 'Jog_Fwd_Loop') || animations[0]
    if (clip) {
      console.log('Using clip:', clip.name, 'duration:', clip.duration)
      console.log('Track count:', clip.tracks.length)
      console.log('First track:', clip.tracks[0]?.name)

      // PropertyBindingの解決を確認
      const testBone = scene.getObjectByName('root')
      console.log('Can find root bone in scene:', !!testBone, testBone?.uuid?.substring(0, 8))
      rootBoneRef.current = testBone

      // ボーンの初期状態を記録
      if (testBone) {
        console.log('Initial root bone position:', testBone.position.x, testBone.position.y, testBone.position.z)
        console.log('Initial root bone rotation:', testBone.rotation.x, testBone.rotation.y, testBone.rotation.z)
      }

      const action = mixer.clipAction(clip)
      actionRef.current = action
      action.setLoop(THREE.LoopRepeat)
      action.clampWhenFinished = false
      action.play()

      console.log('Action created and playing')
      console.log('Action isRunning:', action.isRunning())
    }

    return () => {
      mixer.stopAllAction()
      mixerRef.current = null
      actionRef.current = null
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

      // 30フレームごとにボーンの変換を確認
      frameCount.current++
      if (frameCount.current % 30 === 0 && rootBoneRef.current) {
        const bone = rootBoneRef.current
        console.log('Root bone transform:',
          'pos:', bone.position.x.toFixed(3), bone.position.y.toFixed(3), bone.position.z.toFixed(3),
          'rot:', bone.rotation.x.toFixed(3), bone.rotation.y.toFixed(3), bone.rotation.z.toFixed(3))
      }
    }

    if (!groupRef.current || gameState !== 'playing') return

    const { moveX, moveZ } = input
    const moving = moveX !== 0 || moveZ !== 0

    // 移動状態が変化した時にアニメーションを制御
    if (moving !== isMoving.current) {
      isMoving.current = moving
      if (actionRef.current) {
        actionRef.current.paused = !moving
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
