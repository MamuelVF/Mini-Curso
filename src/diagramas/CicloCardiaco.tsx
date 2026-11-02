import { useEffect, useState } from 'react'
import { useMovimientoReducido } from './usarMovimiento'
import { IcoPausa, IcoPlay } from '../components/Iconos'

// Fuente: OpenStax A&P 2e, 19.2 y 19.3 (F61, F62). Esquema didáctico simplificado.
type Fase = { nombre: string; texto: string; aur: boolean; ven: boolean; av: boolean; sl: boolean; flujo: 'av' | 'sl' | null; chispa?: 'sa' | 'av'; ruido?: string }
const FASES: Fase[] = [
  { nombre: 'Se llena', texto: 'El corazón está relajado. La sangre entra y va llenando las cuatro cavidades.', aur: false, ven: false, av: true, sl: false, flujo: 'av' },
  { nombre: 'Las aurículas aprietan', texto: 'Una chispa eléctrica, el marcapasos natural del corazón, hace que las aurículas se aprieten y terminen de llenar los ventrículos.', aur: true, ven: false, av: true, sl: false, flujo: 'av', chispa: 'sa' },
  { nombre: '"Lub": se cierran las puertas', texto: 'La chispa llega a los ventrículos y empiezan a apretar. Las puertas entre aurículas y ventrículos (válvulas) se cierran de golpe: es el primer sonido, "lub".', aur: false, ven: true, av: false, sl: false, flujo: null, chispa: 'av', ruido: 'lub' },
  { nombre: 'Sale la sangre', texto: 'Los ventrículos aprietan fuerte, se abren las puertas de salida y la sangre sale: el lado azul la manda a los pulmones y el rojo a todo el cuerpo.', aur: false, ven: true, av: false, sl: true, flujo: 'sl' },
  { nombre: '"Dub": se relaja', texto: 'Los ventrículos se relajan y las puertas de salida se cierran: es el segundo sonido, "dub". Y todo vuelve a empezar, unas 70 veces por minuto.', aur: false, ven: false, av: false, sl: false, flujo: null, ruido: 'dub' },
]

const AZUL = '#4a6aa5', ROJO = '#c0443b'
const CORAZON = 'M180 228 C166 196 112 194 110 238 C108 276 150 306 180 334 C210 306 252 276 250 238 C248 194 194 196 180 228 Z'
const CAV = {
  ad: { x: 0, y: 0, w: 180, h: 262, c: [146, 240], color: AZUL },
  ai: { x: 180, y: 0, w: 180, h: 262, c: [214, 240], color: ROJO },
  vd: { x: 0, y: 262, w: 180, h: 120, c: [152, 290], color: AZUL },
  vi: { x: 180, y: 262, w: 180, h: 120, c: [208, 290], color: ROJO },
} as const

function Valvula({ x, y, abierta }: { x: number; y: number; abierta: boolean }) {
  const a = abierta ? 60 : 0
  return (
    <g transform={`translate(${x} ${y})`}>
      <line x1={-12} y1={0} x2={-1} y2={0} stroke="#fff7e8" strokeWidth={3.2} strokeLinecap="round" transform={`rotate(${a} -12 0)`} style={{ transition: 'transform .3s' }} />
      <line x1={12} y1={0} x2={1} y2={0} stroke="#fff7e8" strokeWidth={3.2} strokeLinecap="round" transform={`rotate(${-a} 12 0)`} style={{ transition: 'transform .3s' }} />
    </g>
  )
}

export function CicloCardiaco() {
  const reducido = useMovimientoReducido()
  const [f, setF] = useState(0)
  const [auto, setAuto] = useState(!reducido)
  useEffect(() => {
    if (!auto) return
    const t = setInterval(() => setF((x) => (x + 1) % FASES.length), 2400)
    return () => clearInterval(t)
  }, [auto])
  const fase = FASES[f]
  const aprieta = (id: keyof typeof CAV) => (id === 'ad' || id === 'ai' ? fase.aur : fase.ven)

  return (
    <figure className="tarjeta p-3">
      <svg viewBox="0 0 360 300" className="w-full h-auto" role="img" aria-labelledby="cc-t cc-d">
        <title id="cc-t">El corazón latiendo</title>
        <desc id="cc-d">{fase.nombre}. {fase.texto}</desc>
        <defs>
          <marker id="fl" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M0 0L10 5L0 10z" fill="#fff" /></marker>
          {Object.entries(CAV).map(([id, q]) => <clipPath key={id} id={`cv-${id}`}><rect x={q.x} y={q.y} width={q.w} height={q.h} /></clipPath>)}
          <filter id="chispa"><feGaussianBlur stdDeviation="2.5" /></filter>
        </defs>
        <g transform="translate(-90 -226) scale(1.5)">
          {/* Arterias de salida */}
          <path d="M150 210 C148 190 140 178 128 168" fill="none" stroke={AZUL} strokeWidth="14" strokeLinecap="round" />
          <path d="M210 210 C210 180 236 166 252 186" fill="none" stroke={ROJO} strokeWidth="15" strokeLinecap="round" />
          <text x="92" y="160" fontSize="8" fill="#24302a">a los pulmones</text>
          <text x="236" y="204" fontSize="8" fill="#24302a">al cuerpo</text>
          {/* Cavidades */}
          {(Object.keys(CAV) as (keyof typeof CAV)[]).map((id) => {
            const q = CAV[id], ap = aprieta(id)
            return (
              <g key={id} clipPath={`url(#cv-${id})`}>
                <g style={{ transformOrigin: `${q.c[0]}px ${q.c[1]}px`, transform: `scale(${ap ? 0.9 : 1})`, transition: 'transform .3s' }}>
                  <path d={CORAZON} fill={q.color} opacity={ap ? 1 : 0.78} />
                </g>
              </g>
            )
          })}
          <path d={CORAZON} fill="none" stroke="#7a2e29" strokeWidth="2" />
          <path d="M180 230 V330" stroke="#7a2e29" strokeWidth="3" />
          {/* Válvulas: entre aurículas y ventrículos, y de salida */}
          <Valvula x={146} y={262} abierta={fase.av} />
          <Valvula x={214} y={262} abierta={fase.av} />
          <Valvula x={150} y={212} abierta={fase.sl} />
          <Valvula x={210} y={212} abierta={fase.sl} />
          <g fontSize="7.5" fill="#fff" textAnchor="middle" fontWeight="600">
            <text x="142" y="244">Aurícula</text><text x="218" y="244">Aurícula</text>
            <text x="157" y="296">Ventrículo</text><text x="203" y="296">Ventrículo</text>
          </g>
          {/* Flujo de sangre */}
          {fase.flujo === 'av' && <><path d="M146 246 v30" stroke="#fff" strokeWidth="2.5" markerEnd="url(#fl)" /><path d="M214 246 v30" stroke="#fff" strokeWidth="2.5" markerEnd="url(#fl)" /></>}
          {fase.flujo === 'sl' && <><path d="M148 205 C146 192 140 184 132 176" stroke="#fff" strokeWidth="2.5" fill="none" markerEnd="url(#fl)" /><path d="M211 205 C212 186 228 176 244 182" stroke="#fff" strokeWidth="2.5" fill="none" markerEnd="url(#fl)" /></>}
          {/* Chispa eléctrica */}
          {fase.chispa === 'sa' && <g><circle cx="126" cy="226" r="7" fill="#ffd34d" filter="url(#chispa)" /><circle cx="126" cy="226" r="3" fill="#fff6c9" /></g>}
          {fase.chispa === 'av' && <g><circle cx="176" cy="262" r="7" fill="#ffd34d" filter="url(#chispa)" /><circle cx="176" cy="262" r="3" fill="#fff6c9" /><path d="M176 268 V318" stroke="#ffd34d" strokeWidth="2" strokeDasharray="3 3" /></g>}
        </g>
        {fase.ruido && <text x="305" y="262" textAnchor="middle" fontSize="20" fontWeight="700" fill="#8a6d4b">♪ {fase.ruido}</text>}
      </svg>
      <figcaption>
        <p className="font-semibold text-verde-900">{f + 1}. {fase.nombre}</p>
        <p className="text-sm mt-1 min-h-16" aria-live="polite">{fase.texto}</p>
        <div className="flex gap-2 mt-2">
          <button className="btn btn-secundario flex-1" onClick={() => { setAuto(false); setF((f + FASES.length - 1) % FASES.length) }}>Anterior</button>
          <button className="btn btn-secundario" onClick={() => setAuto(!auto)} aria-label={auto ? 'Pausar animación' : 'Reproducir animación'}>{auto ? <IcoPausa /> : <IcoPlay />}</button>
          <button className="btn btn-secundario flex-1" onClick={() => { setAuto(false); setF((f + 1) % FASES.length) }}>Siguiente</button>
        </div>
        <p className="text-xs text-suave mt-2">Visto de frente: el lado derecho del corazón (azul) aparece a la izquierda. Esquema simplificado. Fuente: OpenStax A&P 2e, 19.2 y 19.3.</p>
      </figcaption>
    </figure>
  )
}
