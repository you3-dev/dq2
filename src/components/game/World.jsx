import { useRef, Suspense, useMemo } from 'react'
import { useGLTF, Instances, Instance } from '@react-three/drei'
import { WORLD_CONFIG } from '../../constants/config'
import { getModelPath } from '../../utils/paths'
import { useGameStore } from '../../stores/gameStore'
import { getMapById } from '../../data/maps'
import { getNPCsByMapId } from '../../data/npcs'
import { TransitionTrigger } from './TransitionTrigger'
import { NPC } from './NPC'
import { FieldMap } from './FieldMap'

const KIT_PATH = 'environment/new-kit/'

const MODEL_PATHS = {
  wallPlaster: getModelPath(KIT_PATH + 'Wall_Plaster_Straight.gltf'),
  wallPlasterDoor: getModelPath(KIT_PATH + 'Wall_Plaster_Door_Round.gltf'),
  wallPlasterWindow: getModelPath(KIT_PATH + 'Wall_Plaster_Window_Thin_Round.gltf'),
  wallBrickCorner: getModelPath(KIT_PATH + 'Corner_Exterior_Brick.gltf'),
  wallPlasterCorner: getModelPath(KIT_PATH + 'Corner_Exterior_Wood.gltf'),
  roof4x4: getModelPath(KIT_PATH + 'Roof_RoundTiles_4x4.gltf'),
  roof6x6: getModelPath(KIT_PATH + 'Roof_RoundTiles_6x6.gltf'),
  roof6x10: getModelPath(KIT_PATH + 'Roof_RoundTiles_6x10.gltf'),
  roofTower: getModelPath(KIT_PATH + 'Roof_Tower_RoundTiles.gltf'),
  floorBrick: getModelPath(KIT_PATH + 'Floor_Brick.gltf'),
  floorWood: getModelPath(KIT_PATH + 'Floor_WoodDark.gltf'),
  wagon: getModelPath(KIT_PATH + 'Prop_Wagon.gltf'),
  crate: getModelPath(KIT_PATH + 'Prop_Crate.gltf'),
  chimney: getModelPath(KIT_PATH + 'Prop_Chimney.gltf'),
  fountain: getModelPath('environment/fantasy-town/fountain-round.glb'),
  windmill: getModelPath('environment/fantasy-town/windmill.glb'),
  bench: getModelPath('environment/fantasy-town/stall-bench.glb'),
  fence: getModelPath('environment/fantasy-town/fence.glb'),
  tree: getModelPath('environment/fantasy-town/tree.glb'),
  treeHigh: getModelPath('environment/fantasy-town/tree-high.glb'),
}

Object.values(MODEL_PATHS).forEach(path => useGLTF.preload(path))

export function World() {
  const currentMapId = useGameStore(state => state.currentMapId)
  const mapData = useMemo(() => getMapById(currentMapId), [currentMapId])
  const npcs = useMemo(() => getNPCsByMapId(currentMapId), [currentMapId])

  if (!mapData) return null

  return (
    <group>
      <Suspense fallback={null}>
        {currentMapId === 'town_start' ? (
          <TiledGround />
        ) : (
          <Ground color="#5a8f5a" />
        )}

        {currentMapId === 'town_start' && (
          <>
            <VillageBuildings />
            <Decorations />
          </>
        )}

        {currentMapId === 'field_start' && (
          <FieldMap />
        )}

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

        {Object.entries(mapData.connections || {}).map(([id, conn]) => {
          if (conn.transitionType === 'fade') {
            return (
              <TransitionTrigger
                key={id}
                position={[conn.entryPoint.x, conn.entryPoint.y + 1, conn.entryPoint.z]}
                size={[10, 5, 2]}
                targetMapId={conn.targetMapId}
              />
            )
          }
          return null
        })}
      </Suspense>
    </group>
  )
}

function Ground({ color }) {
  const size = 600
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[size, size]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

/**
 * 循環道路の配置 (Square Loop around focal point)
 */
function TiledGround() {
  const { scene } = useGLTF(MODEL_PATHS.floorBrick)
  const floorMesh = useMemo(() => {
    let mesh = null
    scene.traverse((child) => {
      if (child.isMesh) {
        mesh = child
        mesh.geometry.center()
      }
    })
    return mesh
  }, [scene])

  const tiles = useMemo(() => {
    const positions = []
    const spacing = 2.0
    const roadWidth = 8.0 // Road width in units

    // Outer Loop Road (x: -40 to 40, z: -40 to 40)
    for (let i = -40; i <= 40; i += spacing) {
      // Horizontal paths
      for (let w = -roadWidth / 2; w <= roadWidth / 2; w += spacing) {
        positions.push([i, 0, -40 + w]) // North path
        positions.push([i, 0, 40 + w])  // South path
      }
      // Vertical paths
      for (let w = -roadWidth / 2; w <= roadWidth / 2; w += spacing) {
        positions.push([-40 + w, 0, i]) // West path
        positions.push([40 + w, 0, i])  // East path
      }
    }

    // Central Town Square Connector paths (Cross)
    for (let i = -40; i <= 40; i += spacing) {
      for (let w = -roadWidth / 2; w <= roadWidth / 2; w += spacing) {
        positions.push([i, 0, 0 + w]) // Horizontal cross
        positions.push([0 + w, 0, i]) // Vertical cross
      }
    }

    // Main Square Center (Larger focal point)
    for (let x = -10; x <= 10; x += spacing) {
      for (let z = -10; z <= 10; z += spacing) {
        positions.push([x, 0, z])
      }
    }

    return positions
  }, [])

  if (!floorMesh) return <Ground color="#5a8f5a" />

  return (
    <group>
      <Ground color="#5a8f5a" />
      <Instances range={tiles.length} geometry={floorMesh.geometry} material={floorMesh.material}>
        {tiles.map((pos, i) => (
          <Instance key={i} position={pos} />
        ))}
      </Instances>
    </group>
  )
}

function Prop({ modelPath, position, rotation = 0, scale = 1 }) {
  if (!modelPath) return null
  const { scene } = useGLTF(modelPath)
  const clonedScene = useMemo(() => scene.clone(), [scene])
  return (
    <primitive object={clonedScene} position={position} rotation={[0, rotation, 0]} scale={scale} castShadow receiveShadow />
  )
}

/**
 * 壁をタイリングして、建物の「空洞」を完全になくす組み立て
 */
function ModularBuilding({ position, width = 2, depth = 2, type = 'plaster', roofType = '4x4', rotation = 0, targetMapId = null }) {
  const kit = {
    plaster: { wall: MODEL_PATHS.wallPlaster, door: MODEL_PATHS.wallPlasterDoor, window: MODEL_PATHS.wallPlasterWindow, corner: MODEL_PATHS.wallPlasterCorner },
    brick: { wall: MODEL_PATHS.wallPlaster, door: MODEL_PATHS.wallPlasterDoor, window: MODEL_PATHS.wallPlasterWindow, corner: MODEL_PATHS.wallBrickCorner }
  }[type]

  const roofModel = roofType === 'tower' ? MODEL_PATHS.roofTower : MODEL_PATHS['roof' + roofType]

  // Quaternius walls are 2 units wide. Walls need to populate the span between corners.
  const wallsX = []
  const wallsZ = []
  // Offset walls to perfectly fill gap between corners at ±width, ±depth
  for (let x = -(width - 1); x <= (width - 1); x += 2) wallsX.push(x)
  for (let z = -(depth - 1); z <= (depth - 1); z += 2) wallsZ.push(z)

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* 内部を隠すための床 */}
      <Prop modelPath={MODEL_PATHS.floorWood} position={[0, -0.05, 0]} scale={[width, 1, depth]} />

      {/* 4つの角 (1x1 unit pivot usually) */}
      <Prop modelPath={kit.corner} position={[-width, 0, -depth]} rotation={0} />
      <Prop modelPath={kit.corner} position={[width, 0, -depth]} rotation={-Math.PI / 2} />
      <Prop modelPath={kit.corner} position={[width, 0, depth]} rotation={Math.PI} />
      <Prop modelPath={kit.corner} position={[-width, 0, depth]} rotation={Math.PI / 2} />

      {/* 前後の壁 */}
      {wallsX.map((x, i) => {
        const isDoorPos = Math.abs(x) < 1.0 && targetMapId
        return (
          <group key={`frontback-${i}`}>
            <Prop modelPath={isDoorPos ? kit.door : kit.window} position={[x, 0, depth]} rotation={Math.PI} />
            <Prop modelPath={kit.wall} position={[x, 0, -depth]} rotation={0} />
          </group>
        )
      })}

      {/* 左右の壁 */}
      {wallsZ.map((z, i) => (
        <group key={`sides-${i}`}>
          <Prop modelPath={kit.window} position={[-width, 0, z]} rotation={Math.PI / 2} />
          <Prop modelPath={kit.window} position={[width, 0, z]} rotation={-Math.PI / 2} />
        </group>
      ))}

      {/* 屋根：スケールを調整して壁にフィットさせる */}
      <Prop modelPath={roofModel} position={[0, 2.05, 0]} scale={[width / 2 * 1.05, 1, depth / 2 * 1.05]} />

      {/* 内部の空洞感を防ぐための天井的な厚み（もし必要なら） */}

      {targetMapId && (
        <TransitionTrigger position={[0, 0.5, depth + 1]} size={[2, 3, 1]} targetMapId={targetMapId} spawnPointId="from_town" />
      )}
    </group>
  )
}

function VillageBuildings() {
  return (
    <group>
      {/* 広場 */}
      <Prop modelPath={MODEL_PATHS.fountain} position={[0, 0.4, 0]} scale={2.8} />
      <Prop modelPath={MODEL_PATHS.bench} position={[8, 0.05, 0]} rotation={Math.PI / 2} scale={1.8} />
      <Prop modelPath={MODEL_PATHS.bench} position={[-8, 0.05, 0]} rotation={-Math.PI / 2} scale={1.8} />

      {/* 風車：高さを18.0まで上げて確実に地面から離す */}
      <Prop modelPath={MODEL_PATHS.windmill} position={[-45, 18, -45]} rotation={Math.PI / 4} scale={6.0} />

      {/* 宿屋 (Large) */}
      <ModularBuilding position={[-25, 0, -25]} width={4} depth={4} type="brick" roofType="6x10" rotation={Math.PI / 6} targetMapId="inn_interior" />

      {/* 長老の家 */}
      <ModularBuilding position={[25, 0, -35]} width={2} depth={2} type="plaster" roofType="tower" rotation={-Math.PI / 10} targetMapId="elder_house_interior" />

      {/* 一般民家 */}
      <ModularBuilding position={[-35, 0, 25]} width={2} depth={2} rotation={Math.PI / 1.5} />
      <ModularBuilding position={[35, 0, 20]} width={2} depth={2} rotation={-Math.PI / 3.0} />

      {/* デコレーション */}
      <Prop modelPath={MODEL_PATHS.wagon} position={[15, 0, 15]} rotation={Math.PI / 3} scale={2} />
      <Prop modelPath={MODEL_PATHS.crate} position={[15, 0.5, -15]} scale={1.5} />
      <Prop modelPath={MODEL_PATHS.chimney} position={[-25, 2, -28]} scale={1.5} />

      {/* 境界 */}
      <Prop modelPath={MODEL_PATHS.fence} position={[0, 0.2, -70]} scale={6} />
      <Prop modelPath={MODEL_PATHS.fence} position={[30, 0.2, -70]} scale={6} />
      <Prop modelPath={MODEL_PATHS.fence} position={[-30, 0.2, -70]} scale={6} />
    </group>
  )
}

function Trees() {
  return (
    <group>
      <Prop modelPath={MODEL_PATHS.tree} position={[20, 0, -20]} scale={1.8} />
      <Prop modelPath={MODEL_PATHS.treeHigh} position={[-25, 0, -25]} scale={1.5} />
    </group>
  )
}

function Decorations() {
  return (
    <group>
      <pointLight position={[0, 20, 0]} intensity={2.5} color="#ffeeaa" distance={200} />
      <ambientLight intensity={0.8} />
    </group>
  )
}
