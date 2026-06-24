"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { Float, Line, Points, PointMaterial } from "@react-three/drei"
import { useRef, useMemo } from "react"
import * as THREE from "three"

// Knowledge graph nodes
function KnowledgeGraph() {
    const groupRef = useRef<THREE.Group>(null)
    const pointsRef = useRef<THREE.Points>(null)

    useFrame((state) => {
        if (groupRef.current) {
            const t = state.clock.getElapsedTime()
            groupRef.current.rotation.y = t * 0.1
            groupRef.current.rotation.x = Math.sin(t * 0.2) * 0.1
        }
    })

    // Generate nodes positions
    const nodes = useMemo(() => {
        const count = 80
        const positions = new Float32Array(count * 3)
        for (let i = 0; i < count; i++) {
            const theta = Math.random() * Math.PI * 2
            const phi = Math.acos(2 * Math.random() - 1)
            const r = 1.5 + Math.random() * 0.5
            positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
            positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
            positions[i * 3 + 2] = r * Math.cos(phi)
        }
        return positions
    }, [])

    // Generate connection lines
    const lines = useMemo(() => {
        const lineArray: [THREE.Vector3, THREE.Vector3][] = []
        const count = 30
        for (let i = 0; i < count; i++) {
            const start = new THREE.Vector3(
                (Math.random() - 0.5) * 4,
                (Math.random() - 0.5) * 4,
                (Math.random() - 0.5) * 4
            )
            const end = new THREE.Vector3(
                (Math.random() - 0.5) * 4,
                (Math.random() - 0.5) * 4,
                (Math.random() - 0.5) * 4
            )
            lineArray.push([start, end])
        }
        return lineArray
    }, [])

    return (
        <Float speed={1} rotationIntensity={0.3} floatIntensity={0.5}>
            <group ref={groupRef}>
                {/* Glowing points */}
                <points ref={pointsRef}>
                    <bufferGeometry>
                        <bufferAttribute
                            attach="attributes-position"
                            args={[nodes, 3]}
                        />
                    </bufferGeometry>
                    <pointsMaterial
                        size={0.04}
                        color="#00ADB5"
                        transparent
                        opacity={0.9}
                        sizeAttenuation
                    />
                </points>

                {/* Center sphere */}
                <mesh>
                    <icosahedronGeometry args={[0.8, 1]} />
                    <meshBasicMaterial
                        color="#00ADB5"
                        wireframe
                        transparent
                        opacity={0.3}
                    />
                </mesh>

                {/* Connection lines */}
                {lines.map((line, i) => (
                    <Line
                        key={i}
                        points={[line[0], line[1]]}
                        color="#00ADB5"
                        lineWidth={0.5}
                        transparent
                        opacity={0.2}
                    />
                ))}

                {/* Outer ring */}
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[2.2, 0.005, 16, 100]} />
                    <meshBasicMaterial color="#00ADB5" transparent opacity={0.3} />
                </mesh>
            </group>
        </Float>
    )
}

export default function KnowledgeSphere() {
    return (
        <div className="w-full h-full">
            <Canvas
                camera={{ position: [0, 0, 5], fov: 45 }}
                dpr={[1, 2]}
            >
                <ambientLight intensity={0.5} />
                <KnowledgeGraph />
            </Canvas>
        </div>
    )
}