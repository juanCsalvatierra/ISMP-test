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

  return (
    <div className="hidden lg:block lg:relative lg:w-full px-2 lg:h-[35vh] lg:max-h-[35vh] ">
      <h3 className="ui-title text-xl my-1">Visibilidad de los Modelos</h3>
      <div className="h-full w-full overflow-y-auto ui-scrollbar scrollbar scrollbar-thumb-muted scrollbar-track-panel">
        {groups.map((group) => {
          const visible = visibility[group.key] ?? true;
          const label = group.name?.trim() ? group.name : group.key;

          return (
            <label key={group.key} className="ui-mono text-secondary text-sm flex place-content-between pr-5">
              {capitalize(label)}

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