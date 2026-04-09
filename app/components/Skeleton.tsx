"use client";
import { ThreeEvent, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { useEffect, useMemo } from "react";
import * as THREE from "three";

import { normalize } from "../utils/normalize";
import { findBestJsonMatch } from "../utils/matcher";
import { buildJsonIndex, JsonIndex } from "../utils/indexBuilder";
import { fileURLToPath } from "url";

type Props = {
  json: Record<string, any>;
  index: JsonIndex;
  onSelect?: (item: any) => void;
};

const Skeleton = ({ json, index, onSelect }: Props) => {
  const skeleton = useLoader(GLTFLoader, "/models/skeleton.glb");


  useEffect(() => {
    skeleton.scene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;

      

      // Material de los huesos
      child.material = new THREE.MeshStandardMaterial({
        color: "#F1E1B0",
        roughness: 0.5,
        metalness: 0,
      });

      let name = child.name;

      if (/^Mesh_\d+$/.test(name) && child.parent) {
        name = child.parent.name;
      }

      // Material de las cartilagos
      if(name.toLowerCase().includes("cartilage")) {
        child.material = new THREE.MeshStandardMaterial({
          color: "#D9E1E8",
          roughness: 0.38,
          metalness: 0,
        });
      }

      // Match con el JSON
      const normalized = normalize(name);

      const matchKey = findBestJsonMatch(normalized, index);

      if (matchKey) {
        child.userData.jsonKey = matchKey;
      } else {
        // console.log("No match:", name);
      }
      
    });
  }, [skeleton, json]);

  return (
    <primitive
      object={skeleton.scene}
      position={[0, 0, 0]}
      scale={2}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        const mesh = e.object as THREE.Mesh;
        const key = mesh.userData.jsonKey;

        if (!key) {
          console.log("Sin data:", mesh.name);
          return;
        }
        const item = json[key];
        console.log("Seleccionado:", item);

        if (onSelect) onSelect(item);
      }}
    />
  );
};

export default Skeleton;