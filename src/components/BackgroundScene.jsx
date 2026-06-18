import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Environment, ContactShadows } from '@react-three/drei';

function FloatingShapes() {
  const group = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    group.current.rotation.y = Math.sin(t / 4) / 4;
    group.current.rotation.z = Math.sin(t / 4) / 4;
    group.current.position.y = Math.sin(t / 1.5) / 10;
  });

  return (
    <group ref={group}>
      <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
        <mesh position={[0, 0, 0]} castShadow>
          <torusKnotGeometry args={[1, 0.3, 128, 32]} />
          <meshStandardMaterial color="#a855f7" roughness={0.1} metalness={0.8} />
        </mesh>
      </Float>
      <Float speed={2} rotationIntensity={2} floatIntensity={1}>
        <mesh position={[2.5, 1.5, -2]} castShadow>
          <sphereGeometry args={[0.8, 64, 64]} />
          <meshStandardMaterial color="#3b82f6" roughness={0.2} metalness={0.5} />
        </mesh>
      </Float>
      <Float speed={1.5} rotationIntensity={1.5} floatIntensity={2}>
        <mesh position={[-2.5, -1.5, -1]} castShadow>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#ec4899" roughness={0.3} metalness={0.4} />
        </mesh>
      </Float>
    </group>
  );
}

export default function BackgroundScene() {
  return (
    <>
      <color attach="background" args={['#030712']} />
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
      <Environment preset="city" />
      <FloatingShapes />
      <ContactShadows position={[0, -3, 0]} opacity={0.5} scale={10} blur={2} far={4} />
    </>
  );
}
