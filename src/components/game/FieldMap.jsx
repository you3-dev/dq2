import { useRef, useMemo, Suspense } from 'react'
import { useGameStore } from '../../stores/gameStore'
import { useGLTF, Instances, Instance, Sky, Cloud } from '@react-three/drei'
import * as THREE from 'three'
import { TransitionTrigger } from './TransitionTrigger'
import { NPC } from './NPC'
import { getNPCsByMapId } from '../../data/npcs'
import { getMapById } from '../../data/maps'
import { getModelPath } from '../../utils/paths'

const NATURE_PATH = 'environment/nature-kit/'
const MODEL_PATHS = {
    birch1: getModelPath(NATURE_PATH + 'BirchTree_1.gltf'),
    birch2: getModelPath(NATURE_PATH + 'BirchTree_2.gltf'),
    maple1: getModelPath(NATURE_PATH + 'MapleTree_1.gltf'),
    maple2: getModelPath(NATURE_PATH + 'MapleTree_2.gltf'),
    bush1: getModelPath(NATURE_PATH + 'Bush.gltf'),
    bush2: getModelPath(NATURE_PATH + 'Bush_Large.gltf'),
    grass1: getModelPath(NATURE_PATH + 'Grass_Large.gltf'),
    grass2: getModelPath(NATURE_PATH + 'Grass_Small.gltf'),
    flower1: getModelPath(NATURE_PATH + 'Flower_1.gltf'),
}

// Preload
Object.values(MODEL_PATHS).forEach(path => useGLTF.preload(path))

export function FieldMap() {
    const currentMapId = useGameStore(state => state.currentMapId)
    const mapData = useMemo(() => getMapById(currentMapId), [currentMapId])
    const npcs = useMemo(() => getNPCsByMapId(currentMapId), [currentMapId])

    if (currentMapId !== 'field_start') return null

    return (
        <group>
            <ambientLight intensity={0.5} />
            <directionalLight position={[50, 50, 25]} intensity={1.5} castShadow />
            <Sky sunPosition={[100, 20, 100]} turbidity={0.5} rayleigh={0.5} />
            <Cloud segments={30} bounds={[50, 5, 50]} volume={60} color="#f0f0f0" position={[0, 40, 0]} opacity={0.4} />

            <Ground />
            <NatureInstances />

            {/* NPCs if any */}
            {npcs.map(npc => (
                <NPC key={npc.id} {...npc} />
            ))}

            {/* Transitions defined in mapData are rendered by World.jsx, 
           but here we can rely on World.jsx's common renderer OR 
           if we want specific placement logic we can do it here.
           Currently World.jsx renders connections for ALL maps.
           So we don't need manual TransitionTrigger here.
       */}
        </group>
    )
}

const getHeight = (x, z) => {
    // 地面の起伏計算ロジック（Groundコンポーネントと同期させる）
    return Math.sin(x * 0.05) * Math.cos(z * 0.05) * 2 +
        Math.sin(x * 0.1) * 0.5
}

function Ground() {
    const size = 500
    const segments = 100
    const geometry = useMemo(() => {
        const geo = new THREE.PlaneGeometry(size, size, segments, segments)
        const vertices = geo.attributes.position.array
        for (let i = 0; i < vertices.length; i += 3) {
            const x = vertices[i]
            const y = vertices[i + 1]
            vertices[i + 2] = getHeight(x, -y)
        }
        geo.computeVertexNormals()
        return geo
    }, [])

    return (
        <mesh name="ground" geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <meshStandardMaterial color="#5a8f5a" flatShading={false} />
        </mesh>
    )
}

function NatureInstances() {
    const birch1 = useGLTF(MODEL_PATHS.birch1)
    const maple1 = useGLTF(MODEL_PATHS.maple1)
    const bush1 = useGLTF(MODEL_PATHS.bush1)
    const grass1 = useGLTF(MODEL_PATHS.grass1)

    // Instance Data Generation
    const treeData = useMemo(() => {
        const instances = []
        for (let i = 0; i < 300; i++) {
            const r = 30 + Math.random() * 120
            const theta = Math.random() * Math.PI * 2
            const x = r * Math.cos(theta)
            const z = r * Math.sin(theta)

            const dx = x - 0
            const dz = z - 50
            const distToSpawn = Math.sqrt(dx * dx + dz * dz)

            if (r < 40 && Math.abs(z) < 10 && Math.abs(x) < 10) continue;
            if (distToSpawn < 15) continue;

            const y = getHeight(x, z)

            instances.push({
                position: [x, y, z],
                rotation: [0, Math.random() * Math.PI * 2, 0],
                scale: 1 + Math.random() * 0.8
            })
        }
        return instances
    }, [])

    const grassData = useMemo(() => {
        const instances = []
        for (let i = 0; i < 2000; i++) {
            const x = (Math.random() - 0.5) * 300
            const z = (Math.random() - 0.5) * 300
            const y = getHeight(x, z)
            instances.push({
                position: [x, y, z],
                rotation: [0, Math.random() * Math.PI, 0],
                scale: 0.8 + Math.random() * 0.4
            })
        }
        return instances
    }, [])

    return (
        <group>
            <InstancedModel model={birch1} data={treeData.slice(0, 150)} />
            <InstancedModel model={maple1} data={treeData.slice(150, 300)} />
            <InstancedModel model={grass1} data={grassData} />
            <InstancedModel model={bush1} data={treeData.slice(0, 50).map(d => ({ ...d, scale: 0.5 }))} />
        </group>
    )
}

function InstancedModel({ model, data }) {
    const mesh = useMemo(() => {
        let found = null
        model.scene.traverse(child => {
            if (child.isMesh && !found) found = child
        })
        return found
    }, [model])

    if (!mesh) return null

    return (
        <Instances range={data.length} geometry={mesh.geometry} material={mesh.material}>
            {data.map((d, i) => (
                <Instance key={i} position={d.position} rotation={d.rotation} scale={d.scale} />
            ))}
        </Instances>
    )
}
