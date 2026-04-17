"use client";
import { ReactNode } from "react";
import { AnatomyItem } from "../../store/anatomyStore";
import { JsonIndex } from "../../utils/indexBuilder";
import { SceneCanvas } from "../scene/SceneCanvas";
import { Breadcrumb } from "./Breadcrumb";
import { InfoPanel } from "./InfoPanel";
import { MeshVisibilityPanel } from "./MeshVisibilityPanel";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type Props = {
  breadcrumbItems: BreadcrumbItem[];
  json: Record<string, AnatomyItem>;
  scannerIndex: JsonIndex;
  children: ReactNode;
};

export function ModelPageLayout({ breadcrumbItems, json, scannerIndex, children }: Props) {
  return (
    <div className="w-full flex flex-col bg-background text-foreground">
      <Breadcrumb items={breadcrumbItems} />
      <div className="w-full flex flex-col lg:flex-row place-items-start">
        {/* CANVAS */}
        <div id="canvas-container" className="w-full h-[calc(100vh-200px)] lg:w-[65%] lg:h-screen">
          <SceneCanvas json={json} scannerIndex={scannerIndex} background="var(--bg-canvas)">
            {children}
          </SceneCanvas>
        </div>

        {/* Panel lateral */}
        <div className="ui-panel w-full lg:w-[35%] h-full min-h-screen flex flex-col p-5">
          <h2 className="ui-title text-2xl text-center font-semibold">Panel de información</h2>
          <InfoPanel />
          <hr className="ui-divider w-full hidden lg:block" />
          <MeshVisibilityPanel />
        </div>
      </div>
    </div>
  );
}
