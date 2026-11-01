# Fase 1 · Plan del microcurso PWA de Cardiología y Cardio-oncología

*Fecha: 1 de noviembre de 2026 · Estado: pendiente de tu aprobación*

## 1. Resumen

Una PWA estática, instalable y offline, con un curso de 7 días (unos 20-25 min/día) para el Blgo. Samuel Vinces Zamora. Todo el contenido vive en JSON con fuentes citadas, y la app es un "motor" que lo lee. Así, además de este curso, el mismo motor sirve para futuros **mini cursos** de otros temas (solo cambia la carpeta de contenido).

## 2. Decisiones técnicas

| Tema | Decisión | Por qué |
|---|---|---|
| Base | Vite + React + TypeScript | Lo que pediste; rápido y estándar |
| Estilos | Tailwind CSS v4 | Ligero, mobile-first, tokens de color de biovinces |
| PWA | `vite-plugin-pwa` (Workbox, precache de todo) | Instalable y 100% offline, audio incluido |
| Navegación | Rutas con hash (`#/dia/1`) sin librería de router | GitHub Pages no soporta rutas SPA; una dependencia menos |
| Repaso espaciado | `ts-fsrs` | FSRS oficial en TypeScript |
| Almacenamiento | `localStorage` versionado (progreso, racha, tarjetas FSRS) | Unos pocos KB; IndexedDB no aporta nada aquí. Incluye exportar/importar progreso en JSON |
| Validación de contenido | `zod` (solo en desarrollo/pruebas) | Esquema único; si un JSON no tiene `fuentes`, la compilación falla |
| Pruebas | Vitest + Lighthouse CI (Chromium) | Lógica FSRS, esquema, enlaces de fuentes, PWA/accesibilidad |
| Diagramas | SVG + React a mano, sin librerías | Nítidos, livianos, accesibles, respetan `prefers-reduced-motion` |
| Despliegue | GitHub Actions → GitHub Pages | Gratis, sin servidores |

Dependencias de ejecución: solo `react`, `react-dom` y `ts-fsrs`. Todo lo demás es de desarrollo.

**Diseño:** fondo `#f6f5ef`, títulos serif (Lora o Source Serif, autoalojada para offline), texto sans legible, verdes naturales con contraste AA, botones táctiles ≥ 44 px. Inspirado en biovinces.com, sin copiar su logo.

## 3. Modelo de contenido (JSON en `src/content/`)

- `curso.json`: metadatos, días, descargo.
- `dias/dia-1.json` … `dia-7.json`: objetivos, lecciones (tarjetas), práctica con puntaje de referencia, recurso de audio, resumen visual.
- Tipos de tarjeta: `concepto` (texto ≤ 60 palabras + imagen/diagrama), `pregunta-previa` (recuperación antes de explicar), `ejemplo-resuelto`, `analogia` (mundo vegetal), `alerta` (seguridad / cuándo derivar).
- Tipos de pregunta: opción múltiple, verdadero/falso, ordenar pasos; cada opción con explicación propia.
- `flashcards.json`, `glosario.json`, `imagenes.json`, `caso.json` (árbol de decisiones del día 7).
- Cada elemento lleva `fuentes: [{id}]` que apunta a `FUENTES.md` / `fuentes.json` (título, organización, año, URL, fecha de consulta).
- Plantas con campo obligatorio `nivelEvidencia`: `farmaco-aprobado` · `evidencia-clinica-limitada` · `preliminar` · `uso-tradicional`.

**Volumen estimado:** 35 lecciones, ~140 tarjetas, ~35 preguntas de práctica (sin examen; puntaje solo de referencia), ~100 flashcards, ~60 términos de glosario, 1 caso ramificado.

## 4. Pedagogía aplicada

- Una idea por tarjeta; pregunta previa antes de revelar; 1-2 preguntas fáciles de práctica por lección, con puntaje solo de referencia (no decisivo) y reintento libre.
- Repaso diario: flashcards FSRS vencidas + 30-40% de preguntas de días anteriores mezcladas (entrelazado).
- Ejemplos resueltos que crecen en dificultad del día 1 al 7.
- Retroalimentación explicativa en cada opción, también en las correctas.
- Analogías vegetales marcadas como tales (p. ej. xilema/floema ↔ arterias/venas, con sus límites).

## 5. Ajustes que propongo a la estructura

- **Día 6 está cargado** (coagulación + plantas + interacciones). Propongo 6 lecciones: 2 de trombosis y cáncer, 2 de "fármacos que nacieron de plantas" y 2 de interacciones planta-fármaco. Si se queda largo, paso la parte de trombosis al día 5.
- **Día 7:** caso integrador (unos 8 nodos de decisión) + "Cuándo derivar". **Sin examen final** (decisión del 1 nov 2026: el curso debe ser fácil).
- **Fuentes:** la guía ESC de cardio-oncología es de 2022; verificaré si hay actualización vigente y lo anotaré. Lo mismo con las guías de hipertensión (ESC 2024, AHA/ACC) e insuficiencia cardiaca.

## 6. Riesgos y cómo los manejo

1. **Exactitud médica:** no escribo nada de memoria. Cada afirmación sale de una fuente consultada en la web y queda citada. Te recomiendo que un médico revise los días 3, 5 y 6 antes de publicarlo (no es obligatorio, pero fortalece el portafolio).
2. **Plantas y cáncer:** redacción revisada contra el apartado 7 de tus instrucciones (sin "curas", sin dosis, nivel de evidencia siempre visible). Haré una verificación automática que busque palabras como "cura" o "dosis" en el contenido.
3. **Wikimedia Commons:** desde mi entorno en la nube Commons está bloqueado, así que lo consultaré **con Claude in Chrome en tu navegador** (API de Commons: búsqueda, autor, licencia exacta). El script `scripts/commons_catalog.py` queda igual en el repositorio como respaldo reproducible. Solo acepta PD/CC0/CC BY/CC BY-SA.
4. **NotebookLM y Gemini:** son pasos manuales tuyos; te dejaré guías exactas y yo verifico lo que generen contra las fuentes antes de integrarlo.
5. **Audio offline:** los MP3 pesan. Precargaré los textos y la app, y el audio se guardará en caché al reproducirse por primera vez (o con un botón "descargar día"), para no hacer pesada la instalación.
6. **Portafolio público:** el descargo estará en la pantalla de inicio y en "Acerca de".

## 7. Valores por defecto que elegí (dime si alguno no te sirve)

- Carpeta del proyecto: `Mini Cursos\curso-cardiologia\`.
- Nombre visible: **"Corazón y Cáncer: lo esencial en 7 días"**.
- Repositorio en GitHub: `curso-cardiologia` en tu cuenta (lo creas tú cuando lleguemos a la fase 8).
- Los días se desbloquean en orden, pero puedes navegar libremente a lo ya visto.
- Español neutro, trato de "usted" hacia el alumno.

## 8. Lo que te tocará hacer a ti (y cuándo)

| Fase | Tu tarea |
|---|---|
| 3 | Cargar fuentes en NotebookLM y generar audios / infografías según la guía |
| 5 | Tener Chrome abierto para que yo consulte Commons; generar imágenes en Gemini con los prompts |
| 7 | Probar en tu celular real |
| 8 | Crear el repositorio en GitHub y activar Pages |

## 9. Siguiente paso

**Fase 2:** objetivos de aprendizaje medibles por día y `FUENTES.md` con enlaces verificados en la web. Empiezo en cuanto apruebes este plan.
