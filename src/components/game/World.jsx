import { useRef } from 'react'
import * as THREE from 'three'
import { WORLD_CONFIG } from '../../constants/config'

export function World() {
  return (
    <group>
      {/* 地面 */}
      <Ground />

      {/* 環境オブジェクト */}
      <Trees />
      <Rocks />
      <Buildings />
    </group>
  )
}

function Ground() {
  const size = WORLD_CONFIG.groundSize

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[size, size, 32, 32]} />
      <meshStandardMaterial color="#4a7c4e" />
    </mesh>
  )
}

function Trees() {
  // ランダムに木を配置
  const treePositions = [
    [5, 0, -8],
    [-7, 0, -5],
    [10, 0, 5],
    [-12, 0, 10],
    [8, 0, 15],
    [-5, 0, -15],
    [15, 0, -3],
    [-10, 0, -12],
    [3, 0, 20],
    [-18, 0, 5],
  ]

  return (
    <group>
      {treePositions.map((pos, index) => (
        <Tree key={index} position={pos} />
      ))}
    </group>
  )
}

function Tree({ position }) {
  const trunkHeight = 1.5 + Math.random() * 0.5
  const leavesRadius = 1.2 + Math.random() * 0.4

  return (
    <group position={position}>
      {/* 幹 */}
      <mesh position={[0, trunkHeight / 2, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.3, trunkHeight, 8]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* 葉 */}
      <mesh position={[0, trunkHeight + leavesRadius * 0.6, 0]} castShadow>
        <coneGeometry args={[leavesRadius, leavesRadius * 2, 8]} />
        <meshStandardMaterial color="#228B22" />
      </mesh>
    </group>
  )
}

function Rocks() {
  const rockPositions = [
    [12, 0, 8],
    [-8, 0, 12],
    [6, 0, -12],
    [-15, 0, -8],
    [20, 0, 0],
  ]

  return (
    <group>
      {rockPositions.map((pos, index) => (
        <Rock key={index} position={pos} scale={0.8 + Math.random() * 0.6} />
      ))}
    </group>
  )
}

function Rock({ position, scale = 1 }) {
  return (
    <mesh position={[position[0], position[1] + 0.3 * scale, position[2]]} scale={scale} castShadow>
      <dodecahedronGeometry args={[0.5, 0]} />
      <meshStandardMaterial color="#808080" roughness={0.8} />
    </mesh>
  )
}

function Buildings() {
  return (
    <group>
      {/* 村の家 */}
      <House position={[-20, 0, -20]} rotation={[0, Math.PI / 4, 0]} />
      <House position={[-25, 0, -15]} rotation={[0, -Math.PI / 6, 0]} />

      {/* 塔 */}
      <Tower position={[25, 0, 25]} />
    </group>
  )
}

function House({ position, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* 壁 */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <boxGeometry args={[4, 3, 4]} />
        <meshStandardMaterial color="#DEB887" />
      </mesh>

      {/* 屋根 */}
      <mesh position={[0, 3.5, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[3.5, 2, 4]} />
        <meshStandardMaterial color="#8B0000" />
      </mesh>

      {/* ドア */}
      <mesh position={[0, 0.8, 2.01]} castShadow>
        <boxGeometry args={[1, 1.6, 0.1]} />
        <meshStandardMaterial color="#5c3317" />
      </mesh>

      {/* 窓 */}
      <mesh position={[1.2, 1.5, 2.01]} castShadow>
        <boxGeometry args={[0.6, 0.6, 0.1]} />
        <meshStandardMaterial color="#87CEEB" />
      </mesh>
    </group>
  )
}

function Tower({ position }) {
  return (
    <group position={position}>
      {/* 塔本体 */}
      <mesh position={[0, 5, 0]} castShadow>
        <cylinderGeometry args={[2, 2.5, 10, 8]} />
        <meshStandardMaterial color="#A9A9A9" />
      </mesh>

      {/* 塔の屋根 */}
      <mesh position={[0, 11, 0]} castShadow>
        <coneGeometry args={[2.5, 3, 8]} />
        <meshStandardMaterial color="#4169E1" />
      </mesh>

      {/* 旗 */}
      <mesh position={[0, 13.5, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 2, 8]} />
        <meshStandardMaterial color="#5c3317" />
      </mesh>
      <mesh position={[0.4, 14, 0]} castShadow>
        <boxGeometry args={[0.8, 0.5, 0.05]} />
        <meshStandardMaterial color="#FF4500" />
      </mesh>
    </group>
  )
}
