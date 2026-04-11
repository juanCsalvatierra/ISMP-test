"use client";
import rawJson from "../data/anatomy.final.builded.json";
import { AnatomyItem, useAnatomyStore } from "../store/anatomyStore";
import { InfoPanel } from "../components/InfoPanel";
import { Search } from "../components/Search";
import Organs from "../components/Organs";
import { SceneCanvas } from "../components/SceneCanvas";
import { MeshVisibilityPanel } from "../components/MeshVisibilityPanel";
import { useMemo } from "react";
import { buildJsonIndex } from "../utils/indexBuilder";

export default function App() {
  const json = rawJson as Record<string, AnatomyItem>;
  const index = useMemo(() => buildJsonIndex(json), [json]);

  return (
    <div className="w-full flex flex-col lg:flex-row place-items-start bg-background text-foreground">
      <div className="ui-panel w-full lg:w-[35%] h-full min-h-screen flex flex-col p-5">
        <h2 className="ui-title text-2xl text-center font-semibold">Panel de información</h2>
        <Search json={json} />
        <InfoPanel />
        <hr className="ui-divider w-full hidden lg:block" />
        <MeshVisibilityPanel />
      </div>
      <div id="canvas-container" className="w-full lg:w-[65%] h-[calc(100vh-200px)] lg:h-screen">
        <SceneCanvas json={json} showGrid scannerIndex={index}>
          <Organs json={json} onSelect={useAnatomyStore((state) => state.setSelected)} />
        </SceneCanvas>
      </div>
    </div>
  );
}