import { useEffect, useRef, useState } from 'react'
import { useMovimientoReducido } from './usarMovimiento'
import { IcoPausa, IcoPlay } from '../components/Iconos'

// Fuente: OpenStax A&P 2e, 19.1 (F60). Esquema didáctico: una válvula vista de lado dentro de un vaso.
type Modo = 'empuja' | 'regresa'
const TEXTO: Record<Modo, { titulo: string; texto: string }> = {
  empuja: { titulo: 'El corazón empuja: la puerta se abre', texto: 'La sangre empuja hacia adelante, las hojitas de la válvula se doblan y la sangre pasa.' },
  regresa: { titulo: 'La sangre intenta volver: la puerta se cierra', texto: 'Cuando la sangre quiere regresar, llena las hojitas como un paracaídas, se juntan y cierran el paso. Así la sangre solo va en un sentido.' },
}
const N = 9

export function Valvula() {
  const reducido = useMovimientoReducido()
  const [modo, setModo] = useState<Modo>('empuja')
  const [auto, setAuto] = useState(!reducido)
  const [t, setT] = useState(0)
  const ref = useRef<number>(0)

  useEffect(() => {
    if (!auto) return
    const i = setInterval(() => setModo((m) => (m === 'empuja' ? 'regresa' : 'empuja')), 3000)
    return () => clearInterval(i)
  }, [auto])

  useEffect(() => {
    if (reducido) return
    let ult = performance.now()
    const paso = (ahora: number) => {
      setT((x) => x + (ahora - ult) / 1000)
      ult = ahora
      ref.current = requestAnimationFrame(paso)
    }
    ref.current = requestAnimationFrame(paso)
    return () => cancelAnimationFrame(ref.current)
  }, [reducido])

  const abierta = modo === 'empuja'
  // Posición de cada glóbulo: si la puerta está abierta avanzan de izquierda a derecha;
  // si está cerrada, los de la derecha se acercan a la puerta y rebotan en ella.
  const globulos = Array.from({ length: N }, (_, i) => {
    const fase = (t * 0.35 + i / N) % 1
    const y = 70 + ((i * 37) % 3 - 1) * 14
    if (abierta) return { x: 20 + fase * 320, y }
    const lejos = 340 - fase * 150 // se acercan desde la derecha
    return { x: Math.max(lejos, 196 + (i % 3) * 14), y }
  })
  const ang = abierta ? 62 : 0

  return (
    <figure className="tarjeta p-3">
      <svg viewBox="0 0 360 150" className="w-full h-auto" role="img" aria-labelledby="va-t va-d">
        <title id="va-t">Una válvula del corazón: puerta de un solo sentido</title>
        <desc id="va-d">{TEXTO[modo].titulo}. {TEXTO[modo].texto}</desc>
        <defs>
          <linearGradient id="va-pared" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#d98b7c" /><stop offset="1" stopColor="#b85b4d" />
          </linearGradient>
          <radialGradient id="va-gr" cx="0.4" cy="0.4"><stop offset="0" stopColor="#e86a5c" /><stop offset="0.6" stopColor="#c0392b" /><stop offset="1" stopColor="#8e2a20" /></radialGradient>
        </defs>
        {/* Vaso */}
        <rect x="0" y="22" width="360" height="96" rx="8" fill="#fbe9e4" />
        <rect x="0" y="12" width="360" height="12" rx="4" fill="url(#va-pared)" />
        <rect x="0" y="116" width="360" height="12" rx="4" fill="url(#va-pared)" />
        {/* Glóbulos rojos */}
        {globulos.map((g, i) => (
          <g key={i} transform={`translate(${g.x} ${g.y})`}>
            <ellipse rx="9" ry="7" fill="url(#va-gr)" /><ellipse rx="4" ry="2.6" fill="#a8322a" opacity=".55" />
          </g>
        ))}
        {/* Hojitas de la válvula: bisagra en la pared, giran hacia la derecha al abrirse */}
        <g style={{ transition: 'transform .35s', transformOrigin: '180px 24px', transform: `rotate(${-ang}deg)` }}>
          <path d="M176 24 Q186 48 182 70 L178 70 Q178 48 172 24 Z" fill="#fff7e8" stroke="#8a6d4b" strokeWidth="1.5" />
        </g>
        <g style={{ transition: 'transform .35s', transformOrigin: '180px 116px', transform: `rotate(${ang}deg)` }}>
          <path d="M176 116 Q186 92 182 70 L178 70 Q178 92 172 116 Z" fill="#fff7e8" stroke="#8a6d4b" strokeWidth="1.5" />
        </g>
        {/* Flecha */}
        <g transform={`translate(${abierta ? 270 : 90} 142)`}>
          <path d={abierta ? 'M-30 0 H24 M14 -6 L24 0 L14 6' : 'M30 0 H-24 M-14 -6 L-24 0 L-14 6'} stroke={abierta ? '#2f6b4f' : '#b0413e'} strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
        <text x="180" y="8" textAnchor="middle" fontSize="9" fill="#5b4a3a">válvula</text>
        {!abierta && <text x="120" y="74" textAnchor="middle" fontSize="22" fontWeight="700" fill="#b0413e">✕</text>}
      </svg>
      <figcaption>
        <p className="font-semibold text-verde-900">{TEXTO[modo].titulo}</p>
        <p className="text-sm mt-1 min-h-12" aria-live="polite">{TEXTO[modo].texto}</p>
        <div className="flex gap-2 mt-2">
          <button className="btn btn-secundario flex-1" aria-pressed={modo === 'empuja'} onClick={() => { setAuto(false); setModo('empuja') }}>Empujar</button>
          <button className="btn btn-secundario" onClick={() => setAuto(!auto)} aria-label={auto ? 'Pausar animación' : 'Reproducir animación'}>{auto ? <IcoPausa /> : <IcoPlay />}</button>
          <button className="btn btn-secundario flex-1" aria-pressed={modo === 'regresa'} onClick={() => { setAuto(false); setModo('regresa') }}>Que regrese</button>
        </div>
        <p className="text-xs text-suave mt-2">Esquema simplificado. Fuente: OpenStax A&P 2e, 19.1.</p>
      </figcaption>
    </figure>
  )
}
