import { useRef, useEffect, useMemo, Suspense } from 'react'
import { useFrame, useGraph } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { SkeletonUtils } from 'three-stdlib'
import { useGameStore } from '../../stores/gameStore'
import { getModelPath } from '../../utils/paths'

/**
 * NPCのラッパーコンポーネント
 */
export function NPC(props) {
  const { modelPath, name } = props
  if (!modelPath) {
    console.warn(`NPC with missing modelPath: ${name}`)
    return null
  }

  const displayName = typeof name === 'object' ? (name.ja || name.en || '???') : name

  return (
    <Suspense fallback={
      <mesh position={props.position ? [props.position.x || props.position[0], 1, props.position.z || props.position[2]] : [0, 0, 0]}>
        <boxGeometry args={[0.5, 2, 0.5]} />
        <meshBasicMaterial color="blue" wireframe />
      </mesh>
    }>
      <NPCContent {...props} displayName={displayName} />
    </Suspense>
  )
}

function NPCContent({ position, name, displayName, dialog, modelPath, scale = 1, rotation = 0 }) {
  const groupRef = useRef()
  const { input, openDialog, player, gameState } = useGameStore()
  const wasActionPressed = useRef(false)
  const mixerRef = useRef(null)

  // データの正規化
  const posArr = useMemo(() => {
    return Array.isArray(position) ? position : [position.x, position.y, position.z]
  }, [position])

  const fullModelPath = useMemo(() => {
    return modelPath.startsWith('/models/') ? modelPath : getModelPath(modelPath)
  }, [modelPath])

  // GLTFモデルの読み込み
  const { scene, animations } = useGLTF(fullModelPath)

  // SkinnedMesh対応のクローン
  const clonedScene = useMemo(() => SkeletonUtils.clone(scene), [scene])

  // クローンしたシーン内のノードにアクセスしやすくする（アニメーション等用）
  // eslint-disable-next-line no-unused-vars
  const { nodes, materials } = useGraph(clonedScene)

  // アニメーションのセットアップ
  useEffect(() => {
    if (!clonedScene || !animations || animations.length === 0) return

    const mixer = new THREE.AnimationMixer(clonedScene)
    mixerRef.current = mixer

    const idleClip = animations.find(c => c.name === 'Idle') ||
      animations.find(c => c.name.includes('Idle')) ||
      animations[0]

    if (idleClip) {
      const action = mixer.clipAction(idleClip)
      action.play()
    }

    return () => {
      mixer.stopAllAction()
      mixerRef.current = null
    }
  }, [clonedScene, animations])

  useFrame((state, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta)
    }

    if (!groupRef.current) return

    const distance = Math.sqrt(
      Math.pow(player.position[0] - posArr[0], 2) +
      Math.pow(player.position[2] - posArr[2], 2)
    )

    if (input.action && !wasActionPressed.current && gameState === 'playing') {
      if (distance < 3) {
        const dialogId = typeof dialog === 'object' ? (dialog.id || null) : dialog
        if (dialogId) {
          openDialog(displayName, dialogId)
        }
      }
    }
    wasActionPressed.current = input.action

    if (distance < 5 && distance > 0.5) {
      const angle = Math.atan2(
        player.position[0] - posArr[0],
        player.position[2] - posArr[2]
      )
      groupRef.current.rotation.y = angle
    }
  })

  const rotationRad = useMemo(() => (rotation * Math.PI) / 180, [rotation])

  return (
    <group ref={groupRef} position={posArr} rotation={[0, rotationRad, 0]}>
      <primitive
        object={clonedScene}
        scale={scale}
        castShadow
        receiveShadow
      />
    </group>
  )
}
