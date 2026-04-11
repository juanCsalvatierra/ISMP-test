"use client";
import rawJson from "../data/anatomy.skeleton.json";
import { AnatomyItem, useAnatomyStore } from "../store/anatomyStore";
import { InfoPanel } from "../components/InfoPanel";
import Skeleton from "../components/Skeleton";
import { useMemo } from "react";
import { MeshVisibilityPanel } from "../components/MeshVisibilityPanel";
import { buildJsonIndex } from "../utils/indexBuilder";
import { SceneCanvas } from "../components/SceneCanvas";
import { Breadcrumb } from "../components/Breadcrumb";

export default function App() {
  const json = rawJson as Record<string, AnatomyItem>;
  const index = useMemo(() => buildJsonIndex(json), [json]);

  return (
    <div className="w-full flex flex-col bg-background text-foreground">
      <Breadcrumb items={[
        { label: "Inicio", href: "/" },
        { label: "Esqueleto y cartílagos" },
      ]} />
      <div className="w-full flex flex-col lg:flex-row place-items-start">

        {/* CANVAS */}
        <div id="canvas-container" className="w-full h-[calc(100vh-200px)] lg:w-[65%] lg:h-screen">
          <SceneCanvas json={json} scannerIndex={index} background="var(--bg-canvas)">
            <Skeleton json={json} index={index} onSelect={useAnatomyStore((state) => state.setSelected)} />
          </SceneCanvas>
        </div>

        {/* Panel lateral */}
        <div className="ui-panel relative w-full h-50 lg:w-[35%] lg:h-full lg:min-h-screen flex flex-col place-items-center place-content-center py-2">
          <h2 className="ui-title text-sm text-center absolute top-[-20] right-2 lg:relative">Panel de Información</h2>
          {/* <Search json={json} /> */}
          <InfoPanel />
          <hr className="ui-divider w-full hidden lg:block" />
          <MeshVisibilityPanel />
        </div>
      </div>
    </div>
  );
}