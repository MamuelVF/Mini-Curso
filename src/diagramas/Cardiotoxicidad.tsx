import { useState } from 'react'

// Mapa didáctico tratamiento → posible efecto → cómo se vigila.
// Fuentes: MedlinePlus doxorrubicina (F86), trastuzumab (F87), fluorouracilo (F88);
// NCI efectos tardíos (F26) e inhibidores de puntos de control (F85); IC-OS/MASCC 2026 (F12).
const FILAS = [
  { id: 'antra', tto: 'Antraciclinas', ej: 'doxorrubicina', efecto: 'Debilidad del músculo cardiaco (insuficiencia cardiaca)', cuando: 'Durante o meses a años después', vigila: 'ECG y ecocardiograma antes y durante', fu: 'MedlinePlus doxorrubicina; NCI' },
  { id: 'her2', tto: 'Anti-HER2', ej: 'trastuzumab', efecto: 'Problemas cardiacos graves', cuando: 'Durante el tratamiento; también tardíos', vigila: 'Pruebas del corazón antes y durante', fu: 'MedlinePlus trastuzumab; NCI' },
  { id: 'fluoro', tto: 'Antimetabolitos', ej: 'fluorouracilo', efecto: 'Dolor en el pecho (síntoma de alarma)', cuando: 'Durante el tratamiento', vigila: 'Avisar al médico de inmediato', fu: 'MedlinePlus fluorouracilo' },
  { id: 'ici', tto: 'Inmunoterapia', ej: 'inhibidores de puntos de control', efecto: 'Miocarditis (rara)', cuando: 'Durante el tratamiento', vigila: 'Reconocer síntomas y avisar', fu: 'NCI' },
  { id: 'rt', tto: 'Radioterapia en el tórax', ej: 'sobre todo a dosis altas', efecto: 'Enfermedad arterial coronaria, insuficiencia cardiaca', cuando: 'Años después', vigila: 'Seguimiento cardiovascular a largo plazo', fu: 'NCI efectos tardíos' },
]

export function Cardiotoxicidad() {
  const [sel, setSel] = useState(FILAS[0].id)
  const f = FILAS.find((x) => x.id === sel)!
  return (
    <figure className="tarjeta p-4">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Elija un tratamiento">
        {FILAS.map((x) => (
          <button key={x.id} onClick={() => setSel(x.id)} aria-pressed={sel === x.id}
            className={`min-h-11 rounded-xl px-3 text-sm font-semibold border ${sel === x.id ? 'bg-verde-700 text-white border-verde-700' : 'bg-white border-[#dcdccf]'}`}>
            {x.tto}
          </button>
        ))}
      </div>
      <ol className="mt-4 grid gap-2" aria-live="polite">
        <Paso n={1} titulo="Tratamiento" texto={`${f.tto} (${f.ej})`} color="#2f5d3f" />
        <Paso n={2} titulo="Posible efecto en el corazón" texto={f.efecto} color="#9a3b2e" />
        <Paso n={3} titulo="Cuándo" texto={f.cuando} color="#8a6d4b" />
        <Paso n={4} titulo="Cómo se vigila" texto={f.vigila} color="#2f5d3f" />
      </ol>
      <figcaption className="text-xs text-suave mt-3">
        Esquema educativo y simplificado; no es una lista completa ni orienta decisiones clínicas. Fuente: {f.fu}; IC-OS/MASCC 2026.
      </figcaption>
    </figure>
  )
}

function Paso({ n, titulo, texto, color }: { n: number; titulo: string; texto: string; color: string }) {
  return (
    <li className="flex gap-3 items-start">
      <span className="shrink-0 w-7 h-7 rounded-full text-white text-sm font-bold grid place-items-center" style={{ background: color }} aria-hidden>{n}</span>
      <span><span className="block text-xs font-semibold text-suave">{titulo}</span><span className="block">{texto}</span></span>
    </li>
  )
}
