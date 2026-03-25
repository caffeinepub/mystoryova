import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import type { Mesh } from "three";

function BookMesh() {
  const bodyRef = useRef<Mesh>(null);
  const spineRef = useRef<Mesh>(null);

  useFrame((state, delta) => {
    if (bodyRef.current) {
      bodyRef.current.rotation.y += delta * 0.5;
      bodyRef.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
    if (spineRef.current) {
      spineRef.current.rotation.y += delta * 0.5;
      spineRef.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <>
      <mesh ref={bodyRef}>
        <boxGeometry args={[0.7, 1.0, 0.1]} />
        <meshStandardMaterial color="#C9A96E" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh ref={spineRef} position={[-0.36, 0, 0]}>
        <boxGeometry args={[0.02, 1.0, 0.12]} />
        <meshStandardMaterial color="#8B6914" metalness={0.4} roughness={0.5} />
      </mesh>
    </>
  );
}

export default function Book3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 3], fov: 40 }}
      style={{ width: "100%", height: "100%" }}
      gl={{ antialias: true }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 5]} intensity={1.5} />
      <directionalLight position={[-2, -1, -3]} intensity={0.3} />
      <pointLight position={[0, 0, 4]} intensity={0.5} />
      <Suspense fallback={null}>
        <BookMesh />
      </Suspense>
    </Canvas>
  );
}
