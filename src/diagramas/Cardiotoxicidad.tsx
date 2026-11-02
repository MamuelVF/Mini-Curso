import { useState } from 'react'

// Mapa didáctico tratamiento → posible efecto → cómo se vigila.
// Fuentes: MedlinePlus doxorrubicina (F86), trastuzumab (F87), fluorouracilo (F88);
// NCI efectos tardíos (F26) e inhibidores de puntos de control (F85); IC-OS/MASCC 2026 (F12).
type Efecto = 'debil' | 'dolor' | 'inflama' | 'arterias'
const FILAS: { id: string; tto: string; ej: string; via: 'suero' | 'rayos'; efecto: Efecto; texto: string; cuando: string; vigila: string; fu: string }[] = [
  { id: 'antra', tto: 'Quimioterapia (antraciclinas)', ej: 'por ejemplo, doxorrubicina', via: 'suero', efecto: 'debil', texto: 'El músculo del corazón se puede debilitar y bombear peor.', cuando: 'Durante el tratamiento o meses y años después.', vigila: 'Electrocardiograma y ecografía del corazón antes y durante.', fu: 'MedlinePlus doxorrubicina; NCI' },
  { id: 'her2', tto: 'Terapia dirigida (anti-HER2)', ej: 'por ejemplo, trastuzumab', via: 'suero', efecto: 'debil', texto: 'Puede causar problemas serios en el corazón, como que bombee con menos fuerza.', cuando: 'Sobre todo durante el tratamiento.', vigila: 'Pruebas del corazón antes y durante.', fu: 'MedlinePlus trastuzumab; NCI' },
  { id: 'fluoro', tto: 'Quimioterapia (fluorouracilo)', ej: 'un antimetabolito', via: 'suero', efecto: 'dolor', texto: 'Puede dar dolor en el pecho. Es una señal de alarma.', cuando: 'Durante el tratamiento.', vigila: 'Avisar al médico de inmediato.', fu: 'MedlinePlus fluorouracilo' },
  { id: 'ici', tto: 'Inmunoterapia', ej: 'inhibidores de puntos de control', via: 'suero', efecto: 'inflama', texto: 'Rara vez, las defensas atacan también al corazón y lo inflaman (miocarditis).', cuando: 'Durante el tratamiento.', vigila: 'Conocer los síntomas y avisar enseguida.', fu: 'NCI' },
  { id: 'rt', tto: 'Radioterapia en el pecho', ej: 'sobre todo con dosis altas', via: 'rayos', efecto: 'arterias', texto: 'Con los años puede dañar las arterias del corazón o debilitarlo.', cuando: 'Años después.', vigila: 'Controles del corazón durante muchos años.', fu: 'NCI efectos tardíos' },
]
const CORAZON = 'M0 -6 C-4 -16 -20 -16 -20 -2 C-20 10 -6 18 0 26 C6 18 20 10 20 -2 C20 -16 4 -16 0 -6 Z'

export function Cardiotoxicidad() {
  const [sel, setSel] = useState(FILAS[0].id)
  const f = FILAS.find((x) => x.id === sel)!
  const colorCorazon = f.efecto === 'debil' ? '#e3a99f' : f.efecto === 'inflama' ? '#e0452f' : '#c0392b'
  return (
    <figure className="tarjeta p-3">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Elige un tratamiento">
        {FILAS.map((x) => (
          <button key={x.id} onClick={() => setSel(x.id)} aria-pressed={sel === x.id}
            className={`min-h-11 rounded-xl px-3 text-sm font-semibold border ${sel === x.id ? 'bg-verde-700 text-white border-verde-700' : 'bg-white border-[#dcdccf]'}`}>
            {x.tto}
          </button>
        ))}
      </div>
      <svg viewBox="0 0 320 190" className="w-full h-auto mt-3" role="img" aria-label={`${f.tto}: ${f.texto}`}>
        <defs><filter id="ct-brillo"><feGaussianBlur stdDeviation="4" /></filter></defs>
        {/* Persona */}
        <g fill="#efe3d3" stroke="#b9a58a" strokeWidth="1.5">
          <circle cx="160" cy="30" r="20" />
          <path d="M120 64 Q160 52 200 64 L214 150 Q160 160 106 150 Z" />
          <path d="M122 68 L92 130 L102 134 L130 88" />
          <path d="M198 68 L228 130 L218 134 L190 88" />
        </g>
        {/* Vía del tratamiento */}
        {f.via === 'suero' ? (
          <g>
            <rect x="40" y="14" width="30" height="42" rx="6" fill="#e6f1fb" stroke="#6b8fb5" />
            <rect x="44" y="30" width="22" height="22" rx="4" fill="#9cc3e8" />
            <path d="M55 56 C55 100 80 120 96 128" fill="none" stroke="#6b8fb5" strokeWidth="2" />
            <text x="55" y="70" textAnchor="middle" fontSize="8" fill="#3d5f82">medicina por la vena</text>
            <circle r="3" fill="#3d7fc1"><animateMotion dur="2s" repeatCount="indefinite" path="M55 56 C55 100 80 120 96 128" /></circle>
          </g>
        ) : (
          <g stroke="#e0b44a" strokeWidth="2.5" strokeLinecap="round">
            <rect x="240" y="6" width="52" height="22" rx="5" fill="#d9d4c7" stroke="#8a8270" strokeWidth="1.5" />
            <text x="266" y="21" textAnchor="middle" fontSize="8" fill="#3b382f" stroke="none">rayos</text>
            {[0, 1, 2].map((i) => <line key={i} x1={250 + i * 14} y1="30" x2={170 + i * 4} y2="96" strokeDasharray="5 4"><animate attributeName="stroke-dashoffset" from="18" to="0" dur=".8s" repeatCount="indefinite" /></line>)}
          </g>
        )}
        {/* Corazón */}
        {f.efecto === 'inflama' && <circle cx="168" cy="102" r="26" fill="#ff7b5c" opacity=".5" filter="url(#ct-brillo)" />}
        <g transform={`translate(168 98) scale(${f.efecto === 'debil' ? 1.15 : 0.95})`} style={{ transition: 'transform .4s' }}>
          <path d={CORAZON} fill={colorCorazon} stroke="#7a2e29" strokeWidth="1.5" style={{ transition: 'fill .4s' }} />
          {f.efecto === 'arterias' && <path d="M-12 -2 C-6 6 -2 8 2 18 M10 -4 C6 4 8 10 4 18" stroke="#f2d16b" strokeWidth="3" fill="none" />}
        </g>
        {f.efecto === 'dolor' && <path d="M196 80 l-10 14 h8 l-8 14" stroke="#e0b44a" strokeWidth="3" fill="none" strokeLinejoin="round" />}
        <text x="160" y="182" textAnchor="middle" fontSize="10" fontWeight="600" fill="#7a2e29">
          {f.efecto === 'debil' ? 'Corazón debilitado: bombea con menos fuerza' : f.efecto === 'inflama' ? 'Corazón inflamado' : f.efecto === 'dolor' ? 'Dolor en el pecho: avisar ya' : 'Arterias del corazón dañadas con los años'}
        </text>
      </svg>
      <ol className="mt-2 grid gap-2" aria-live="polite">
        <Paso n={1} titulo="Qué puede pasar" texto={f.texto} color="#9a3b2e" />
        <Paso n={2} titulo="Cuándo" texto={f.cuando} color="#8a6d4b" />
        <Paso n={3} titulo="Cómo lo vigila el equipo médico" texto={f.vigila} color="#2f5d3f" />
      </ol>
      <figcaption className="text-xs text-suave mt-3">
        {f.tto}: {f.ej}. Esquema educativo y simplificado; no es una lista completa ni sirve para decidir tratamientos. Fuente: {f.fu}; IC-OS/MASCC 2026.
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
