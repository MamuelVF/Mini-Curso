# Imágenes del curso

El curso usa tres tipos de imágenes. Cada una muestra siempre su autor y su licencia en la app.

| Tipo | Cuántas | Quién las consigue | Dónde van |
|---|---|---|---|
| Wikimedia Commons (anatomía, plantas, microscopía) | 10 | Las descarga el script `scripts/commons_catalog.py` (lo corre GitHub Actions en cada publicación, o tú con `python3 scripts/commons_catalog.py`) | `public/img/commons/` |
| Ilustraciones con IA (solo analogías, nunca anatomía) | 4 | Generadas con Gemini (listas) | `public/img/ia/` |
| Infografías de NotebookLM (resumen de cada día) | 7 | Tú, con NotebookLM (ver `notebooklm/GUIA_NOTEBOOKLM.md`) | `public/img/notebooklm/` |

Mientras una imagen no exista, la app simplemente no la muestra: nada se rompe.

## 1. Imágenes de Commons (ya elegidas y verificadas)

Verifiqué autor y licencia de cada archivo en la API de Commons el 1 de noviembre de 2026. Solo se aceptan dominio público, CC0, CC BY y CC BY-SA. El script vuelve a comprobar la licencia antes de descargar y avisa si alguna cambió.

| ID | Archivo en Commons | Autor | Licencia | Dónde aparece |
|---|---|---|---|---|
| img-d1-torax | Gray490.png | Henry Vandyke Carter | Dominio público | Día 1, "Del tamaño de un puño" |
| img-d1-cavidades | Heart diagram-es.svg | ZooFari y colaboradores | CC BY-SA 3.0 | Día 1, "Cuatro cavidades" |
| img-d1-valvulas | Gray496.png | Henry Vandyke Carter | Dominio público | Día 1, "Cuatro puertas" |
| img-d2-arteria | Blausen 0052 Artery NormalvPartially-BlockedVessel.png | BruceBlaus | CC BY 3.0 | Día 2, "La placa" |
| img-d4-celula | Breast cancer cell (1).jpg | NCI | Dominio público | Día 4, "Una definición sencilla" |
| img-d4-metastasis | Diagram showing cancer cells spreading into the blood stream CRUK 448.svg | Cancer Research UK | CC BY-SA 4.0 | Día 4, "Los pasos del viaje" |
| img-d6-coagulo | Blood clot in scanning electron microscopy.jpg | Janice Carr (CDC) | Dominio público | Día 6, "Los factores de coagulación" |
| img-d6-digitalis | Digitalis purpurea LC0101.jpg | Jörg Hempel | CC BY-SA 3.0 de | Día 6, "Digoxina" |
| img-d6-tejo | Yew bark Taxol PD.jpg | Gobierno de EE. UU. | Dominio público | Día 6, "Paclitaxel" |
| img-d6-vinca | Catharanthus roseus24 08 2012 (2).JPG | Joydeep | CC BY-SA 3.0 | Día 6, "Vincristina y vinblastina" |

Descarté dos candidatas: un ecocardiograma sin autor declarado en Commons y un esquema del sistema de conducción sin rótulos. La conducción ya se explica con el diagrama animado del ciclo cardiaco.

## 2. Ilustraciones con IA (Gemini)

**Reglas:** solo para analogías y ambiente, nunca para mostrar anatomía ni fármacos. Sin texto dentro de la imagen (la IA suele escribir mal). En la app llevan la etiqueta "Generada con IA".

**Cómo hacerlo:**
1. Abre Gemini e inicia sesión tú mismo.
2. Pega el prompt tal cual.
3. Si el resultado tiene letras, manos raras o algo que parezca un órgano, pide otra versión.
4. Descarga la imagen, renómbrala como indica la tabla y guárdala en `public/img/ia/`.

**Estilo común (ya incluido en cada prompt):** ilustración plana y cálida tipo libro de texto moderno, paleta verde salvia (#2f5d3f), tierra (#8a6d4b) y crema (#f6f5ef), formato horizontal 4:3, sin texto, fondo limpio.

### img-ia-d4-huerto → `public/img/ia/d4-huerto.jpg`
> Ilustración plana y cálida tipo libro de texto moderno. Un huerto visto de lado con hileras ordenadas de plantas iguales, separadas por espacios regulares. En el centro, una sola planta crece de forma desmedida y desordenada, con tallos que invaden a sus vecinas. Paleta verde salvia, tierra y crema. Formato horizontal 4:3. Sin texto, sin letras, sin personas. Fondo limpio.

### img-ia-d6-resina → `public/img/ia/d6-resina.jpg`
> Ilustración plana y cálida tipo libro de texto moderno. Primer plano del tronco de un árbol con un corte reciente en la corteza, cubierto por gotas de resina color ámbar que sellan la herida. Luz suave. Paleta verde salvia, tierra, ámbar y crema. Formato horizontal 4:3. Sin texto, sin letras, sin personas. Fondo limpio.

### img-ia-d6-natural → `public/img/ia/d6-natural.jpg`
> Ilustración plana y cálida tipo libro de texto moderno. Sobre una mesa de madera, varios frascos de vidrio con hierbas secas y hojas, una lupa y un cuaderno abierto con dibujos de hojas. A un lado, un pequeño triángulo de precaución sin texto. Ambiente sereno y profesional. Paleta verde salvia, tierra y crema. Formato horizontal 4:3. Sin texto, sin letras, sin etiquetas legibles, sin pastillas ni jeringas.

### img-ia-d7-conversacion → `public/img/ia/d7-conversacion.jpg`
> Ilustración plana y cálida tipo libro de texto moderno. Dos adultos latinoamericanos de mediana edad conversan sentados a una mesa con una planta en maceta y un cuaderno. Uno escucha con atención y gesto amable; el otro explica. Ambiente de consulta tranquila, no hospitalaria. Paleta verde salvia, tierra y crema. Formato horizontal 4:3. Sin texto, sin letras, sin batas médicas ni estetoscopios.

## 3. Infografías de NotebookLM

Guarda cada infografía como `public/img/notebooklm/dia-N-infografia.jpg` (N de 1 a 7). Aparecen al final de cada día, en "Lo esencial del día", con la etiqueta "NotebookLM". Revisa que no incluyan dosis ni afirmaciones que no estén en las fuentes antes de guardarlas.
