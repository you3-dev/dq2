import { useRef, Suspense, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { WORLD_CONFIG } from '../../constants/config'

// GLTFモデルをプリロード
useGLTF.preload('/models/environment/fantasy-town/tree.glb')
useGLTF.preload('/models/environment/fantasy-town/tree-high.glb')
useGLTF.preload('/models/environment/fantasy-town/rock-large.glb')
useGLTF.preload('/models/environment/fantasy-town/rock-small.glb')
useGLTF.preload('/models/environment/fantasy-town/wall-door.glb')
useGLTF.preload('/models/environment/fantasy-town/roof-gable.glb')
useGLTF.preload('/models/environment/fantasy-town/windmill.glb')
useGLTF.preload('/models/environment/fantasy-town/stall-green.glb')
useGLTF.preload('/models/environment/fantasy-town/fountain-round.glb')

export function World() {
  return (
    <group>
      {/* 地面 */}
      <Ground />

      {/* 環境オブジェクト */}
      <Suspense fallback={null}>
        <Trees />
        <Rocks />
        <VillageBuildings />
        <Decorations />
      </Suspense>
    </group>
  )
}

function Ground() {
  const size = WORLD_CONFIG.groundSize

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[size, size, 32, 32]} />
      <meshStandardMaterial color="#5a8f5a" />
    </mesh>
  )
}

// GLTFモデルの木
function GLTFTree({ position, scale = 1, rotation = 0 }) {
  const { scene } = useGLTF('/models/environment/fantasy-town/tree.glb')
  const clonedScene = useMemo(() => scene.clone(), [scene])

  return (
    <primitive
      object={clonedScene}
      position={position}
      scale={scale}
      rotation={[0, rotation, 0]}
      castShadow
      receiveShadow
    />
  )
}

function GLTFTreeHigh({ position, scale = 1, rotation = 0 }) {
  const { scene } = useGLTF('/models/environment/fantasy-town/tree-high.glb')
  const clonedScene = useMemo(() => scene.clone(), [scene])

  return (
    <primitive
      object={clonedScene}
      position={position}
      scale={scale}
      rotation={[0, rotation, 0]}
      castShadow
      receiveShadow
    />
  )
}

function Trees() {
  const treePositions = [
    { pos: [8, 0, -10], scale: 1.2, type: 'normal' },
    { pos: [-10, 0, -8], scale: 1.0, type: 'high' },
    { pos: [15, 0, 5], scale: 1.3, type: 'normal' },
    { pos: [-15, 0, 12], scale: 1.1, type: 'high' },
    { pos: [12, 0, 18], scale: 1.0, type: 'normal' },
    { pos: [-8, 0, -18], scale: 1.4, type: 'high' },
    { pos: [20, 0, -5], scale: 1.2, type: 'normal' },
    { pos: [-18, 0, -15], scale: 1.0, type: 'normal' },
    { pos: [5, 0, 25], scale: 1.3, type: 'high' },
    { pos: [-22, 0, 8], scale: 1.1, type: 'normal' },
    { pos: [25, 0, 15], scale: 1.0, type: 'high' },
    { pos: [-12, 0, 22], scale: 1.2, type: 'normal' },
  ]

  return (
    <group>
      {treePositions.map((tree, index) => (
        tree.type === 'high' ? (
          <GLTFTreeHigh
            key={index}
            position={tree.pos}
            scale={tree.scale}
            rotation={Math.random() * Math.PI * 2}
          />
        ) : (
          <GLTFTree
            key={index}
            position={tree.pos}
            scale={tree.scale}
            rotation={Math.random() * Math.PI * 2}
          />
        )
      ))}
    </group>
  )
}

// GLTFモデルの岩
function GLTFRock({ position, scale = 1, type = 'large' }) {
  const modelPath = type === 'large'
    ? '/models/environment/fantasy-town/rock-large.glb'
    : '/models/environment/fantasy-town/rock-small.glb'
  const { scene } = useGLTF(modelPath)
  const clonedScene = useMemo(() => scene.clone(), [scene])

  return (
    <primitive
      object={clonedScene}
      position={position}
      scale={scale}
      rotation={[0, Math.random() * Math.PI * 2, 0]}
      castShadow
      receiveShadow
    />
  )
}

function Rocks() {
  const rockPositions = [
    { pos: [18, 0, 10], scale: 1.0, type: 'large' },
    { pos: [-12, 0, 15], scale: 0.8, type: 'small' },
    { pos: [8, 0, -18], scale: 1.2, type: 'large' },
    { pos: [-20, 0, -10], scale: 0.7, type: 'small' },
    { pos: [25, 0, -2], scale: 0.9, type: 'large' },
    { pos: [-5, 0, 28], scale: 1.1, type: 'small' },
  ]

  return (
    <group>
      {rockPositions.map((rock, index) => (
        <GLTFRock
          key={index}
          position={rock.pos}
          scale={rock.scale}
          type={rock.type}
        />
      ))}
    </group>
  )
}

// 村の建物（GLTFモデル）
function VillageHouse({ position, rotation = 0, scale = 1 }) {
  const wallModel = useGLTF('/models/environment/fantasy-town/wall-door.glb')
  const roofModel = useGLTF('/models/environment/fantasy-town/roof-gable.glb')

  const wallScene = useMemo(() => wallModel.scene.clone(), [wallModel.scene])
  const roofScene = useMemo(() => roofModel.scene.clone(), [roofModel.scene])

  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      <primitive object={wallScene} position={[0, 0, 0]} castShadow receiveShadow />
      <primitive object={roofScene} position={[0, 2, 0]} castShadow receiveShadow />
    </group>
  )
}

function Windmill({ position, rotation = 0, scale = 1 }) {
  const { scene } = useGLTF('/models/environment/fantasy-town/windmill.glb')
  const clonedScene = useMemo(() => scene.clone(), [scene])

  return (
    <primitive
      object={clonedScene}
      position={position}
      rotation={[0, rotation, 0]}
      scale={scale}
      castShadow
      receiveShadow
    />
  )
}

function Stall({ position, rotation = 0, scale = 1 }) {
  const { scene } = useGLTF('/models/environment/fantasy-town/stall-green.glb')
  const clonedScene = useMemo(() => scene.clone(), [scene])

  return (
    <primitive
      object={clonedScene}
      position={position}
      rotation={[0, rotation, 0]}
      scale={scale}
      castShadow
      receiveShadow
    />
  )
}

function Fountain({ position, scale = 1 }) {
  const { scene } = useGLTF('/models/environment/fantasy-town/fountain-round.glb')
  const clonedScene = useMemo(() => scene.clone(), [scene])

  return (
    <primitive
      object={clonedScene}
      position={position}
      scale={scale}
      castShadow
      receiveShadow
    />
  )
}

function VillageBuildings() {
  return (
    <group>
      {/* 村の中心部 - 噴水 */}
      <Fountain position={[0, 0, 0]} scale={1.5} />

      {/* 風車（村のシンボル） */}
      <Windmill position={[-15, 0, -20]} rotation={Math.PI / 4} scale={1.2} />

      {/* 家々 */}
      <VillageHouse position={[-8, 0, -12]} rotation={Math.PI / 6} scale={1.5} />
      <VillageHouse position={[10, 0, -15]} rotation={-Math.PI / 4} scale={1.3} />
      <VillageHouse position={[-12, 0, 8]} rotation={Math.PI / 3} scale={1.4} />
      <VillageHouse position={[15, 0, 10]} rotation={-Math.PI / 6} scale={1.2} />

      {/* 屋台 */}
      <Stall position={[5, 0, -5]} rotation={Math.PI / 2} scale={1.0} />
      <Stall position={[-5, 0, 5]} rotation={-Math.PI / 2} scale={1.0} />
    </group>
  )
}

function Decorations() {
  // 道を表現するための追加装飾
  return (
    <group>
      {/* 村の入口付近のランタン風オブジェクト */}
      <pointLight position={[0, 3, -8]} intensity={0.5} color="#ffaa44" distance={10} />
      <pointLight position={[0, 3, 8]} intensity={0.5} color="#ffaa44" distance={10} />
    </group>
  )
}
