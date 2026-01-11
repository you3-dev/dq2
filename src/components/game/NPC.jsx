import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { useGameStore } from '../../stores/gameStore'

export function NPC({ position, name, dialog, modelPath, scale = 1, rotation = 0 }) {
  const groupRef = useRef()
  const { input, openDialog, player, gameState } = useGameStore()
  const wasActionPressed = useRef(false)
  const mixerRef = useRef(null)

  // GLTFモデルの読み込み（modelPathが指定されている場合のみ）
  const { scene, animations } = useGLTF(modelPath || null)

  // アニメーションのセットアップ
  useEffect(() => {
    if (!scene || !animations || animations.length === 0) return

    const mixer = new THREE.AnimationMixer(scene)
    mixerRef.current = mixer

    // Idleアニメーションを探して再生
    const idleClip = animations.find(c => c.name === 'Idle') || animations.find(c => c.name.includes('Idle')) || animations[0]

    if (idleClip) {
      const action = mixer.clipAction(idleClip)
      action.play()
    }

    return () => {
      mixer.stopAllAction()
      mixerRef.current = null
    }
  }, [scene, animations])

  useFrame((state, delta) => {
    // アニメーション更新
    if (mixerRef.current) {
      mixerRef.current.update(delta)
    }

    if (!groupRef.current) return

    // プレイヤーとの距離を計算
    const distance = Math.sqrt(
      Math.pow(player.position[0] - position[0], 2) +
      Math.pow(player.position[2] - position[2], 2)
    )

    // アクションボタンが押された時
    if (input.action && !wasActionPressed.current && gameState === 'playing') {
      if (distance < 3) {
        openDialog(name, dialog)
      }
    }
    wasActionPressed.current = input.action

    // NPCをプレイヤーの方向に向ける（近くにいる時）
    // ※回転オフセットを考慮して調整
    if (distance < 5 && distance > 0) {
      const angle = Math.atan2(
        player.position[0] - position[0],
        player.position[2] - position[2]
      )
      // モデルが元々180度回転している場合などはここで調整が必要だが、
      // 一旦そのまま適用し、必要ならpropでオフセットを受け取るようにする
      groupRef.current.rotation.y = angle
    }
  })

  // モデル読み込み中のフォールバック（またはエラー時）
  if (!modelPath) return null

  return (
    <group ref={groupRef} position={position} rotation={[0, rotation, 0]}>
      <primitive
        object={scene}
        scale={scale}
        castShadow
        receiveShadow
      />

      {/* 名前表示用のビルボード（デバッグ用などで必要なら戻す） */}
      {/* <DialogIndicator position={[0, 2.5, 0]} /> */}
    </group>
  )
}
