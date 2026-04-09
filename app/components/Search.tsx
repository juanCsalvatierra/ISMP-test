import { AnatomyItem, useAnatomyStore } from "../store/anatomyStore";
import { normalize } from "../utils/normalize";

type Props = {
  json: Record<string, AnatomyItem>;
};

export function Search({ json }: Props) {
  const setSelected = useAnatomyStore((s) => s.setSelected);

  function handleSearch(value: string) {
    const n = normalize(value);

    const found = Object.values(json).find((item: any) =>
      normalize(item.english_name).includes(n)
    );

    if (found) setSelected(found);
  }

  return <input id="search" onChange={(e) => handleSearch(e.target.value)} />;
}