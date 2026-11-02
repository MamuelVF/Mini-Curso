import { useEffect, useRef, useState } from 'react'
import { useMovimientoReducido } from './usarMovimiento'

// De la planta a la medicina. Fuentes: digoxina (F89, F44), aspirina (F94), levadura roja (F95),
// vinca, tejo, podofilo y camptoteca (F106, F28, F108, F107).
type Forma = 'campanas' | 'arbol' | 'arroz' | 'flor' | 'sombrilla'
type Destino = 'corazon' | 'plaquetas' | 'arteria' | 'celula'
interface Planta { id: string; nombre: string; parte: string; sustancia: string; medicina: string; destino: Destino; forma: Forma; color: string; efecto: string; fuente: string }

const PLANTAS: Planta[] = [
  { id: 'dedalera', nombre: 'Dedalera', parte: 'hoja', sustancia: 'glucósidos digitálicos', medicina: 'Digoxina', destino: 'corazon', forma: 'campanas', color: '#a35bb5', efecto: 'El corazón late con más fuerza y con un ritmo más parejo.', fuente: 'F89, F44' },
  { id: 'sauce', nombre: 'Sauce', parte: 'corteza', sustancia: 'salicina', medicina: 'Aspirina', destino: 'plaquetas', forma: 'arbol', color: '#8fae5d', efecto: 'Calma el dolor y la fiebre, y hace que las plaquetas se peguen menos.', fuente: 'F94' },
  { id: 'levadura', nombre: 'Levadura roja', parte: 'arroz fermentado', sustancia: 'monacolina K', medicina: 'Lovastatina', destino: 'arteria', forma: 'arroz', color: '#b5392f', efecto: 'Frena la fabricación de colesterol y se acumula menos grasa en las arterias.', fuente: 'F95' },
  { id: 'vinca', nombre: 'Vinca', parte: 'planta', sustancia: 'vincristina', medicina: 'Vincristina', destino: 'celula', forma: 'flor', color: '#e27aa8', efecto: 'Impide que la célula de cáncer se divida.', fuente: 'F106, F83' },
  { id: 'tejo', nombre: 'Tejo', parte: 'corteza', sustancia: 'paclitaxel', medicina: 'Paclitaxel', destino: 'celula', forma: 'arbol', color: '#3f6b46', efecto: 'Detiene la división de la célula de cáncer.', fuente: 'F28' },
  { id: 'podofilo', nombre: 'Podofilo', parte: 'planta', sustancia: 'podofilotoxina', medicina: 'Etopósido', destino: 'celula', forma: 'sombrilla', color: '#6f9a3a', efecto: 'Rompe el ADN de la célula de cáncer y no puede dividirse.', fuente: 'F108' },
  { id: 'camptoteca', nombre: 'Camptoteca', parte: 'corteza', sustancia: 'camptotecina', medicina: 'Topotecán', destino: 'celula', forma: 'arbol', color: '#5d8a4a', efecto: 'Medicina contra el cáncer de ovario y de pulmón.', fuente: 'F107' },
]
const CORAZON = 'M0 -6 C-4 -16 -20 -16 -20 -2 C-20 10 -6 18 0 26 C6 18 20 10 20 -2 C20 -16 4 -16 0 -6 Z'
const RUTA = 'M62 72 C90 40 110 40 134 62 M170 62 C190 40 210 40 228 62 M262 62 C278 46 290 46 300 56'

function DibujoPlanta({ p }: { p: Planta }) {
  const tallo = <path d="M0 40 V-10" stroke="#5b7a3a" strokeWidth="3" />
  switch (p.forma) {
    case 'campanas':
      return <g>{tallo}{[-4, 4, 12, 20, 28].map((y, i) => <path key={i} d={`M${i % 2 ? 2 : -2} ${y - 12} q${i % 2 ? 10 : -10} 2 ${i % 2 ? 12 : -12} 10 l${i % 2 ? -6 : 6} 2 z`} fill={p.color} stroke="#6d3780" strokeWidth=".8" />)}
        <ellipse cx="-10" cy="36" rx="10" ry="4" fill="#6f9a3a" /><ellipse cx="10" cy="36" rx="10" ry="4" fill="#6f9a3a" /></g>
    case 'arbol':
      return <g><rect x="-6" y="0" width="12" height="40" rx="3" fill="#8a6d4b" />{[8, 18, 28].map((y) => <path key={y} d={`M-6 ${y} q6 3 12 0`} stroke="#6b5238" fill="none" />)}
        <circle cx="0" cy="-12" r="20" fill={p.color} /><circle cx="-14" cy="-2" r="12" fill={p.color} /><circle cx="14" cy="-2" r="12" fill={p.color} /></g>
    case 'arroz':
      return <g><ellipse cx="0" cy="28" rx="26" ry="9" fill="#e8dcc8" stroke="#8a6d4b" />{Array.from({ length: 14 }, (_, i) => <ellipse key={i} cx={-18 + (i % 7) * 6} cy={20 + Math.floor(i / 7) * 6 - (i % 3)} rx="3.2" ry="1.6" transform={`rotate(${(i * 37) % 60 - 30} ${-18 + (i % 7) * 6} ${20 + Math.floor(i / 7) * 6})`} fill={p.color} />)}</g>
    case 'flor':
      return <g>{tallo}<ellipse cx="-10" cy="18" rx="10" ry="4" fill="#4f7d3a" transform="rotate(-25 -10 18)" /><ellipse cx="10" cy="24" rx="10" ry="4" fill="#4f7d3a" transform="rotate(25 10 24)" />
        <g transform="translate(0 -14)">{[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx="0" cy="-9" rx="6" ry="9" fill={p.color} transform={`rotate(${a})`} />)}<circle r="3.5" fill="#a5245b" /></g></g>
    case 'sombrilla':
      return <g>{tallo}<path d="M-26 -6 Q0 -26 26 -6 Q14 -10 8 -2 Q0 -12 -8 -2 Q-14 -10 -26 -6 Z" fill={p.color} stroke="#4f7d3a" /><circle cx="0" cy="6" r="4" fill="#fff" stroke="#c9b48a" /></g>
  }
}

function DibujoDestino({ d, t, activo }: { d: Destino; t: number; activo: boolean }) {
  if (d === 'corazon') {
    const s = 1 + (activo ? 0.12 * Math.max(0, Math.sin(t * 6)) : 0)
    return <g transform={`scale(${s * 1.1})`}><path d={CORAZON} fill="#c0392b" stroke="#7a2e29" strokeWidth="1.5" /></g>
  }
  if (d === 'plaquetas') {
    const sep = activo ? 8 + 3 * Math.sin(t * 2) : 3
    return <g><rect x="-28" y="-14" width="56" height="34" rx="8" fill="#fbe1da" stroke="#c8574a" strokeWidth="2" />
      {[-1, 0, 1].map((i) => <circle key={i} cx={i * (6 + sep)} cy="3" r="5" fill="#e0b44a" stroke="#a87a22" />)}</g>
  }
  if (d === 'arteria') {
    const placa = activo ? 4 : 10
    return <g><rect x="-30" y="-16" width="60" height="36" rx="6" fill="#c8574a" /><rect x="-30" y="-10" width="60" height="24" fill="#fbe1da" />
      <path d={`M-14 -10 Q0 ${-10 + placa} 14 -10 Z`} fill="#f2d16b" style={{ transition: 'all .6s' }} /><path d={`M-14 14 Q0 ${14 - placa} 14 14 Z`} fill="#f2d16b" style={{ transition: 'all .6s' }} /></g>
  }
  // Célula de cáncer que intenta dividirse; la medicina la frena
  const abre = activo ? 0 : 6 + 4 * Math.sin(t * 2)
  return <g>
    <ellipse cx={-abre} cy="2" rx="16" ry="18" fill="#c9a2d6" stroke="#7d4f8f" strokeWidth="1.5" />
    <ellipse cx={abre} cy="2" rx="16" ry="18" fill="#c9a2d6" stroke="#7d4f8f" strokeWidth="1.5" opacity=".9" />
    <circle cx="0" cy="2" r="6" fill="#7d4f8f" />
    {activo && <path d="M-22 -18 L22 22 M22 -18 L-22 22" stroke="#2f6b4f" strokeWidth="3" opacity=".75" />}
  </g>
}

export function PlantaMedicina() {
  const reducido = useMovimientoReducido()
  const [sel, setSel] = useState(PLANTAS[0].id)
  const [t, setT] = useState(0)
  const ref = useRef(0)
  const p = PLANTAS.find((x) => x.id === sel)!
  useEffect(() => {
    if (reducido) return
    let ult = performance.now()
    const paso = (ahora: number) => { const dt = Math.max(0, Math.min(0.1, (ahora - ult) / 1000)); setT((x) => x + dt); ult = ahora; ref.current = requestAnimationFrame(paso) }
    ref.current = requestAnimationFrame(paso)
    return () => cancelAnimationFrame(ref.current)
  }, [reducido])
  useEffect(() => setT(0), [sel])

  // Fase del viaje: 0-1 planta→frasco, 1-2 frasco→medicina, 2-3 medicina→destino, luego efecto
  const fase = reducido ? 4 : (Math.max(0, t) * 0.8) % 5
  const activo = fase >= 3
  const pos = (f: number) => {
    const tramos = [[62, 72, 134, 62], [170, 62, 228, 62], [262, 62, 300, 56]]
    const i = Math.max(0, Math.min(2, Math.floor(f))); const k = f - i; const [x1, y1, x2, y2] = tramos[i]
    return { x: x1 + (x2 - x1) * k, y: y1 + (y2 - y1) * k - Math.sin(k * Math.PI) * 18 }
  }
  const bola = fase < 3 ? pos(fase) : null
  const destinoTexto = p.destino === 'corazon' ? 'corazón' : p.destino === 'plaquetas' ? 'plaquetas' : p.destino === 'arteria' ? 'arteria' : 'célula de cáncer'

  return (
    <figure className="tarjeta p-3">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Elige una planta">
        {PLANTAS.map((x) => (
          <button key={x.id} onClick={() => setSel(x.id)} aria-pressed={sel === x.id}
            className={`min-h-11 rounded-xl px-3 text-sm font-semibold border ${sel === x.id ? 'bg-verde-700 text-white border-verde-700' : 'bg-white border-[#dcdccf]'}`}>{x.nombre}</button>
        ))}
      </div>
      <svg viewBox="0 0 360 150" className="w-full h-auto mt-3" role="img" aria-label={`${p.nombre} (${p.parte}): de ella sale ${p.sustancia}, que dio la medicina ${p.medicina}, que actúa en: ${destinoTexto}. ${p.efecto}`}>
        <rect width="360" height="150" rx="12" fill="#f6f5ef" />
        <path d={RUTA} stroke="#c9b48a" strokeWidth="2" strokeDasharray="4 5" fill="none" />
        {/* 1. Planta */}
        <g transform="translate(40 62)"><DibujoPlanta p={p} /></g>
        {/* 2. Frasco con la sustancia */}
        <g transform="translate(152 64)">
          <path d="M-7 -26 H7 V-10 L18 18 Q20 24 14 24 H-14 Q-20 24 -18 18 L-7 -10 Z" fill="#ffffff" stroke="#6b8fb5" strokeWidth="1.8" />
          <path d="M-13 10 H13 L17 19 Q18 22 14 22 H-14 Q-18 22 -17 19 Z" fill={p.color} opacity={fase >= 1 || reducido ? 0.85 : 0.25} style={{ transition: 'opacity .4s' }} />
        </g>
        {/* 3. Medicina */}
        <g transform="translate(245 62)">
          {p.destino === 'celula'
            ? <g><rect x="-9" y="-22" width="18" height="34" rx="4" fill="#e6f1fb" stroke="#6b8fb5" strokeWidth="1.5" /><rect x="-6" y="-6" width="12" height="15" rx="2" fill={p.color} opacity={fase >= 2 || reducido ? 0.9 : 0.25} /><rect x="-5" y="-27" width="10" height="6" rx="1" fill="#6b8fb5" /></g>
            : <g transform="rotate(-30)"><rect x="-16" y="-7" width="32" height="14" rx="7" fill="#fff" stroke="#8a6d4b" strokeWidth="1.5" /><path d="M0 -7 H9 A7 7 0 0 1 9 7 H0 Z" fill={p.color} opacity={fase >= 2 || reducido ? 0.9 : 0.3} /></g>}
        </g>
        {/* 4. Destino */}
        <g transform="translate(322 62)"><DibujoDestino d={p.destino} t={t} activo={activo || reducido} /></g>
        {bola && <circle cx={bola.x} cy={bola.y} r="5" fill={p.color} stroke="#fff" strokeWidth="1.5" />}
        {/* Rótulos */}
        <g fontSize="9" textAnchor="middle" fill="#3b382f">
          <text x="40" y="122" fontWeight="700">{p.nombre}</text><text x="40" y="134" fill="#6b6455">{p.parte}</text>
          <text x="152" y="122" fontWeight="700">sustancia</text><text x="152" y="134" fill="#6b6455">{p.sustancia}</text>
          <text x="245" y="122" fontWeight="700">medicina</text><text x="245" y="134" fill="#6b6455">{p.medicina}</text>
          <text x="322" y="122" fontWeight="700">destino</text><text x="322" y="134" fill="#6b6455">{destinoTexto}</text>
        </g>
      </svg>
      <p className="mt-2" aria-live="polite"><strong>{p.medicina}.</strong> {p.efecto}</p>
      <figcaption className="text-xs text-suave mt-2">Esquema didáctico simplificado. Fuente: {p.fuente}.</figcaption>
    </figure>
  )
}
