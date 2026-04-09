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

// Obtiene el nombre real del objeto
const getRealName = (child: THREE.Object3D) => {
  let name = child.name;

  if (/^Mesh_\d+$/.test(name) && child.parent) {
    name = child.parent.name;
  }

  return name.toLowerCase();
};

// Materiales específicos para algunos organos
const getOrganMaterial = (name: string) => {
  const n = name.toLowerCase();

  // Bronquios
  if (n.includes("bronch") || n.includes("bronchioles")) {
    console.log(n);
    return {
      material: new THREE.MeshStandardMaterial({
        color: "#E677A8",
        roughness: 0.6,
        metalness: 0,
      }),
      renderOrder: 0,
    };
  }

  // Pulmones
  if (n.includes("lung") || n.includes("pulmon") || n.includes("lobe")) {
    return {
      material: new THREE.MeshStandardMaterial({
        color: "#D96C6C",
        transparent: true,
        opacity: 0.9,
        roughness: 0.6,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
      renderOrder: 1,
    };
  }

  // Pleura
  if (n.includes("pleura")) {
    return {
      material: new THREE.MeshStandardMaterial({
        color: "#DDE3EA",
        transparent: true,
        opacity: 0.09,
        roughness: 0.3,
        metalness: 0,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
      renderOrder: 2,
    };
  }

  // Lamina Abdominal (Greater Omentum)
  if (n.includes("greater_omentum")) {
    return {
      material: new THREE.MeshStandardMaterial({
        color: "#E6D3A3",
        transparent: true,
        opacity: 0.3,
        roughness: 0.85,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
      renderOrder: 1,
    };
  }

  // Corazón
  if (n.includes("heart") || n.includes("card")) {
    return {
      material: new THREE.MeshStandardMaterial({
        color: "#8C2F23",
        roughness: 0.7,
      }),
    };
  }

  // Cerebro
  if (n.includes("brain") || n.includes("cerebro")) {
    return {
      material: new THREE.MeshStandardMaterial({
        color: "#E8AFAF",
        roughness: 0.8,
      }),
    };
  }

  // Hígado
  if (n.includes("liver") || n.includes("higado")) {
    return {
      material: new THREE.MeshStandardMaterial({
        color: "#A14B3B",
        roughness: 0.7,
      }),
    };
  }

  // Riñones
  if (n.includes("kidney") || n.includes("renal")) {
    return {
      material: new THREE.MeshStandardMaterial({
        color: "#7A3E2B",
        roughness: 0.7,
      }),
    };
  }

  // Vesícula
  if (n.includes("gall") || n.includes("vesicula")) {
    return {
      material: new THREE.MeshStandardMaterial({
        color: "#6FAF3A",
        roughness: 0.6,
      }),
    };
  }

  // Default
  return {
    material: new THREE.MeshStandardMaterial({
      color: "#C65D4B",
      roughness: 0.7,
    }),
  };
};

const Organs = ({ json, onSelect }: Props) => {
  const result = useLoader(GLTFLoader, "/models/organs.glb");

  const index = useMemo(() => buildJsonIndex(json), [json]);

  useEffect(() => {
    result.scene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;

      const realName = getRealName(child);

      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((m) => m.dispose());
        } else {
          child.material.dispose();
        }
      }

      const { material, renderOrder } = getOrganMaterial(realName);

      child.material = material;

      if (renderOrder !== undefined) {
        child.renderOrder = renderOrder;
      }

      // Match con el JSON
      const normalized = normalize(realName);
      const matchKey = findBestJsonMatch(normalized, index);

      if (matchKey) {
        child.userData.jsonKey = matchKey;
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

export default Organs;