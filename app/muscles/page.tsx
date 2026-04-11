"use client";
import rawJson from "../data/anatomy.final.builded.json";
import { AnatomyItem, useAnatomyStore } from "../store/anatomyStore";

import { InfoPanel } from "../components/InfoPanel";
import { Search } from "../components/Search";
import Muscles from "../components/Muscles";
import { SceneCanvas } from "../components/SceneCanvas";
import { MeshVisibilityPanel } from "../components/MeshVisibilityPanel";
import { useMemo } from "react";
import { buildJsonIndex } from "../utils/indexBuilder";

export default function App() {
  const json = rawJson as Record<string, AnatomyItem>;
  const index = useMemo(() => buildJsonIndex(json), [json]);

  return (
    <div className="w-full flex flex-col lg:flex-row place-items-start">
      <div className="w-full lg:w-[35%] h-full min-h-screen flex flex-col p-5 bg-neutral-800">
        <h2 className="text-2xl text-center">Panel de información</h2>
        <Search json={json} />
        <InfoPanel />
        <hr className="border-neutral-500 w-full hidden lg:block" />
        <MeshVisibilityPanel />
      </div>
      <div id="canvas-container" className="w-full lg:w-[65%] h-[calc(100vh-200px)] lg:h-screen">
        <SceneCanvas json={json} showGrid scannerIndex={index}>
          <Muscles json={json} onSelect={useAnatomyStore((state) => state.setSelected)} />
        </SceneCanvas>
      </div>
    </div>
  );
}