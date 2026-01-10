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

  // AnimationMixerを手動でセットアップ
  useEffect(() => {
    if (scene && animations.length > 0) {
      console.log('Setting up AnimationMixer')

      // シーン内のSkinnedMeshまたはボーン構造を探す
      let animationRoot = scene

      // シーン内を走査してSkinnedMeshを探す
      scene.traverse((child) => {
        if (child.isSkinnedMesh) {
          console.log('Found SkinnedMesh:', child.name)
          console.log('Skeleton root:', child.skeleton?.bones[0]?.parent?.name)
        }
        if (child.type === 'Bone' && child.parent && child.parent.type !== 'Bone') {
          console.log('Found root bone parent:', child.parent.name, child.parent.type)
          // ボーンの親（通常はArmatureやObject3D）を使う
          if (!animationRoot || animationRoot === scene) {
            animationRoot = child.parent.parent || child.parent
          }
        }
      })

      console.log('Using animation root:', animationRoot.name, animationRoot.type)

      // アニメーションクリップのトラック名を確認
      const jogClip = animations.find(clip => clip.name === 'Jog_Fwd_Loop')
      if (jogClip && jogClip.tracks.length > 0) {
        console.log('Sample track names:')
        jogClip.tracks.slice(0, 5).forEach(track => {
          console.log('  -', track.name)
        })
      }

      // ミキサーを作成（シーン全体を使用）
      const mixer = new THREE.AnimationMixer(scene)
      mixerRef.current = mixer

      if (jogClip) {
        const action = mixer.clipAction(jogClip)
        actionRef.current = action
        action.play()
        console.log('Animation started with scene as root')
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

    // 移動状態が変わったらアニメーション切り替え
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

    // 入力がある場合のみ移動
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
