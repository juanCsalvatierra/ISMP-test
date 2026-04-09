import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { useEffect } from "react";
import * as THREE from "three";

const Joints = () => {
  const result = useLoader(GLTFLoader, "/models/joints.glb");

  useEffect(() => {
    result.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // 🔥 Opción 1: cambiar color manteniendo material
        if (Array.isArray(child.material)) {
          child.material.forEach((mat) => {
            mat.color.set("#e8e8e8"); // color hueso
          });
        } else {
          child.material.color.set("#e8e8e8");
        }

        // 🔥 Opción 2 (mejor para vos): reemplazar material
        child.material = new THREE.MeshStandardMaterial({
          color: "#e8e8e8",
          roughness: 0.5,
          metalness: 0,
        });
      }
    });
  }, [result]);

  console.log(result);

  return (
    <primitive
      object={result.scene}
      position={[-8, 0, 0]}
      scale={2}
      onClick={(e: any) => {
        e.stopPropagation();

        const mesh = e.object as THREE.Mesh;
        console.log(mesh);
      }}
    />
  );
};

export default Joints;
