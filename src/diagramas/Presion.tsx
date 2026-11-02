import { useEffect, useRef, useState } from 'react'
import { useMovimientoReducido } from './usarMovimiento'

// Modelo didáctico simplificado: presión ≈ bombeo × resistencia, y la resistencia
// crece mucho cuando el vaso se estrecha (proporcional a 1/radio⁴). Fuente: OpenStax A&P 2e, 20.2 (F65).
const CORAZON = 'M0 -6 C-4 -16 -20 -16 -20 -2 C-20 10 -6 18 0 26 C6 18 20 10 20 -2 C20 -16 4 -16 0 -6 Z'
const N = 14

export function Presion() {
  const reducido = useMovimientoReducido()
  const [bombeo, setBombeo] = useState(5)
  const [placa, setPlaca] = useState(0) // 0 = arteria limpia, 30 = muy estrecha (% del radio)
  const [t, setT] = useState(0)
  const ref = useRef(0)
  const r = 1 - placa / 100
  const presion = Math.round(100 * (bombeo / 5) / r ** 4)
  const color = presion > 160 ? '#b0413e' : presion > 120 ? '#c88a2c' : '#2f6b45'
  const estado = presion > 160 ? 'Muy alta' : presion > 120 ? 'Alta' : 'Normal'
  const ang = -90 + (Math.min(Math.max(presion, 50), 250) - 50) / 200 * 180

  useEffect(() => {
    if (reducido) return
    let ult = performance.now()
    const paso = (ahora: number) => { setT((x) => x + (ahora - ult) / 1000); ult = ahora; ref.current = requestAnimationFrame(paso) }
    ref.current = requestAnimationFrame(paso)
    return () => cancelAnimationFrame(ref.current)
  }, [reducido])

  const latidosPorSeg = bombeo / 5 * 1.2
  const latido = reducido ? 1 : 1 + 0.12 * Math.max(0, Math.sin(t * latidosPorSeg * Math.PI * 2))
  // Alto interior de la arteria: 44 px limpia; la placa lo reduce en el centro (x 150-230)
  const hueco = 44 * (1 - placa / 100 * 2.2) // el dibujo exagera el estrechamiento para que se vea
  const globulos = Array.from({ length: N }, (_, i) => {
    const x = ((t * 40 * bombeo / 5 + i * (260 / N)) % 260) + 60
    const enPlaca = x > 140 && x < 240
    const dy = ((i * 53) % 5 - 2) / 2 * (enPlaca ? Math.max(hueco / 2 - 6, 0) : 14)
    return { x, y: 70 + dy }
  })

  return (
    <figure className="tarjeta p-3">
      <svg viewBox="0 0 360 170" className="w-full h-auto" role="img" aria-label={`Arteria con placa del ${placa}% y presión ${estado.toLowerCase()} (${presion} en escala relativa)`}>
        <defs>
          <linearGradient id="pr-pared" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e8a093" /><stop offset=".5" stopColor="#c8574a" /><stop offset="1" stopColor="#8e3329" />
          </linearGradient>
          <radialGradient id="pr-gr" cx=".4" cy=".4"><stop offset="0" stopColor="#ef7a6b" /><stop offset=".7" stopColor="#c0392b" /><stop offset="1" stopColor="#8e2a20" /></radialGradient>
          <clipPath id="pr-luz"><path d={`M56 48 H140 C170 48 165 ${70 - hueco / 2} 190 ${70 - hueco / 2} C215 ${70 - hueco / 2} 210 48 240 48 H330 V92 H240 C210 92 215 ${70 + hueco / 2} 190 ${70 + hueco / 2} C165 ${70 + hueco / 2} 170 92 140 92 H56 Z`} /></clipPath>
        </defs>
        {/* Corazón que late a la izquierda */}
        <g transform={`translate(30 66) scale(${latido})`}><path d={CORAZON} fill="#c0392b" stroke="#7a2e29" strokeWidth="1.5" /></g>
        <text x="30" y="108" textAnchor="middle" fontSize="9" fill="#5b4a3a">corazón</text>
        {/* Arteria: pared gruesa */}
        <rect x="52" y="38" width="282" height="64" rx="10" fill="url(#pr-pared)" />
        <g clipPath="url(#pr-luz)">
          <rect x="52" y="44" width="282" height="52" fill="#fbe1da" />
          {globulos.map((g, i) => <g key={i} transform={`translate(${g.x} ${g.y})`}><ellipse rx="7" ry="5" fill="url(#pr-gr)" /></g>)}
        </g>
        {/* Placa amarilla (grasa) */}
        {placa > 0 && <>
          <path d={`M140 48 C170 48 165 ${70 - hueco / 2} 190 ${70 - hueco / 2} C215 ${70 - hueco / 2} 210 48 240 48 Z`} fill="#f2d16b" stroke="#c9a23a" />
          <path d={`M140 92 C170 92 165 ${70 + hueco / 2} 190 ${70 + hueco / 2} C215 ${70 + hueco / 2} 210 92 240 92 Z`} fill="#f2d16b" stroke="#c9a23a" />
          <text x="190" y="30" textAnchor="middle" fontSize="9" fill="#8a6d1f">placa de grasa</text>
        </>}
        <text x="300" y="30" textAnchor="middle" fontSize="9" fill="#5b4a3a">arteria</text>
        {/* Manómetro */}
        <g transform="translate(180 140)">
          <path d="M-28 0 A28 28 0 0 1 28 0 Z" fill="#fffaf2" stroke="#8a6d4b" strokeWidth="2" />
          <path d="M-22 0 A22 22 0 0 1 -10 -19.6" stroke="#2f6b45" strokeWidth="5" fill="none" />
          <path d="M-10 -19.6 A22 22 0 0 1 3.4 -21.7" stroke="#c88a2c" strokeWidth="5" fill="none" />
          <path d="M3.4 -21.7 A22 22 0 0 1 22 0" stroke="#b0413e" strokeWidth="5" fill="none" />
          <line x1="0" y1="0" x2="0" y2="-20" stroke="#24302a" strokeWidth="2.5" strokeLinecap="round" style={{ transform: `rotate(${ang}deg)`, transition: 'transform .4s' }} />
          <circle r="3" fill="#24302a" />
        </g>
        <text x="222" y="140" fontSize="11" fontWeight="700" fill={color}>Presión: {estado.toLowerCase()}</text>
      </svg>
      <label className="block mt-2">
        <span className="text-sm font-semibold">Fuerza del bombeo del corazón</span>
        <input type="range" min={3} max={8} step={0.5} value={bombeo} onChange={(e) => setBombeo(Number(e.target.value))} className="w-full accent-verde-700 min-h-11" aria-label="Fuerza del bombeo" />
      </label>
      <label className="block">
        <span className="text-sm font-semibold">Placa de grasa dentro de la arteria</span>
        <input type="range" min={0} max={30} step={5} value={placa} onChange={(e) => setPlaca(Number(e.target.value))} className="w-full accent-verde-700 min-h-11" aria-label="Cantidad de placa" />
      </label>
      <figcaption className="text-sm mt-1">
        Mueve la placa: aunque la arteria se cierre solo un poco, la presión sube mucho, porque la sangre tiene que pasar por un hueco más estrecho.
        <span className="block text-xs text-suave mt-1">Modelo simplificado: el reloj muestra una escala relativa, no mmHg reales. Fuente: OpenStax A&P 2e, 20.2.</span>
      </figcaption>
    </figure>
  )
}
