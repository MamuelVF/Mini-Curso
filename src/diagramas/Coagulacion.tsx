import { useState } from 'react'
import { useMovimientoReducido } from './usarMovimiento'

// Hemostasia en 3 pasos. Fuente: OpenStax A&P 2e, 18.5 Hemostasis (F68).
const PASOS = [
  { t: 'Vaso dañado', d: 'Se rompe la pared del vaso y la sangre empieza a salir.' },
  { t: '1. Espasmo vascular', d: 'El músculo liso de la pared se contrae y reduce el flujo de sangre.' },
  { t: '2. Tapón de plaquetas', d: 'Las plaquetas se pegan al tejido expuesto y llaman a más plaquetas.' },
  { t: '3. Coagulación', d: 'Una malla de fibrina atrapa glóbulos rojos y plaquetas: el coágulo queda firme.' },
]

export function Coagulacion() {
  const [p, setP] = useState(0)
  const reducido = useMovimientoReducido()
  const tr = reducido ? undefined : 'all .5s ease'
  const ancho = p >= 1 ? 26 : 40 // espasmo estrecha el vaso
  const y0 = 60 - ancho / 2
  return (
    <figure className="tarjeta p-4">
      <svg viewBox="70 0 180 120" className="w-full h-auto" role="img" aria-label={`${PASOS[p].t}: ${PASOS[p].d}`}>
        <rect x="0" y="0" width="320" height="120" fill="#f3ead9" />
        {/* pared superior e inferior */}
        <rect x="0" y={y0 - 10} width="320" height="10" fill="#c98f86" style={{ transition: tr }} />
        <rect x="0" y={y0 + ancho} width="320" height="10" fill="#c98f86" style={{ transition: tr }} />
        <rect x="0" y={y0} width="320" height={ancho} fill="#e9c4bd" style={{ transition: tr }} />
        {/* herida en la pared superior */}
        <rect x="150" y={y0 - 10} width="22" height="10" fill="#f3ead9" style={{ transition: tr }} />
        {/* glóbulos rojos */}
        {[95, 125, 200, 230].map((x) => <ellipse key={x} cx={x} cy="60" rx="9" ry="5" fill="#a8372c" />)}
        {/* sangre saliendo (solo al inicio) */}
        <g opacity={p === 0 ? 1 : p === 1 ? 0.5 : 0} style={{ transition: tr }}>
          <ellipse cx="161" cy={y0 - 18} rx="7" ry="4" fill="#a8372c" />
          <ellipse cx="168" cy={y0 - 30} rx="6" ry="3.5" fill="#a8372c" />
        </g>
        {/* plaquetas */}
        <g opacity={p >= 2 ? 1 : 0} style={{ transition: tr }}>
          {[148, 156, 164, 172, 152, 168].map((x, i) => <circle key={i} cx={x} cy={y0 - 4 + (i > 3 ? 6 : 0)} r="4" fill="#d9a441" stroke="#8a6d4b" strokeWidth="1" />)}
        </g>
        {/* fibrina */}
        <g opacity={p >= 3 ? 1 : 0} stroke="#5b4a33" strokeWidth="1.2" style={{ transition: tr }}>
          <path d={`M140 ${y0 - 12} L184 ${y0 + 6} M140 ${y0 + 6} L184 ${y0 - 12} M144 ${y0 - 3} H180 M162 ${y0 - 14} V${y0 + 8}`} />
          <ellipse cx="160" cy={y0 + 2} rx="5" ry="3" fill="#a8372c" stroke="none" />
        </g>
        <text x="76" y="114" fontSize="10" fill="#5b4a33">{p >= 1 ? 'Vaso contraído' : 'Vaso normal'}</text>
      </svg>
      <div className="flex gap-2 mt-3">
        <button onClick={() => setP(Math.max(0, p - 1))} disabled={p === 0} className="flex-1 min-h-11 rounded-xl border border-[#dcdccf] bg-white font-semibold disabled:opacity-40">Anterior</button>
        <button onClick={() => setP(Math.min(PASOS.length - 1, p + 1))} disabled={p === PASOS.length - 1} className="flex-1 min-h-11 rounded-xl btn-primario font-semibold disabled:opacity-40">Siguiente</button>
      </div>
      <p className="mt-3" aria-live="polite"><strong>{PASOS[p].t}.</strong> {PASOS[p].d}</p>
      <figcaption className="text-xs text-suave mt-2">Esquema didáctico simplificado. Fuente: OpenStax A&P 2e, 18.5.</figcaption>
    </figure>
  )
}
