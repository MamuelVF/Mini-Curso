# Guía de NotebookLM para el curso

*Corazón y Cáncer: lo esencial en 7 días · Fase 3 · 1 de noviembre de 2026*

Esta guía te dice qué cargar, qué generar y dónde guardar cada archivo. Hazlo un día a la vez. Cada día toma unos 20-30 minutos, casi todo de espera mientras NotebookLM genera.

Los nombres de los botones pueden variar según tu versión de NotebookLM. Si alguno no aparece, sáltalo y anótalo en la tabla del final.

---

## 1. Preparación (una sola vez)

1. Entra a https://notebooklm.google.com con tu cuenta de Google.
2. En la configuración, pon el idioma de salida en **Español**. Si no ves esa opción, cada prompt de esta guía ya pide español.
3. Crea en tu PC estas carpetas dentro de `curso-cardiologia\` (si no existen):
   - `public\audio\`
   - `public\img\notebooklm\`
   - `notebooklm\dia-1\generado\` … `notebooklm\dia-7\generado\`

## 2. Para cada día (repite del 1 al 7)

### Paso 1 · Crear el cuaderno y cargar fuentes
1. **Nuevo cuaderno** → nómbralo **"Curso corazón · Día N"**.
2. Abre `notebooklm\dia-N\FUENTES_DIA_N.md` y carga las fuentes ★ como **Sitio web** (las demás son opcionales).
3. Sube `notebooklm\dia-N\ENFOQUE_DIA_N.md` como archivo, o pega su texto como **Texto copiado**. Esto le dice a NotebookLM qué objetivos tiene el día y qué reglas seguir.
4. Revisa que todas las fuentes aparezcan sin error. Si una falla, descarga su PDF y súbelo.

### Paso 2 · Generar en el Studio

Al generar cada elemento, pega el prompt correspondiente en el campo de personalización (el ícono de lápiz o "Personalizar"). Copia `{ENFOQUE}` de la tabla de la sección 3.

| # | Qué generar | Prompt de personalización | Dónde guardarlo |
|---|---|---|---|
| 1 | **Resumen en audio** (formato "Breve" o "Resumen"; si no existe, "Análisis detallado" con duración corta) | `En español neutro. Dirigido a un biólogo con 30 años en fitoterapia que no es médico. Duración breve (8-12 minutos). Enfócate en: {ENFOQUE}. Usa analogías del mundo vegetal cuando ayuden. No menciones dosis. No digas ni insinúes que alguna planta cura el cáncer. Termina con 3 ideas clave para recordar.` | Descarga → `public\audio\dia-N.mp3` (si baja como .m4a o .wav, déjalo así y yo lo convierto) |
| 2 | **Infografía** (si tu versión la tiene) | `En español. Estilo limpio y sobrio, tonos verdes y beige. Resume los objetivos del día: {ENFOQUE}. Sin dosis.` | `public\img\notebooklm\dia-N-infografia.png` |
| 3 | **Mapa mental** | (no lleva prompt) | Descárgalo o haz una captura → `public\img\notebooklm\dia-N-mapa-mental.png` |
| 4 | **Guía de estudio** (en Informes) | `En español. Una página. Conceptos clave con definiciones simples y 5 preguntas de repaso fáciles.` | Copia el texto → `notebooklm\dia-N\generado\guia-estudio.md` |
| 5 | **Tarjetas didácticas** | `En español. 15 tarjetas fáciles, una idea por tarjeta, respuestas de una frase.` | Copia o exporta → `notebooklm\dia-N\generado\tarjetas.md` |
| 6 | **Cuestionario** | `En español. 8 preguntas fáciles de opción múltiple, con explicación de cada respuesta.` | Copia → `notebooklm\dia-N\generado\cuestionario.md` |
| 7 | **Preguntas frecuentes** (opcional; en el chat si no hay botón) | Escribe en el chat: `Crea 6 preguntas frecuentes que haría un biólogo naturista sobre este tema, con respuestas breves en español citando las fuentes.` | Copia → `notebooklm\dia-N\generado\faq.md` |
| 8 | **Presentación o resumen en video** (opcional; solo si te gusta para el portafolio) | `En español, breve, para un biólogo. Enfócate en: {ENFOQUE}.` | Video → `public\video\dia-N.mp4` · Presentación → `notebooklm\dia-N\generado\` |

**Extra solo para el día 6:** genera también una **línea de tiempo** (en Informes, o en el chat con `Crea una línea de tiempo del descubrimiento de la digoxina, el paclitaxel y la vincristina, solo con datos de las fuentes`). Guárdala en `notebooklm\dia-6\generado\linea-tiempo.md`.

### Paso 3 · Avisarme
Cuando termines un día, escríbeme **"día N listo"**. Yo leo lo que guardaste en tu carpeta, lo verifico y lo integro.

## 3. Enfoque de cada día (para reemplazar `{ENFOQUE}`)

| Día | {ENFOQUE} |
|---|---|
| 1 | `las 4 cavidades y 4 válvulas, el recorrido de la sangre por la circulación pulmonar y sistémica, la sístole y la diástole, y el sistema eléctrico del corazón` |
| 2 | `qué es la presión arterial, cómo influyen el caudal y la resistencia, por qué la hipertensión es silenciosa, y cómo se forma una placa de aterosclerosis hasta causar un infarto` |
| 3 | `qué es la insuficiencia cardiaca y la fracción de eyección, cómo leer lo básico de un electrocardiograma, la fibrilación auricular y los 8 esenciales de la salud cardiovascular` |
| 4 | `qué es el cáncer, las características del cáncer según Hanahan, cómo un tumor crea sus propios vasos y cómo viaja por la sangre en la metástasis` |
| 5 | `qué es la cardiotoxicidad, qué tratamientos del cáncer pueden afectar el corazón, cómo se vigila el corazón antes, durante y después del tratamiento, y por qué el seguimiento continúa en los supervivientes` |
| 6 | `cómo coagula la sangre, por qué el cáncer aumenta el riesgo de trombosis, los fármacos que nacieron de plantas (digoxina, paclitaxel, vincristina), los niveles de evidencia de las plantas y las interacciones planta-fármaco más peligrosas` |
| 7 | `las señales de alarma cardiovasculares que requieren atención médica urgente y un repaso amable de las ideas clave de los 6 días` |

**Día 7:** para que pueda repasar, carga además las fuentes ★ de los días 1, 3, 5 y 6, sin pasar de 50 fuentes.

## 4. Cómo verifico lo que genera NotebookLM

NotebookLM puede equivocarse o simplificar de más. Antes de usar cualquier cosa en la app:

1. Comparo cada dato con la fuente citada en [FUENTES.md](../FUENTES.md).
2. Reviso el audio con su transcripción (si NotebookLM la ofrece) o escuchándolo.
3. Si algo no coincide, lo corrijo en la app y lo anoto en `notebooklm\dia-N\VERIFICACION.md` (qué decía, qué dice la fuente y qué se cambió).
4. Si el audio tiene un error importante (una dosis, una "cura", un dato falso), te pido que lo generes de nuevo con una indicación concreta en vez de publicarlo.
5. En la app, todo lo que viene de NotebookLM lleva la etiqueta **"Generado con NotebookLM a partir de fuentes verificadas"**.

## 5. Tabla de avance (márcala tú)

| Día | Fuentes cargadas | Audio | Infografía | Mapa mental | Guía | Tarjetas | Cuestionario | FAQ | Notas |
|---|---|---|---|---|---|---|---|---|---|
| 1 | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | |
| 2 | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | |
| 3 | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | |
| 4 | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | |
| 5 | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | |
| 6 | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | |
| 7 | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | |

**No hace falta terminar todo antes de seguir.** Mientras tú avanzas con NotebookLM, yo puedo empezar la Fase 4 (contenido del día 1). Los audios e imágenes se integran cuando lleguen.
