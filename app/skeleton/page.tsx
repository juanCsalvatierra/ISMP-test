"use client";
import { Canvas } from "@react-three/fiber";
import rawJson from "../data/anatomy.skeleton.json";
import { AnatomyItem, useAnatomyStore } from "../store/anatomyStore";
import { InteractiveScene } from "../components/InteractiveScene";
import { HighlightSystem } from "../components/HighlightSystem";
import { InfoPanel } from "../components/InfoPanel";
import Camera from "../components/Camera";
import Skeleton from "../components/Skeleton";
import { OrbitControls } from "@react-three/drei";
import { useMemo, useRef } from "react";
import { MeshVisibilityPanel } from "../components/MeshVisibilityPanel";
import { MeshScanner } from "../components/MeshScanner";
import { buildJsonIndex } from "../utils/indexBuilder";

export default function App() {
  const json = rawJson as Record<string, AnatomyItem>;
  const controlsRef = useRef<any>(null);
  const index = useMemo(() => buildJsonIndex(json), [json]);
  
  return (
    <div className="w-full flex flex-col lg:flex-row place-items-start">
      
      {/* CANVAS */}
      <div id="canvas-container" className="w-full h-[calc(100vh-200px)] lg:w-[65%] lg:h-screen">
        <Canvas style={{"background": "#111"}} camera={{ position: [0, 0, 5] }}>
          
          {/* Camara */}
          <Camera />

          {/* Escaner de modelos para listado */}
          <MeshScanner json={json} index={index} />

          {/* Controles de camara */}
          <OrbitControls 
            target={[0, 1.7, 0]} 
            ref={controlsRef}
          />

          {/* Sistema de interacción y Modelo */}
          <InteractiveScene json={json}>
            <Skeleton json={json} index={index} onSelect={useAnatomyStore((state) => state.setSelected)} />
          </InteractiveScene>

          {/* Sistema de resaltado */}
          <HighlightSystem />
          
          {/* Luces */}
          <directionalLight position={[4, 2, 3]} intensity={1.7} />
          <directionalLight position={[-4, 2, -3]} intensity={.5} />
        </Canvas>
      </div>

      {/* Panel lateral */}
      <div className="relative w-full h-50 lg:w-[35%] lg:h-full lg:min-h-screen bg-neutral-800  flex flex-col place-items-center place-content-center py-2">
        <h2 className="text-sm text-center absolute top-[-20] right-2 lg:relative">Panel de Información</h2>
        {/* <Search json={json} /> */}
        <InfoPanel />
        <hr className="border-neutral-500 w-full hidden lg:block" />
        <MeshVisibilityPanel />
      </div>
    </div>
  );
}