import { useGameStore } from '../../stores/gameStore'

/**
 * 画面遷移時のフェード演出用コンポーネント
 */
export function FadeTransition() {
    const isTransitioning = useGameStore(state => state.isTransitioning)

    return (
        <div
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: '#000',
                pointerEvents: 'none',
                opacity: isTransitioning ? 1 : 0,
                transition: 'opacity 0.5s ease-in-out',
                zIndex: 1000,
            }}
        />
    )
}
