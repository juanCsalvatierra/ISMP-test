import { create } from "zustand";
import * as THREE from "three";

// Tipado del estado global de la cámara
type CameraState = {
  target: THREE.Vector3;
  position: THREE.Vector3;
  isMoving: boolean;

  setFocus: (target: THREE.Vector3, position: THREE.Vector3) => void;
  reset: (target: THREE.Vector3, position: THREE.Vector3) => void;
};

export const useCameraStore = create<CameraState>((set) => ({
  target: new THREE.Vector3(0, 0, 0),
  position: new THREE.Vector3(0, 0, 5),
  isMoving: false,

  setFocus: (target, position) =>
    set({
      target,
      position,
      isMoving: true,
    }),

  reset: (target, position) =>
    set({
      target,
      position,
      isMoving: true,
    }),
}));