"use client";
import { useState } from "react";
import { useMeshStore } from "../store/meshStore";
import { capitalize } from "../utils/capitalize";

export function MeshVisibilityPanel() {
  const groups = useMeshStore((s) => s.groups);
  const toggleGroup = useMeshStore((s) => s.toggleGroup);

  const [visibility, setVisibility] = useState<Record<string, boolean>>({});

  const handleToggle = (key: string, value: boolean) => {
    setVisibility((prev) => ({
      ...prev,
      [key]: value,
    }));

    toggleGroup(key, value);
  };
  console.log(visibility)

  return (
    <div className="hidden lg:block lg:relative lg:w-full px-2 lg:h-[35vh] lg:max-h-[35vh] ">
      <h3 className="text-white text-xl my-1">Visibilidad de los Modelos</h3>
      <div className="h-full w-full overflow-y-auto scrollbar scrollbar-thumb-white scrollbar-track-neutral-800">
        {groups.map((group) => {
          const visible = visibility[group.key] ?? true;
          // BUG: el name no existe para los dientes, los cartilagos de las costillas , parte de la columna, el radio y el hueso piramidal
          // if(group.name)
          return (
            <label key={group.key} className="text-white text-sm flex place-content-between pr-5">
              {capitalize(group.name)}

              <input
                type="checkbox"
                checked={visible}
                onChange={(e) => handleToggle(group.key, e.target.checked)}
              />
            </label>
          );
        })}
      </div>
    </div>
  );
}