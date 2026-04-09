import { create } from "zustand";

// Tipado de los items de anatomía
export type AnatomyItem = {
  name: string;
  english_name: string | string[];
  description?: string;
  children?: AnatomyItem[];
  sections: Section[];
};

type Section = {
  title: string;
  level: number;
  content: string | string[];
}

// Tipado del estado global de anatomía
type State = {
  hovered: string | null;
  selected: AnatomyItem | null;
  isolated: string | null;

  setHovered: (id: string | null) => void;
  setSelected: (item: AnatomyItem | null) => void;
  setIsolated: (id: string | null) => void;
};

export const useAnatomyStore = create<State>((set) => ({
  hovered: null,
  selected: null,
  isolated: null,

  setHovered: (id) => set({ hovered: id }),
  setSelected: (item) => set({ selected: item }),
  setIsolated: (id) => set({ isolated: id }),
}));