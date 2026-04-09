import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { useMeshStore } from "../store/meshStore";
import { JsonIndex } from "../utils/indexBuilder";
import { findBestJsonMatch } from "../utils/matcher";
import { normalize } from "../utils/normalize";

type Props = {
  json: Record<string, any>;
  index: JsonIndex;
}

export function MeshScanner({ json, index }: Props) {
  const { scene } = useThree();
  const setGroups = useMeshStore((s) => s.setGroups);

  useEffect(() => {
    if (!scene) return;


    const map = new Map();

    scene.traverse((obj: any) => {
      if (!obj.isMesh) return;

      const key = obj.userData?.jsonKey;
      if (!key) return;
      const normalized = normalize(key);
      const matchKey = findBestJsonMatch(normalized, index);
      if(matchKey) {
        obj.userData.jsonKey = matchKey;
      }
      if (!map.has(matchKey)) {
        map.set(matchKey, []);
      }

      map.get(matchKey).push(obj);
    });

    const groups = Array.from(map.entries()).map(([key, meshes]) => {
    const item = json[key];

    return {
      key,
      name: item?.name ?? key, // 👈 ESTA es la clave
      meshes,
    };
  });

    setGroups(groups);
  }, [scene]);

  return null;
}