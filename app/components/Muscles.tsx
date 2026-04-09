"use client";

import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { useEffect, useMemo } from "react";
import * as THREE from "three";

import { normalize } from "../utils/normalize";
import { findBestJsonMatch } from "../utils/matcher";
import { buildJsonIndex } from "../utils/indexBuilder";

type Props = {
  json: Record<string, any>;
  onSelect?: (item: any) => void;
};

const Muscles = ({ json, onSelect }: Props) => {
  const result = useLoader(GLTFLoader, "/models/muscles.glb");

  const index = useMemo(() => buildJsonIndex(json), [json]);

  useEffect(() => {
    result.scene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;

      // Util para diferenciar modelos
      const lowerCaseName = child.name.toLowerCase();

      // Fascia
      if (lowerCaseName.includes("fascia")) {
        child.material.dispose();

        child.material = new THREE.MeshStandardMaterial({
          color: "#DCD6C8",
          transparent: true,
          opacity: 0.18,
          roughness: 0.9,
          metalness: 0,
          depthWrite: false,
        });

        child.renderOrder = 1;
      }
      else {
        child.material = new THREE.MeshStandardMaterial({
          color: "#B84A3A",
          roughness: 0.7,
          metalness: 0,
        });
      }

      let name = child.name;

      if (/^Mesh_\d+$/.test(name) && child.parent) {
        name = child.parent.name;
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
  }, [result, json]);

  return (
    <primitive
      object={result.scene}
      position={[0, 0, 0]}
      scale={2}
      onClick={(e: any) => {
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

export default Muscles;