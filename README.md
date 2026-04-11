# ISMP Anatomy

Explorador de anatomía 3D interactivo construido con Next.js, React Three Fiber y Zustand.

Este proyecto renderiza múltiples sistemas del cuerpo humano (`Skeleton`, `Muscles`, `Organs`) a partir de modelos `.glb` y vincula cada malla a metadatos anatómicos estructurados en JSON. Los usuarios pueden inspeccionar estructuras directamente en la escena 3D, resaltar y seleccionar elementos, y leer descripciones contextuales en un panel de información.

## Tabla de contenidos

- [Descripción del proyecto](#descripción-del-proyecto)
- [Stack tecnológico](#stack-tecnológico)
- [Funcionalidades principales](#funcionalidades-principales)
- [Cómo funciona (Arquitectura)](#cómo-funciona-arquitectura)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Requisitos previos](#requisitos-previos)
- [Instalación y configuración](#instalación-y-configuración)
- [Uso](#uso)
- [Referencia de la API](#referencia-de-la-api)
- [Estado actual del proyecto](#estado-actual-del-proyecto)
- [Hoja de ruta](#hoja-de-ruta)

## Descripción del proyecto

ISMP Anatomy es una aplicación de visualización educativa del lado del cliente que resuelve un desafío habitual en el estudio de anatomía: vincular geometría 3D compleja con descripciones anatómicas legibles.

En lugar de consultar archivos de modelos estáticos y recursos de texto por separado, los usuarios pueden:

- navegar por una escena 3D interactiva,
- seleccionar estructuras específicas,
- y ver al instante la información asociada, extraída de conjuntos de datos JSON curados.

## Stack tecnológico

### Frontend

- `Next.js 16.1.6` (App Router)
- `React 19.2.3`
- `React DOM 19.2.3`
- `TypeScript 5` (strict mode)
- `Tailwind CSS 4`
- `tailwind-scrollbar 4.0.2`
- `react-markdown 10.1.0`

### Sistema visual (Dark Mode)

El proyecto usa actualmente un sistema visual **solo modo oscuro** basado en tokens semánticos de color y tipografías IBM Plex.

#### Tipografías

- Headings: `IBM Plex Sans`
- Texto general: `IBM Plex Serif`
- Texto técnico / UI densa (inputs, labels cortos): `IBM Plex Mono`

Configuración principal:
- Carga de fuentes: `app/layout.tsx`
- Tokens de tema y utilidades visuales: `app/globals.css`

#### Tokens de color

Base de tokens en `:root` (ejemplos):
- Superficies: `--bg-page`, `--bg-canvas`, `--bg-panel`, `--bg-elevated`
- Texto: `--text-primary`, `--text-secondary`, `--text-muted`
- Estados: `--border-subtle`, `--accent`, `--accent-hover`

Mapeo para utilidades Tailwind 4 mediante `@theme inline`:
- `background`, `foreground`, `secondary`, `muted`, `panel`, `canvas`, `elevated`, `accent`

#### Convención de uso en componentes

Para mantener consistencia, preferir clases semánticas en vez de colores hardcodeados:
- `ui-panel`, `ui-title`, `ui-muted`, `ui-divider`
- `ui-link`, `ui-input`, `ui-scrollbar`, `ui-mono`

Evitar introducir nuevos `text-white`, `bg-neutral-*`, `border-neutral-*` o valores directos `rgb/#hex` para UI, salvo casos estrictamente 3D/materiales.

### Renderizado 3D

- `three 0.183.2`
- `@react-three/fiber 9.5.0`
- `@react-three/drei 10.7.7`
- `@react-three/postprocessing 3.0.4`
- `postprocessing 6.39.0`

### Gestión de estado

- `zustand 5.0.12`

### Herramientas y calidad

- `ESLint 9`
- `eslint-config-next 16.1.6`
- `@types/node 20`
- `@types/react 19`
- `@types/react-dom 19`
- `@types/three 0.183.1`

### Backend / Base de datos / DevOps

- Backend API: **No implementado** (sin endpoints de servidor en el código actual)
- Base de datos: **No implementada**
- Contenedores: **No implementados**

## Funcionalidades principales

- Visualización 3D interactiva de `Skeleton`, `Muscles` y `Organs`.
- Interacciones de hover y clic a nivel de malla.
- Sistema de resaltado en tiempo real sobre la malla con el cursor encima.
- Panel de información impulsado por JSON anatómico estructurado.
- Normalización de nombres y coincidencia difusa entre nombres de mallas del modelo y claves JSON.
- Panel de visibilidad y escaneo de mallas específico para el esqueleto.
- Navegación por rutas hacia cada modelo desde la página de inicio (`/`, `/skeleton`, `/muscles`, `/organs`).

## Cómo funciona (Arquitectura)

### 1) Composición a nivel de ruta

Cada ruta de anatomía construye la misma composición base:

1. `Canvas` inicializa la escena 3D.
2. `Camera` y `OrbitControls` definen el comportamiento de la cámara.
3. `InteractiveScene` envuelve el modelo y captura los eventos de puntero.
4. Un componente de modelo (`Skeleton`, `Muscles` o `Organs`) carga un archivo `.glb`.
5. `HighlightSystem` aplica retroalimentación emisiva de hover en cada frame.
6. `InfoPanel` renderiza los detalles a partir del estado global seleccionado.

### 2) Pipeline de mapeo de datos (Mesh -> JSON Item)

Durante la inicialización del modelo (`useEffect` dentro de cada componente de modelo):

- Se recorre la escena GLB malla por malla.
- Los nombres de las mallas se normalizan mediante `normalize()`.
- Los índices JSON se construyen con `buildJsonIndex()`.
- La mejor coincidencia de clave se resuelve con `findBestJsonMatch()` (exacta primero, difusa como alternativa).
- La clave resuelta se almacena como `mesh.userData.jsonKey`.

Esto permite una búsqueda inversa rápida desde una malla clicada hasta sus metadatos anatómicos.

### 3) Flujo de interacción y estado

- `InteractiveScene` maneja `onPointerOver`, `onPointerOut`, `onClick` y `onDoubleClick`.
- Las interacciones actualizan el estado global de Zustand en `useAnatomyStore` (`hovered`, `selected`, `isolated`).
- `HighlightSystem` lee `hovered` y actualiza el color emisivo del material para retroalimentación visual.
- `InfoPanel` lee `selected` y renderiza las secciones y contenidos hijos.

### 4) Sistema de visibilidad del esqueleto

La ruta del esqueleto incluye:

- `MeshScanner`: recorre la escena y agrupa las mallas por clave anatómica coincidente.
- `useMeshStore`: almacena los grupos de mallas y aplica los cambios de visibilidad.
- `MeshVisibilityPanel`: checkboxes en la interfaz para mostrar u ocultar grupos anatómicos.

Al ocultarse, el raycasting de la malla se desactiva para evitar interacciones con objetos invisibles.

## Estructura del proyecto

```text
app/
  components/        # Sistemas de escena, paneles de UI y cargadores de modelos
  data/              # Archivos JSON con metadatos anatómicos
  meshes/            # Módulos adicionales relacionados con modelos
  store/             # Stores de Zustand (anatomía, cámara, visibilidad de mallas)
  utils/             # Normalización de nombres, coincidencia e indexación
  muscles/           # Ruta /muscles
  organs/            # Ruta /organs
  skeleton/          # Ruta /skeleton
  page.tsx           # Página de inicio
public/models/       # Assets GLB cargados en tiempo de ejecución
```

## Requisitos previos

- `Node.js` 20+ recomendado (compatible con Next.js 16)
- `npm` (el proyecto incluye `package-lock.json`)
- Un navegador con soporte WebGL (Chrome, Edge, Firefox, Safari)

## Instalación y configuración

1. Clonar el repositorio:

   ```bash
   git clone <your-repository-url>
   ```

2. Entrar al directorio del proyecto:

   ```bash
   cd ISMP-test
   ```

3. Instalar dependencias:

   ```bash
   npm install
   ```

4. Variables de entorno:
   - No se requieren variables de entorno en la implementación actual.
   - Si se agregan en el futuro, crear un archivo `.env.local` en la raíz del proyecto.

## Uso

### Desarrollo

```bash
npm run dev
```

Abrir `http://localhost:3000`.

### Build de producción

```bash
npm run build
```

### Servidor de producción

```bash
npm run start
```

### Lint

```bash
npm run lint
```

## Referencia de la API

Actualmente este proyecto **no tiene endpoints HTTP**.

### API interna del cliente (stores de estado)

#### `useAnatomyStore` (`app/store/anatomyStore.ts`)

- `hovered: string | null`
- `selected: AnatomyItem | null`
- `isolated: string | null`
- `setHovered(id)`
- `setSelected(item)`
- `setIsolated(id)`

#### `useMeshStore` (`app/store/meshStore.ts`)

- `groups: MeshGroup[]`
- `setGroups(groups)`
- `toggleGroup(key, visible)`

#### `useCameraStore` (`app/store/cameraStore.ts`)

- `target: THREE.Vector3`
- `position: THREE.Vector3`
- `isMoving: boolean`
- `setFocus(target, position)`
- `reset(target, position)`

## Estado actual del proyecto

ISMP Anatomy se encuentra en fase de prototipo funcional. El objetivo es reemplazar la dependencia de software comercial costoso (como *Anatomyka*) con una herramienta educativa propia, gratuita y de alta calidad, desarrollada a medida para el **Instituto San Martín de Porres (ISMP)**, orientada a las carreras de **Radiología e Instrumentación Quirúrgica**.

### Funcionalidades implementadas

- [x] Visualización 3D interactiva del esqueleto, músculos y órganos (modelos `.glb`)
- [x] Rotación, zoom y desplazamiento de la cámara con `OrbitControls`
- [x] Resaltado emisivo en tiempo real al hacer hover sobre una estructura
- [x] Selección de estructuras por clic con visualización de información en panel lateral
- [x] Panel de visibilidad de grupos anatómicos (activar/desactivar capas) — disponible en `/skeleton`
- [x] Normalización de nombres y coincidencia difusa entre mallas del modelo y metadatos JSON
- [x] Buscador básico de estructuras por nombre en inglés

### Funcionalidades pendientes

- [ ] Etiquetado en español técnico para todas las estructuras
- [ ] Buscador avanzado con soporte para nombres en español
- [ ] Integración de imágenes médicas reales (tomografías, radiografías) vinculadas a los modelos 3D
- [ ] Modo de anotación para docentes (marcado de puntos clave en clase)
- [ ] Sistema de autoevaluación con cuestionarios de opción múltiple para alumnos
- [ ] Gestión completa de capas para las rutas `/muscles` y `/organs`

## Hoja de ruta

El proyecto apunta a convertirse en una plataforma educativa completa para el ISMP. Las próximas etapas planificadas son:

**Etapa 1 — Completar la base interactiva**
- Unificar el sistema de visibilidad de capas en todas las rutas de modelos.
- Completar la cobertura de metadatos anatómicos en español para todas las estructuras.
- Mejorar el buscador con soporte multilenguaje (español / latín técnico).

**Etapa 2 — Contenido médico**
- Vincular imágenes de tomografías y radiografías reales a las estructuras 3D seleccionadas.
- Definir el esquema de datos para gestionar ese contenido multimedia.

**Etapa 3 — Herramientas pedagógicas**
- Implementar el modo anotación para uso en clases presenciales.
- Desarrollar el módulo de autoevaluación con cuestionarios de opción múltiple.

**Etapa 4 — Infraestructura y acceso**
- Agregar backend y base de datos para gestionar contenido, usuarios y resultados de evaluaciones.
- Publicar la aplicación en un servidor accesible para estudiantes y docentes del ISMP.

