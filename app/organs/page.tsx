"use client";
import { useMemo } from "react";
import rawJson from "../data/anatomy.final.builded.json";
import { AnatomyItem, useAnatomyStore } from "../store/anatomyStore";
import Organs from "../components/models/Organs";
import { ModelPageLayout } from "../components/ui/ModelPageLayout";
import { buildJsonIndex } from "../utils/indexBuilder";

export default function App() {
  const json = rawJson as Record<string, AnatomyItem>;
  const index = useMemo(() => buildJsonIndex(json), [json]);
  const setSelected = useAnatomyStore((state) => state.setSelected);

  return (
    <ModelPageLayout
      breadcrumbItems={[
        { label: "Inicio", href: "/" },
        { label: "Órganos" },
      ]}
      json={json}
      scannerIndex={index}
    >
      <Organs json={json} onSelect={setSelected} />
    </ModelPageLayout>
  );
}