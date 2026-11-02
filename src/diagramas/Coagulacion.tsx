import { useEffect, useRef, useState } from 'react'
import { useMovimientoReducido } from './usarMovimiento'

// Hemostasia en 3 pasos. Fuente: OpenStax A&P 2e, 18.5 Hemostasis (F68).
const PASOS = [
  { t: 'Se rompe el vaso', d: 'Un corte rompe la pared del vaso y la sangre empieza a salir.' },
  { t: '1. El vaso se aprieta', d: 'La pared del vaso se contrae para que salga menos sangre.' },
  { t: '2. Llegan las plaquetas', d: 'Las plaquetas (en amarillo) se pegan a la herida, cambian de forma y llaman a más plaquetas: forman un tapón.' },
  { t: '3. Se teje una red', d: 'Unos hilos llamados fibrina forman una red que atrapa glóbulos rojos y plaquetas. El tapón queda firme: eso es el coágulo.' },
]
const N = 12
const HX = 180 // centro de la herida

export function Coagulacion() {
  const reducido = useMovimientoReducido()
  const [p, setP] = useState(0)
  const [t, setT] = useState(0)
  const ref = useRef(0)
  useEffect(() => {
    if (reducido) return
    let ult = performance.now()
    const paso = (ahora: number) => { setT((x) => x + (ahora - ult) / 1000); ult = ahora; ref.current = requestAnimationFrame(paso) }
    ref.current = requestAnimationFrame(paso)
    return () => cancelAnimationFrame(ref.current)
  }, [reducido])

  const tr = reducido ? undefined : 'all .6s ease'
  const medio = p >= 1 ? 26 : 36 // mitad del alto interior; el espasmo lo reduce
  const arriba = 90 - medio
  const vel = p >= 3 ? 18 : p >= 1 ? 30 : 40
  const globulos = Array.from({ length: N }, (_, i) => ({ x: ((t * vel + i * (380 / N)) % 380) - 20, y: 90 + (((i * 37) % 5) - 2) * (medio / 3.2) }))
  // Gotas que salen por la herida mientras no hay tapón
  const gotas = p < 2 ? [0, 1, 2].map((i) => { const f = (t * 0.8 + i / 3) % 1; return { x: HX + (i - 1) * 6, y: arriba - 8 - f * 26, o: 1 - f } }) : []
  const plaquetas = [-16, -9, -2, 5, 12, 19, -12, 0, 12].map((dx, i) => ({ x: HX + dx - 2, y: arriba - (i > 5 ? 9 : 3) }))

  return (
    <figure className="tarjeta p-3">
      <svg viewBox="80 8 200 146" className="w-full h-auto" role="img" aria-label={`${PASOS[p].t}: ${PASOS[p].d}`}>
        <defs>
          <linearGradient id="co-pared" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e8a093" /><stop offset="1" stopColor="#b85b4d" /></linearGradient>
          <radialGradient id="co-gr" cx=".4" cy=".4"><stop offset="0" stopColor="#ef7a6b" /><stop offset=".7" stopColor="#c0392b" /><stop offset="1" stopColor="#8e2a20" /></radialGradient>
          <radialGradient id="co-pl" cx=".4" cy=".4"><stop offset="0" stopColor="#ffe9a3" /><stop offset="1" stopColor="#d9a441" /></radialGradient>
        </defs>
        <rect width="360" height="170" fill="#f6ecdf" />
        <text x="86" y="32" fontSize="7" fill="#8a6d4b">tejido</text>
        {/* Pared del vaso con la herida */}
        <path d={`M0 ${arriba - 12} H${HX - 14} V${arriba} H0 Z M${HX + 14} ${arriba - 12} H360 V${arriba} H${HX + 14} Z`} fill="url(#co-pared)" style={{ transition: tr }} />
        <rect x="0" y={90 + medio} width="360" height="12" fill="url(#co-pared)" style={{ transition: tr }} />
        <rect x="0" y={arriba} width="360" height={medio * 2} fill="#fbe1da" style={{ transition: tr }} />
        {/* Glóbulos rojos fluyendo */}
        {globulos.map((g, i) => <g key={i} transform={`translate(${g.x} ${g.y})`}><ellipse rx="8" ry="5.5" fill="url(#co-gr)" /><ellipse rx="3.5" ry="2" fill="#a8322a" opacity=".5" /></g>)}
        {/* Sangre que sale */}
        {gotas.map((g, i) => <ellipse key={i} cx={g.x} cy={g.y} rx="5" ry="4" fill="#c0392b" opacity={g.o * (p === 1 ? 0.5 : 1)} />)}
        {/* Plaquetas: lisas al llegar, con "patitas" al activarse */}
        <g opacity={p >= 2 ? 1 : 0} style={{ transition: tr }}>
          {plaquetas.map((q, i) => (
            <g key={i} transform={`translate(${q.x} ${q.y})`}>
              {[0, 60, 120, 180, 240, 300].map((a) => <line key={a} x1="0" y1="0" x2="6" y2="0" stroke="#c9952e" strokeWidth="1.2" transform={`rotate(${a + i * 17})`} />)}
              <circle r="3.6" fill="url(#co-pl)" stroke="#a87a22" strokeWidth=".8" />
            </g>
          ))}
        </g>
        {/* Red de fibrina con glóbulos atrapados */}
        <g opacity={p >= 3 ? 1 : 0} style={{ transition: tr }}>
          <ellipse cx={HX - 6} cy={arriba - 6} rx="6" ry="4" fill="url(#co-gr)" />
          <ellipse cx={HX + 8} cy={arriba - 10} rx="6" ry="4" fill="url(#co-gr)" />
          <path d={`M${HX - 26} ${arriba - 18} Q${HX} ${arriba + 2} ${HX + 26} ${arriba - 16} M${HX - 24} ${arriba - 2} Q${HX} ${arriba - 24} ${HX + 26} ${arriba - 2} M${HX - 18} ${arriba - 22} Q${HX - 4} ${arriba - 6} ${HX + 4} ${arriba + 2} M${HX + 18} ${arriba - 22} Q${HX + 4} ${arriba - 8} ${HX - 6} ${arriba + 2} M${HX - 28} ${arriba - 10} H${HX + 28}`}
            stroke="#f4f0e6" strokeWidth="1.6" fill="none" />
          <path d={`M${HX - 26} ${arriba - 18} Q${HX} ${arriba + 2} ${HX + 26} ${arriba - 16} M${HX - 24} ${arriba - 2} Q${HX} ${arriba - 24} ${HX + 26} ${arriba - 2} M${HX - 28} ${arriba - 10} H${HX + 28}`}
            stroke="#8a6d4b" strokeWidth=".6" fill="none" />
        </g>
        <text x={HX} y={arriba - 36} textAnchor="middle" fontSize="8" fontWeight="600" fill="#7a2e29">{p === 0 ? 'herida' : p === 3 ? 'coágulo' : p === 2 ? 'tapón de plaquetas' : ''}</text>
        <text x="86" y="150" fontSize="7" fill="#5b4a3a">{p >= 1 ? 'vaso apretado: pasa menos sangre' : 'vaso sanguíneo'}</text>
      </svg>
      <div className="flex gap-2 mt-2">
        <button onClick={() => setP(Math.max(0, p - 1))} disabled={p === 0} className="flex-1 min-h-11 rounded-xl border border-[#dcdccf] bg-white font-semibold disabled:opacity-40">Anterior</button>
        <button onClick={() => setP(Math.min(PASOS.length - 1, p + 1))} disabled={p === PASOS.length - 1} className="flex-1 min-h-11 rounded-xl btn-primario font-semibold disabled:opacity-40">Siguiente</button>
      </div>
      <p className="mt-3" aria-live="polite"><strong>{PASOS[p].t}.</strong> {PASOS[p].d}</p>
      <figcaption className="text-xs text-suave mt-2">Esquema didáctico simplificado. Fuente: OpenStax A&P 2e, 18.5.</figcaption>
    </figure>
  )
}
