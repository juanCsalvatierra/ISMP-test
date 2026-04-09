"use client";
import { Canvas } from "@react-three/fiber";
import rawJson from "../data/anatomy.final.builded.json";
import { AnatomyItem, useAnatomyStore } from "../store/anatomyStore";

import { InteractiveScene } from "../components/InteractiveScene";
import { HighlightSystem } from "../components/HighlightSystem";

import { InfoPanel } from "../components/InfoPanel";
import { Search } from "../components/Search";
import Camera from "../components/Camera";
import { OrbitControls } from "@react-three/drei";
import Organs from "../components/Organs";

export default function App() {
  const json = rawJson as Record<string, AnatomyItem>;

  return (
    <div className="w-full flex place-items-start">
      <div className="w-[40%] h-full min-h-screen flex flex-col p-5">
        <h2 className="text-2xl text-center">Panel de Información</h2>
        <Search json={json} />
        <InfoPanel />
      </div>
      <div id="canvas-container" className="w-[60%] h-screen">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <Camera />
          <gridHelper args={[20, 20]} />
          <OrbitControls target={[0, 1.7, 0]} />
          <InteractiveScene json={json}>
            <Organs json={json} onSelect={useAnatomyStore((state) => state.setSelected)} />
          </InteractiveScene>

          <HighlightSystem />
          <directionalLight position={[4, 2, 3]} intensity={1.7} />
          <directionalLight position={[-4, 2, -3]} intensity={.5} />
        </Canvas>
      </div>
    </div>
  );
}