import { useRef, Suspense, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { WORLD_CONFIG } from '../../constants/config'
import { getModelPath } from '../../utils/paths'
import { useGameStore } from '../../stores/gameStore'
import { getMapById } from '../../data/maps'
import { getNPCsByMapId } from '../../data/npcs'
import { TransitionTrigger } from './TransitionTrigger'
import { NPC } from './NPC'

// モデルパス定義
const MODEL_PATHS = {
  tree: getModelPath('environment/fantasy-town/tree.glb'),
  treeHigh: getModelPath('environment/fantasy-town/tree-high.glb'),
  rockLarge: getModelPath('environment/fantasy-town/rock-large.glb'),
  rockSmall: getModelPath('environment/fantasy-town/rock-small.glb'),
  wall: getModelPath('environment/fantasy-town/wall.glb'),
  wallDoor: getModelPath('environment/fantasy-town/wall-door.glb'),
  wallWindow: getModelPath('environment/fantasy-town/wall-window-glass.glb'),
  roof: getModelPath('environment/fantasy-town/roof.glb'),
  roofGable: getModelPath('environment/fantasy-town/roof-gable.glb'),
  windmill: getModelPath('environment/fantasy-town/windmill.glb'),
  stallGreen: getModelPath('environment/fantasy-town/stall-green.glb'),
  stallRed: getModelPath('environment/fantasy-town/stall-red.glb'),
  fountainRound: getModelPath('environment/fantasy-town/fountain-round.glb'),
  barrel: getModelPath('environment/retro-medieval-kit/detail-barrel.glb'),
  crate: getModelPath('environment/retro-medieval-kit/detail-crate.glb'),
  bench: getModelPath('environment/fantasy-town/stall-bench.glb'),
  fence: getModelPath('environment/fantasy-town/fence.glb'),
}

// GLTFモデルをプリロード
Object.values(MODEL_PATHS).forEach(path => useGLTF.preload(path))

export function World() {
  const currentMapId = useGameStore(state => state.currentMapId)
  const mapData = useMemo(() => getMapById(currentMapId), [currentMapId])
  const npcs = useMemo(() => getNPCsByMapId(currentMapId), [currentMapId])

  if (!mapData) return null

  return (
    <group>
      {/* 地面 */}
      <Ground color={mapData.type === 'field' ? '#4a7f4a' : '#5a8f5a'} />

      {/* 環境オブジェクト */}
      <Suspense fallback={null}>
        {currentMapId === 'town_start' && (
          <>
            <VillageBuildings />
            <Decorations />
          </>
        )}

        {currentMapId === 'field_start' && (
          <>
            <Trees />
            <Rocks />
          </>
        )}

        {/* NPCの動的レンダリング */}
        {npcs.map(npc => (
          <NPC
            key={npc.id}
            position={npc.defaultPosition}
            rotation={npc.defaultRotation}
            name={npc.name}
            dialog={npc.dialogId}
            modelPath={npc.modelPath}
            scale={npc.scale || 1}
          />
        ))}

        {/* マップ間の接続トリガー */}
        {Object.entries(mapData.connections || {}).map(([id, conn]) => (
          <TransitionTrigger
            key={id}
            position={[conn.entryPoint.x, conn.entryPoint.y + 1, conn.entryPoint.z]}
            size={[3, 4, 3]}
            targetMapId={conn.targetMapId}
          />
        ))}
      </Suspense>
    </group>
  )
}

function Ground({ color }) {
  const size = WORLD_CONFIG.groundSize

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[size, size, 32, 32]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

// ... 以降、既存のコンポーネント（GLTFTree, GLTFTreeHigh, Trees, GLTFRock, Rocks, VillageHouse, Windmill, Stall, Fountain, VillageBuildings, Decorations）を保持

// GLTFモデルの木
function GLTFTree({ position, scale = 1, rotation = 0 }) {
  const { scene } = useGLTF(MODEL_PATHS.tree)
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
  const { scene } = useGLTF(MODEL_PATHS.treeHigh)
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
  const modelPath = type === 'large' ? MODEL_PATHS.rockLarge : MODEL_PATHS.rockSmall
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

// GLTFモデルの小道具
function Prop({ modelName, position, rotation = 0, scale = 1 }) {
  const { scene } = useGLTF(MODEL_PATHS[modelName])
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

function Barrel(props) { return <Prop modelName="barrel" {...props} /> }
function Crate(props) { return < Prop modelName="crate" {...props} /> }
function Bench(props) { return <Prop modelName="bench" {...props} /> }
function Fence(props) { return <Prop modelName="fence" {...props} /> }

// 村の建物（モジュール式）
function VillageHouse({ position, rotation = 0, scale = 1.5 }) {
  const wallDoor = useGLTF(MODEL_PATHS.wallDoor)
  const wallWindow = useGLTF(MODEL_PATHS.wallWindow)
  const roof = useGLTF(MODEL_PATHS.roofGable)

  const wallDoorScene = useMemo(() => wallDoor.scene.clone(), [wallDoor.scene])
  const wallWindowScene = useMemo(() => wallWindow.scene.clone(), [wallWindow.scene])
  const roofScene = useMemo(() => roof.scene.clone(), [roof.scene])

  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      {/* 1階 */}
      <primitive object={wallDoorScene} position={[0, 0, 0]} castShadow receiveShadow />
      <primitive object={wallWindowScene} position={[2, 0, 0]} castShadow receiveShadow />
      <primitive object={wallWindowScene} position={[-2, 0, 0]} castShadow receiveShadow />
      <primitive object={wallWindowScene} position={[0, 0, -2]} castShadow receiveShadow />

      {/* 屋根 */}
      <primitive object={roofScene} position={[0, 2, 0]} scale={[1.1, 1, 1.1]} castShadow receiveShadow />
    </group>
  )
}

function Windmill({ position, rotation = 0, scale = 1 }) {
  const { scene } = useGLTF(MODEL_PATHS.windmill)
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

function Stall({ position, rotation = 0, scale = 1, type = 'green' }) {
  const { scene } = useGLTF(type === 'red' ? MODEL_PATHS.stallRed : MODEL_PATHS.stallGreen)
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
  const { scene } = useGLTF(MODEL_PATHS.fountainRound)
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
      <Bench position={[4, 0, 0]} rotation={Math.PI / 2} scale={1.2} />
      <Bench position={[-4, 0, 0]} rotation={-Math.PI / 2} scale={1.2} />

      {/* 風車（村のシンボル） */}
      <Windmill position={[-18, 0, -25]} rotation={Math.PI / 4} scale={1.5} />

      {/* 家々 */}
      <VillageHouse position={[-12, 0, -15]} rotation={Math.PI / 4} scale={1.5} />
      <VillageHouse position={[15, 0, -18]} rotation={-Math.PI / 6} scale={1.5} />
      <VillageHouse position={[-15, 0, 10]} rotation={Math.PI / 2} scale={1.5} />
      <VillageHouse position={[18, 0, 12]} rotation={-Math.PI / 2} scale={1.5} />

      {/* 屋台（お店） */}
      <Stall position={[8, 0, -5]} rotation={Math.PI / 2} scale={1.2} />
      <Stall position={[-8, 0, 5]} rotation={-Math.PI / 2} scale={1.2} type="red" />

      {/* 小道具の配置 */}
      <Barrel position={[5, 0, -7]} scale={0.8} />
      <Barrel position={[5.5, 0, -6.5]} scale={0.8} />
      <Crate position={[-5, 0, 7]} scale={1.0} />
      <Crate position={[-6, 0, 7.5]} rotation={Math.PI / 6} scale={1.0} />

      {/* 境界の柵 */}
      <Fence position={[0, 0, -48]} scale={2} />
      <Fence position={[10, 0, -48]} scale={2} />
      <Fence position={[-10, 0, -48]} scale={2} />
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
