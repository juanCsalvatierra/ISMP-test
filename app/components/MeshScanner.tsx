import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";
import { useMeshStore } from "../store/meshStore";
import { JsonIndex } from "../utils/indexBuilder";
import { findBestJsonMatch } from "../utils/matcher";
import { normalize } from "../utils/normalize";
import { AnatomyItem } from "../store/anatomyStore";
import { MeshGroup } from "../store/meshStore";

type Props = {
  json: Record<string, AnatomyItem>;
  index: JsonIndex;
}

export function MeshScanner({ json, index }: Props) {
  const { scene } = useThree();
  const setGroups = useMeshStore((s) => s.setGroups);

  useEffect(() => {
    if (!scene) return;


    const map = new Map<string, THREE.Mesh[]>();

    scene.traverse((obj: THREE.Object3D) => {
      if (!(obj instanceof THREE.Mesh)) return;

      const key = obj.userData?.jsonKey;
      if (!key) return;

      const normalized = normalize(key);
      const matchKey = findBestJsonMatch(normalized, index);

      if (!matchKey) return;

      if (matchKey) {
        obj.userData.jsonKey = matchKey;
      }

      if (!map.has(matchKey)) {
        map.set(matchKey, []);
      }

      const grouped = map.get(matchKey);
      if (!grouped) return;
      grouped.push(obj);
    });

    const groups: MeshGroup[] = Array.from(map.entries()).map(([key, meshes]) => {
      const item = json[key];

      return {
        key,
        name: item?.name ?? key,
        meshes,
      };
    });

    setGroups(groups);
  }, [scene, index, json, setGroups]);

  return null;
}