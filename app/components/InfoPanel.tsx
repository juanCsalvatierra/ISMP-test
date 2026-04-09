import { div } from "three/tsl";
import { useAnatomyStore } from "../store/anatomyStore";
import ReactMarkdown from "react-markdown";

export function InfoPanel() {

  // Obtiene el objeto seleccionado
  const selected = useAnatomyStore((s) => s.selected);

  if (!selected) return <p className="w-full h-[50vh] text-xl text-center italic text-neutral-500 pt-20 lg:pt-32">Seleccione un objeto para ver información...</p>;

  return (
    <div className="w-full h-[50vh] text-white bg-neutral-800 overflow-y-scroll px-5 scrollbar scrollbar-thumb-white scrollbar-track-neutral-800">
      
      {/* Titulo del objeto */}
      <h4 className="text-center text-xl font-bold mb-5">{selected.name}</h4>

      {/* Secciones del objeto (Información) */}
      {selected.sections?.map((section: any, i: number) => (
        <div key={i} className="mb-12">
          {section.level === 2 && (
            <h3 className="text-lg font-bold mb-2">{section.title}</h3>
          )}
          {section.level === 3 && (
            <h4 className="text-md font-semibold mb-2">{section.title}</h4>
          )}

          {
            Array.isArray(section.content) ? 
              section.content.map((paragraph: string, j: number) => (
                <div key={j} className="mb-1">
                  <p className="text-sm whitespace-pre-line">
                    {paragraph}
                  </p>
                </div>
              ))
              : 
              <p className="text-sm whitespace-pre-line">
                {section.content}
              </p>
          }
        </div>
      ))}

      {selected.children?.map((child: any, i: number) => (
        <div key={i}>
          <strong>{child.name}</strong>
          <ReactMarkdown>
            {child.description}
          </ReactMarkdown>
        </div>
      ))}
    </div>
  );
}