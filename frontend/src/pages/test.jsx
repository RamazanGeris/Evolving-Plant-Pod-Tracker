import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'

function TestModel() {
  const { scene } = useGLTF('/models/model1.glb')
  return <primitive object={scene} scale={5} />
}

export default function TestPage() {
  return (
    <div style={{ width: 600, height: 600 }}>
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        <ambientLight intensity={1} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
        <TestModel />
        <OrbitControls />
      </Canvas>
    </div>
  )
}
