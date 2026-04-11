"use client";

import { ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { AnatomyItem, useAnatomyStore } from "../../store/anatomyStore";
import Camera from "./Camera";
import { MeshScanner } from "./MeshScanner";
import { HighlightSystem } from "./HighlightSystem";
import { InteractiveScene } from "./InteractiveScene";
import { JsonIndex } from "../../utils/indexBuilder";

type Props = {
  json: Record<string, AnatomyItem>;
  children: ReactNode;
  showGrid?: boolean;
  background?: string;
  scannerIndex?: JsonIndex;
};

export function SceneCanvas({
  json,
  children,
  showGrid = false,
  background,
  scannerIndex,
}: Props) {
  const setSelected = useAnatomyStore((s) => s.setSelected);
  const setIsolated = useAnatomyStore((s) => s.setIsolated);

  return (
    <Canvas
      style={background ? { background } : undefined}
      camera={{ position: [0, 0, 5] }}
      onPointerMissed={() => {
        setSelected(null, null);
        setIsolated(null);
      }}
    >
      <Camera />

      {scannerIndex ? <MeshScanner json={json} index={scannerIndex} /> : null}
      {showGrid ? <gridHelper args={[20, 20]} /> : null}

      <OrbitControls target={[0, 1.7, 0]} zoomToCursor />

      <InteractiveScene json={json}>{children}</InteractiveScene>

      <HighlightSystem />
      <directionalLight position={[4, 2, 3]} intensity={1.7} />
      <directionalLight position={[-4, 2, -3]} intensity={0.5} />
    </Canvas>
  );
}
