import { useEffect, useState } from 'react'
import { useMovimientoReducido } from './usarMovimiento'
import { IcoPausa, IcoPlay } from '../components/Iconos'

type Fase = { nombre: string; texto: string; auriculas: boolean; ventriculos: boolean; av: boolean; sl: boolean; flujo: 'av' | 'sl' | null; ruido?: string }
// Fuente: OpenStax A&P 2e, 19.3 Cardiac Cycle (F62)
const FASES: Fase[] = [
  { nombre: 'Diástole: llenado', texto: 'Todo está relajado. La sangre pasa sola de las aurículas a los ventrículos y llena un 70-80% de su capacidad.', auriculas: false, ventriculos: false, av: true, sl: false, flujo: 'av' },
  { nombre: 'Sístole auricular', texto: 'Las aurículas se contraen y empujan el 20-30% restante hacia los ventrículos.', auriculas: true, ventriculos: false, av: true, sl: false, flujo: 'av' },
  { nombre: 'Inicio de la sístole ventricular', texto: 'Los ventrículos se contraen. Sube la presión y se cierran la tricúspide y la mitral: primer ruido, "lub".', auriculas: false, ventriculos: true, av: false, sl: false, flujo: null, ruido: 'lub' },
  { nombre: 'Eyección', texto: 'La presión supera la de las arterias: se abren la pulmonar y la aórtica, y sale la sangre (unos 70-80 mL).', auriculas: false, ventriculos: true, av: false, sl: true, flujo: 'sl' },
  { nombre: 'Inicio de la diástole', texto: 'Los ventrículos se relajan y se cierran la pulmonar y la aórtica: segundo ruido, "dub". Luego vuelve el llenado.', auriculas: false, ventriculos: false, av: false, sl: false, flujo: null, ruido: 'dub' },
]

function Valvula({ x, y, abierta, vertical = false, etiqueta }: { x: number; y: number; abierta: boolean; vertical?: boolean; etiqueta: string }) {
  const d = 16
  const a = abierta ? 55 : 0
  const rot = vertical ? 90 : 0
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`} aria-label={`${etiqueta}: ${abierta ? 'abierta' : 'cerrada'}`}>
      <line x1={-d} y1={0} x2={-2} y2={0} stroke="#1f3d2b" strokeWidth={4} strokeLinecap="round" transform={`rotate(${a} ${-d} 0)`} style={{ transition: 'transform .35s' }} />
      <line x1={d} y1={0} x2={2} y2={0} stroke="#1f3d2b" strokeWidth={4} strokeLinecap="round" transform={`rotate(${-a} ${d} 0)`} style={{ transition: 'transform .35s' }} />
    </g>
  )
}

export function CicloCardiaco() {
  const reducido = useMovimientoReducido()
  const [f, setF] = useState(0)
  const [auto, setAuto] = useState(!reducido)
  useEffect(() => {
    if (!auto) return
    const t = setInterval(() => setF((x) => (x + 1) % FASES.length), 2600)
    return () => clearInterval(t)
  }, [auto])
  const fase = FASES[f]
  const rojo = '#b5473f', azul = '#4a6aa5'
  const esc = (c: boolean) => (c ? 0.94 : 1)
  return (
    <figure className="tarjeta p-3">
      <svg viewBox="0 0 320 260" className="w-full h-auto" role="img" aria-labelledby="cc-t cc-d">
        <title id="cc-t">Ciclo cardiaco</title>
        <desc id="cc-d">{fase.nombre}. {fase.texto}</desc>
        {/* Arterias de salida */}
        <rect x="83" y="6" width="44" height="40" rx="8" fill={azul} opacity=".85" />
        <text x="105" y="30" textAnchor="middle" fontSize="8.5" fill="#fff">T. pulm.</text>
        <rect x="193" y="6" width="44" height="40" rx="8" fill={rojo} opacity=".85" />
        <text x="215" y="30" textAnchor="middle" fontSize="9" fill="#fff">Aorta</text>
        {/* Aurículas */}
        <g style={{ transformOrigin: '90px 90px', transform: `scale(${esc(fase.auriculas)})`, transition: 'transform .35s' }}>
          <rect x="30" y="58" width="120" height="62" rx="18" fill={azul} opacity={fase.auriculas ? 1 : 0.7} />
          <text x="90" y="94" textAnchor="middle" fontSize="12" fill="#fff">Aurícula der.</text>
        </g>
        <g style={{ transformOrigin: '230px 90px', transform: `scale(${esc(fase.auriculas)})`, transition: 'transform .35s' }}>
          <rect x="170" y="58" width="120" height="62" rx="18" fill={rojo} opacity={fase.auriculas ? 1 : 0.7} />
          <text x="230" y="94" textAnchor="middle" fontSize="12" fill="#fff">Aurícula izq.</text>
        </g>
        {/* Ventrículos */}
        <g style={{ transformOrigin: '90px 185px', transform: `scale(${esc(fase.ventriculos)})`, transition: 'transform .35s' }}>
          <path d="M30 138 h120 v40 q0 60 -60 70 q-60 -10 -60 -70z" fill={azul} opacity={fase.ventriculos ? 1 : 0.7} />
          <text x="90" y="185" textAnchor="middle" fontSize="12" fill="#fff">Ventrículo der.</text>
        </g>
        <g style={{ transformOrigin: '230px 185px', transform: `scale(${esc(fase.ventriculos)})`, transition: 'transform .35s' }}>
          <path d="M170 138 h120 v40 q0 60 -60 70 q-60 -10 -60 -70z" fill={rojo} opacity={fase.ventriculos ? 1 : 0.7} />
          <text x="230" y="185" textAnchor="middle" fontSize="12" fill="#fff">Ventrículo izq.</text>
        </g>
        {/* Válvulas */}
        <Valvula x={90} y={129} abierta={fase.av} etiqueta="Tricúspide" />
        <Valvula x={230} y={129} abierta={fase.av} etiqueta="Mitral" />
        <Valvula x={105} y={52} abierta={fase.sl} etiqueta="Pulmonar" />
        <Valvula x={215} y={52} abierta={fase.sl} etiqueta="Aórtica" />
        <text x="16" y="133" fontSize="9" fill="#5b665f">Tricúspide</text>
        <text x="258" y="133" fontSize="9" fill="#5b665f">Mitral</text>
        {/* Flujo */}
        {fase.flujo === 'av' && (<><path d="M90 112 v34" stroke="#fff" strokeWidth="3" markerEnd="url(#fl)" /><path d="M230 112 v34" stroke="#fff" strokeWidth="3" markerEnd="url(#fl)" /></>)}
        {fase.flujo === 'sl' && (<><path d="M105 64 v-26" stroke="#fff" strokeWidth="3" markerEnd="url(#fl)" /><path d="M215 64 v-26" stroke="#fff" strokeWidth="3" markerEnd="url(#fl)" /></>)}
        {fase.ruido && <text x="160" y="250" textAnchor="middle" fontSize="16" fontWeight="700" fill="#8a6d4b">♪ {fase.ruido}</text>}
        <defs><marker id="fl" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="#fff" /></marker></defs>
      </svg>
      <figcaption>
        <p className="font-semibold text-verde-900">{f + 1}. {fase.nombre}</p>
        <p className="text-sm mt-1 min-h-16" aria-live="polite">{fase.texto}</p>
        <div className="flex gap-2 mt-2">
          <button className="btn btn-secundario flex-1" onClick={() => { setAuto(false); setF((f + FASES.length - 1) % FASES.length) }}>Anterior</button>
          <button className="btn btn-secundario" onClick={() => setAuto(!auto)} aria-label={auto ? 'Pausar animación' : 'Reproducir animación'}>{auto ? <IcoPausa /> : <IcoPlay />}</button>
          <button className="btn btn-secundario flex-1" onClick={() => { setAuto(false); setF((f + 1) % FASES.length) }}>Siguiente</button>
        </div>
        <p className="text-xs text-suave mt-2">Esquema simplificado (vista de frente: el lado derecho del corazón aparece a la izquierda). Fuente: OpenStax A&P 2e, 19.3.</p>
      </figcaption>
    </figure>
  )
}
