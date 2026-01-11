import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from '../../stores/gameStore'

/**
 * 特定の領域に入った時にマップ遷移を発生させるコンポーネント
 * ワールド座標を使用して判定を行うため、グループ内に配置されていても正しく動作します。
 */
export function TransitionTrigger({ position, size = [2, 2, 2], targetMapId, spawnPointId = 'default' }) {
    const switchMap = useGameStore(state => state.switchMap)
    const isTransitioning = useGameStore(state => state.isTransitioning)
    const playerPosition = useGameStore(state => state.player.position)

    const meshRef = useRef()
    const hasTriggered = useRef(false)
    const worldPos = useMemo(() => new THREE.Vector3(), [])

    useFrame(() => {
        if (hasTriggered.current || isTransitioning || !meshRef.current) return

        // メッシュのワールド座標を取得
        meshRef.current.getWorldPosition(worldPos)

        // AABBによる当たり判定
        const halfSize = [size[0] / 2, size[1] / 2, size[2] / 2]

        const isInside =
            playerPosition[0] >= worldPos.x - halfSize[0] &&
            playerPosition[0] <= worldPos.x + halfSize[0] &&
            playerPosition[2] >= worldPos.z - halfSize[2] &&
            playerPosition[2] <= worldPos.z + halfSize[2]

        if (isInside) {
            hasTriggered.current = true
            switchMap(targetMapId, spawnPointId)
        }
    })

    return (
        <mesh ref={meshRef} position={position} visible={false}>
            <boxGeometry args={size} />
            <meshBasicMaterial color="yellow" wireframe transparent opacity={0.5} />
        </mesh>
    )
}
