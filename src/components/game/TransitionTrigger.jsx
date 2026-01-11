import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGameStore } from '../../stores/gameStore'

/**
 * 特定の領域に入った時にマップ遷移を発生させるコンポーネント
 */
export function TransitionTrigger({ position, size = [2, 2, 2], targetMapId, spawnPointId = 'default' }) {
    const switchMap = useGameStore(state => state.switchMap)
    const isTransitioning = useGameStore(state => state.isTransitioning)
    const playerPosition = useGameStore(state => state.player.position)

    const hasTriggered = useRef(false)

    useFrame(() => {
        if (hasTriggered.current || isTransitioning) return

        // AABBによる当たり判定
        const halfSize = [size[0] / 2, size[1] / 2, size[2] / 2]

        const isInside =
            playerPosition[0] >= position[0] - halfSize[0] &&
            playerPosition[0] <= position[0] + halfSize[0] &&
            playerPosition[2] >= position[2] - halfSize[2] &&
            playerPosition[2] <= position[2] + halfSize[2]

        if (isInside) {
            hasTriggered.current = true
            switchMap(targetMapId, spawnPointId)
        }
    })

    // デバッグ用（開発時は透明な立方体を表示など）
    return (
        <mesh position={position} visible={false}>
            <boxGeometry args={size} />
            <meshBasicMaterial color="yellow" wireframe transparent opacity={0.5} />
        </mesh>
    )
}
