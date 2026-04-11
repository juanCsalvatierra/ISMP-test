import { Section, useAnatomyStore } from "../../store/anatomyStore";
import ReactMarkdown from "react-markdown";

export function InfoPanel() {

  // Obtiene el objeto seleccionado
  const selected = useAnatomyStore((s) => s.selected);

  if (!selected) return <p className="ui-muted w-full h-[50vh] text-xl text-center italic pt-20 lg:pt-32">Seleccione un objeto para ver información...</p>;

  return (
    <div className="ui-panel ui-scrollbar w-full h-[50vh] overflow-y-scroll px-5 scrollbar scrollbar-thumb-muted scrollbar-track-panel">

      {/* Titulo del objeto */}
      <h4 className="ui-title text-center text-xl font-bold mb-5">{selected.name}</h4>

      {/* Secciones del objeto (Información) */}
      {selected.sections?.map((section: Section, i: number) => (
        <div key={i} className="mb-12">
          {section.level === 2 && (
            <h3 className="ui-title text-lg font-bold mb-2">{section.title}</h3>
          )}
          {section.level === 3 && (
            <h4 className="ui-title text-md font-semibold mb-2">{section.title}</h4>
          )}

          {
            Array.isArray(section.content) ?
              section.content.map((paragraph: string, j: number) => (
                <div key={j} className="mb-1">
                  <p className="text-sm text-secondary whitespace-pre-line">
                    {paragraph}
                  </p>
                </div>
              ))
              :
              <p className="text-sm text-secondary whitespace-pre-line">
                {section.content}
              </p>
          }
        </div>
      ))}

      {selected.children?.map((child, i: number) => (
        <div key={i}>
          <strong className="ui-title">{child.name}</strong>
          <ReactMarkdown>
            {child.description}
          </ReactMarkdown>
        </div>
      ))}
    </div>
  );
}