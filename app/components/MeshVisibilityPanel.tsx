"use client";
import { useState } from "react";
import { useMeshStore } from "../store/meshStore";
import { capitalize } from "../utils/capitalize";

const CATEGORY_ORDER = [
  "Cara y cabeza",
  "Cuello",
  "Espalda y hombro",
  "Tórax y abdomen",
  "Brazo",
  "Antebrazo",
  "Mano",
  "Cadera y glúteo",
  "Muslo",
  "Pierna",
  "Pie",
  "Otros",
];

export function MeshVisibilityPanel() {
  const groups = useMeshStore((s) => s.groups);
  const toggleGroup = useMeshStore((s) => s.toggleGroup);

  const [visibility, setVisibility] = useState<Record<string, boolean>>({});
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});

  const handleToggle = (key: string, value: boolean) => {
    setVisibility((prev) => ({ ...prev, [key]: value }));
    toggleGroup(key, value);
  };

  const handleToggleCategory = (category: string, value: boolean) => {
    const inCategory = groups.filter((g) => (g.category ?? "Otros") === category);
    const next: Record<string, boolean> = {};
    inCategory.forEach((g) => {
      next[g.key] = value;
      toggleGroup(g.key, value);
    });
    setVisibility((prev) => ({ ...prev, ...next }));
  };

  const toggleOpen = (category: string) => {
    setOpenCategories((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  const grouped = groups.reduce<Record<string, typeof groups>>((acc, g) => {
    const cat = g.category ?? "Otros";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(g);
    return acc;
  }, {});

  const sortedCategories = CATEGORY_ORDER.filter((c) => grouped[c]);

  if (groups.length === 0) return null;

  return (
    <div className="hidden lg:flex lg:flex-col lg:relative lg:w-full px-2 lg:h-[35vh] lg:max-h-[35vh]">
      <h3 className="ui-title text-xl my-1">Visibilidad de los Modelos</h3>
      <div className="flex-1 overflow-y-auto ui-scrollbar scrollbar scrollbar-thumb-muted scrollbar-track-panel">
        {sortedCategories.map((category) => {
          const categoryGroups = grouped[category];
          const isOpen = openCategories[category] ?? false;
          const allVisible = categoryGroups.every((g) => visibility[g.key] ?? true);

          return (
            <div key={category} className="mb-1">
              <div className="flex items-center justify-between pr-2 py-0.5 cursor-pointer select-none group"
                onClick={() => toggleOpen(category)}>
                <span className="ui-mono text-xs text-muted uppercase tracking-wider flex items-center gap-1">
                  <span className="opacity-60">{isOpen ? "▾" : "▸"}</span>
                  {category}
                  <span className="opacity-40 text-[10px]">({categoryGroups.length})</span>
                </span>
                <input
                  type="checkbox"
                  checked={allVisible}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => handleToggleCategory(category, e.target.checked)}
                  className="cursor-pointer"
                />
              </div>

              {isOpen && (
                <div className="pl-3 border-l border-border-subtle ml-1">
                  {categoryGroups.map((group) => {
                    const visible = visibility[group.key] ?? true;
                    const label = group.name?.trim() ? group.name : group.key;
                    return (
                      <label key={group.key} className="ui-mono text-secondary text-xs flex place-content-between pr-2 py-0.5 cursor-pointer">
                        <span className="truncate max-w-[160px]">{capitalize(label)}</span>
                        <input
                          type="checkbox"
                          checked={visible}
                          onChange={(e) => handleToggle(group.key, e.target.checked)}
                          className="cursor-pointer"
                        />
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}