import { useRef, useMemo, Suspense } from 'react'
import { useGameStore } from '../../stores/gameStore'
import { useGLTF, Instances, Instance, Sky, Environment, Cloud } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Physics, RigidBody } from '@react-three/rapier'
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

function Ground() {
    return (
        <RigidBody type="fixed" colliders="hull" friction={1}>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
                <planeGeometry args={[1000, 1000]} />
                <meshStandardMaterial color="#5a8f5a" />
            </mesh>
        </RigidBody>
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
        // Forest loop
        for (let i = 0; i < 300; i++) {
            const r = 30 + Math.random() * 120 // Distance from center
            const theta = Math.random() * Math.PI * 2

            const x = r * Math.cos(theta)
            const z = r * Math.sin(theta)

            // Safety: Ensure spawn point (0, 0, 50) and path to town (0, 0, 60) are clear
            const dx = x - 0
            const dz = z - 50
            const distToSpawn = Math.sqrt(dx * dx + dz * dz)

            // Also clear the center slightly
            if (r < 40 && Math.abs(z) < 10 && Math.abs(x) < 10) continue;

            if (distToSpawn < 15) continue; // 15 unit radius clear around spawn

            instances.push({
                position: [x, 0, z],
                rotation: [0, Math.random() * Math.PI * 2, 0],
                scale: 1 + Math.random() * 0.8
            })
        }
        return instances
    }, [])

    const grassData = useMemo(() => {
        const instances = []
        for (let i = 0; i < 2000; i++) {
            const x = (Math.random() - 0.5) * 200
            const z = (Math.random() - 0.5) * 200
            instances.push({
                position: [x, 0, z],
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
