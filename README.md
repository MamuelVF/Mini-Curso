# Corazón y Cáncer: lo esencial en 7 días

Microcurso interactivo, instalable como app (PWA), que enseña en 7 días y unos 20 minutos diarios lo esencial de la cardiología y su relación con el cáncer. Está pensado para profesionales de la biología y la fitoterapia que no son médicos.

**Autor del curso:** Blgo. Samuel Vinces Zamora · [biovinces.com](https://biovinces.com)

> Curso educativo, no clínico. No sustituye la atención médica ni orienta tratamientos. No contiene dosis ni pautas.

---

## Caso de estudio

### El reto

Un biólogo con 30 años de experiencia en fitoterapia recibe a menudo preguntas de personas con cáncer o con problemas del corazón. Necesitaba una base sólida y actual para entender esas enfermedades, reconocer cuándo derivar y detectar interacciones peligrosas entre plantas y fármacos. Todo debía ser breve, fácil, en español y basado en fuentes de primer nivel.

### La solución

Una app web estática, ligera y que funciona sin conexión:

- **7 días, 37 lecciones y 181 tarjetas** cortas que se pasan deslizando.
- **6 diagramas interactivos:** ciclo cardiaco animado, recorrido de la sangre, presión y resistencia, ECG normal frente a fibrilación auricular, mapa de cardiotoxicidad y coagulación paso a paso.
- **Práctica diaria fácil** (34 preguntas) con explicación en cada respuesta. El puntaje es solo una referencia: nada se aprueba ni se reprueba y todos los días están abiertos.
- **Repaso espaciado** de 81 tarjetas con el algoritmo FSRS, más preguntas mezcladas de días anteriores.
- **Caso integrador ramificado** de 8 decisiones: una paciente en tratamiento oncológico que consulta por plantas.
- **"Cuándo derivar":** señales de alarma (infarto, ictus, trombosis, embolia, sangrado con anticoagulantes) siempre a un toque.
- **Glosario** de 82 términos con búsqueda sin tildes.
- **Audio** de resumen por día (generado con NotebookLM) con control de velocidad.

### Decisiones de aprendizaje

| Principio | Cómo se aplica |
|---|---|
| Práctica de recuperación | Preguntas previas antes de explicar y práctica al final de cada día |
| Repaso espaciado | FSRS (ts-fsrs) con 10 tarjetas nuevas al día y retención objetivo del 90% |
| Práctica intercalada | El repaso mezcla preguntas de los días ya iniciados |
| Ejemplos resueltos | Tarjetas que aplican números y conceptos a un caso concreto |
| Codificación dual | Diagramas propios e imágenes con crédito junto al texto |
| Analogías del mundo vegetal | Conectan con la experiencia del alumno y siempre dicen su límite |
| Baja ansiedad | Sin examen; el puntaje es referencial y se puede repetir todo |

### Rigor del contenido

- **88 fuentes citadas** con fecha de consulta: guías ESC y AHA/ACC vigentes (hipertensión 2024 y 2025, insuficiencia cardiaca 2026, fibrilación auricular 2024, cardio-oncología 2022), IC-OS/MASCC 2026, ASCO 2023, NCI, OMS, MedlinePlus, NCCIH, OpenStax y artículos revisados por pares.
- **Cada tarjeta, pregunta y término cita sus fuentes**, visibles en la app. Ver [FUENTES.md](FUENTES.md).
- **Las plantas siempre llevan su nivel de evidencia** (fármaco aprobado, evidencia clínica limitada, preliminar o uso tradicional). Nunca se sugiere que una planta reemplace el tratamiento del cáncer.
- **Pruebas automáticas de seguridad del contenido:** fallan si aparece una dosis, una promesa de curación, una cita inexistente o un caso sin salida.

### Privacidad

No hay cuentas, servidores ni analítica. El progreso se guarda solo en el dispositivo (localStorage) y se puede exportar o importar como archivo. No se piden datos personales ni de salud.

---

## Tecnología

| Área | Elección |
|---|---|
| Interfaz | React 18 + TypeScript, Vite 8 |
| Estilos | Tailwind CSS v4, tipografía Lora autoalojada |
| Sin conexión | vite-plugin-pwa (Workbox): precarga del curso y caché del audio |
| Repaso espaciado | ts-fsrs |
| Validación del contenido | zod + Vitest |
| Publicación | GitHub Actions → GitHub Pages |

Resultado de Lighthouse en móvil (compilación de producción): rendimiento 98, accesibilidad 100, buenas prácticas 100 y SEO 100.

### Estructura

```
src/
  content/       contenido del curso en JSON (días, flashcards, glosario, fuentes, imágenes, caso)
  diagramas/     diagramas interactivos en SVG + React
  features/      pantallas (inicio, día, lección, práctica, repaso, glosario, páginas)
  components/    piezas reutilizables (tarjeta, pregunta, imagen con crédito, audio)
  lib/           estado, progreso, repaso FSRS, rutas, esquemas
tests/           validación del contenido y de la lógica
scripts/         descarga de imágenes de Commons e íconos
notebooklm/      guía y fuentes por día para generar audio e infografías
```

## Uso local

```bash
npm install
npm run dev        # servidor de desarrollo
npm test           # pruebas de contenido y lógica
npm run build      # compilación de producción en dist/
python3 scripts/commons_catalog.py   # descarga las imágenes de Commons y verifica sus licencias
```

## Publicar en GitHub Pages

1. Crea un repositorio en GitHub (por ejemplo `curso-cardiologia`) y sube este proyecto a la rama `main`.
2. En el repositorio: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Cada `push` a `main` ejecuta [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml): descarga las imágenes de Commons, corre las pruebas, compila y publica en `https://<usuario>.github.io/<repositorio>/`.

## Imágenes y licencias

- **Wikimedia Commons:** solo dominio público, CC0, CC BY o CC BY-SA, con autor, licencia y enlace visibles en cada imagen y en la Galería.
- **Ilustraciones con IA:** solo para analogías, nunca para anatomía; llevan la etiqueta "Generada con IA".
- **Infografías y audio de NotebookLM:** generados a partir de las fuentes del curso y marcados como tales.

Detalles y prompts en [PROMPTS_IMAGENES.md](PROMPTS_IMAGENES.md).

## Créditos

Contenido y dirección: Blgo. Samuel Vinces Zamora. Desarrollo con ayuda de Claude Code. Los textos de las fuentes pertenecen a sus autores; el curso los resume y cita.
