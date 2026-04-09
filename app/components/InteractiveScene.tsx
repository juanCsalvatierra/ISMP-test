import { useAnatomyStore } from "../store/anatomyStore";

export function InteractiveScene({ children, json }: any) {
  const setHovered = useAnatomyStore((s) => s.setHovered);
  const setSelected = useAnatomyStore((s) => s.setSelected);
  const setIsolated = useAnatomyStore((s) => s.setIsolated);

  return (
    // group sirve para agrupar multiples objetos
    // Permite aplicar transformaciones o capturar eventos de todos los hijos
    <group
      onPointerOver={(e) => {
        e.stopPropagation();
        if (!e.object.userData.jsonKey) return;
        setHovered(e.object.uuid);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(null);
      }}
      onClick={(e) => {
        e.stopPropagation();
        const key = e.object.userData.jsonKey;
        if (!key) return;
        setSelected(json[key]);
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        setIsolated(e.object.uuid);
      }}
    >
      {children}
    </group>
  );
}