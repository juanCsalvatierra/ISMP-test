"use client";
import { useFrame, useThree } from "@react-three/fiber";
import { useAnatomyStore } from "../store/anatomyStore";
import * as THREE from "three";

export function HighlightSystem() {

  // Guarda toda la escena para poder recorrerla y modificar los materiales de los objetos
  const { scene } = useThree();
  // Guarda el uuid del objeto al que se le hace hover
  const hovered = useAnatomyStore((s) => s.hovered);

  useFrame(() => {
    if (!scene) return;

    // Recorre toda la escena para acceder a los objetos
    scene.traverse((obj: any) => {
      
      if (!obj.isMesh) return;
      const mesh = obj as THREE.Mesh;

      // Si materials no es un array lo convierte en uno
      const materials = Array.isArray(mesh.material)
        ? mesh.material
        : [mesh.material];

      materials.forEach((mat) => {
        // Verificar tipo correcto
        if (mat instanceof THREE.MeshStandardMaterial) {
          if (mesh.uuid === hovered) {
            // Si el uuid del mesh coincide con el hovered, se resalta el objeto
            mat.emissive.set("#ff9900");
            mat.emissiveIntensity = 0.8;
          } else {
            // Si no coincide, se asegura de que el objeto no esté resaltado
            mat.emissive.set("#000000");
            mat.emissiveIntensity = 0;
          }
        }
      });
    });
  });

  return null;
}