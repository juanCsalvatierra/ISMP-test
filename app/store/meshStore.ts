import { create } from "zustand";
import * as THREE from "three";

// Tipado de los grupos de meshes
type MeshGroup = {
  key: string;
  name: string;
  meshes: THREE.Mesh[];
};

// Tipado del estado global de visibilidad de meshes
type State = {
  groups: MeshGroup[];
  setGroups: (groups: MeshGroup[]) => void;

  toggleGroup: (key: string, visible: boolean) => void;
};

export const useMeshStore = create<State>((set, get) => ({
  groups: [],

  setGroups: (groups) => set({ groups }),

  toggleGroup: (key, visible) => {
    const group = get().groups.find((g) => g.key === key);
    if (!group) return;

    group.meshes.forEach((mesh) => {
      mesh.visible = visible;
      if (!visible) {
        mesh.raycast = () => null; // 🔥 clave
      } else {
        delete mesh.raycast; // restaurar comportamiento default
      }
    });
  },
}));