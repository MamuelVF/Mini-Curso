import { useState } from 'react'

// Modelo didáctico simplificado: presión ≈ caudal × resistencia, y la resistencia
// crece mucho cuando el vaso se estrecha (proporcional a 1/radio⁴). Fuente: OpenStax A&P 2e, 20.2 (F65).
export function Presion() {
  const [caudal, setCaudal] = useState(5)
  const [radio, setRadio] = useState(100)
  const r = radio / 100
  const resistencia = 1 / r ** 4
  const presion = Math.round(100 * (caudal / 5) * resistencia)
  const nivel = Math.min(presion, 300)
  const color = presion > 160 ? '#9a3b2e' : presion > 120 ? '#8a6d4b' : '#2f6b45'
  return (
    <figure className="tarjeta p-4">
      <svg viewBox="0 0 320 120" className="w-full h-auto" role="img" aria-label={`Vaso con radio al ${radio}% y presión relativa ${presion}`}>
        <rect x="10" y={60 - 34 * r} width="230" height={68 * r} rx={30 * r} fill="#c9a6a6" />
        <rect x="10" y={60 - 34 * r} width="230" height={68 * r} rx={30 * r} fill="none" stroke="#8a4b45" strokeWidth="3" />
        {[40, 110, 180].map((x) => <path key={x} d={`M${x} 60 h30`} stroke="#fff" strokeWidth="3" markerEnd="url(#fp)" />)}
        <rect x="262" y="10" width="40" height="100" rx="8" fill="#eef3ea" stroke="#dcdccf" />
        <rect x="262" y={110 - nivel / 3} width="40" height={nivel / 3} rx="8" fill={color} />
        <defs><marker id="fp" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="#fff" /></marker></defs>
      </svg>
      <p className="mt-2 text-center"><span className="text-sm text-suave">Presión relativa</span><br /><span className="text-3xl font-serif font-semibold" style={{ color }}>{presion}</span></p>
      <label className="block mt-3">
        <span className="text-sm font-semibold">Bombeo del corazón (gasto cardiaco): {caudal} L/min</span>
        <input type="range" min={3} max={8} step={0.5} value={caudal} onChange={(e) => setCaudal(Number(e.target.value))} className="w-full accent-verde-700 min-h-11" />
      </label>
      <label className="block mt-1">
        <span className="text-sm font-semibold">Ancho del vaso: {radio}%</span>
        <input type="range" min={70} max={110} step={5} value={radio} onChange={(e) => setRadio(Number(e.target.value))} className="w-full accent-verde-700 min-h-11" />
      </label>
      <figcaption className="text-sm mt-2">
        Fíjese: estrechar el vaso solo un 20% casi duplica la presión (porque la resistencia depende del radio a la cuarta potencia).
        <span className="block text-xs text-suave mt-1">Modelo simplificado con valores relativos (100 = normal); no son mmHg reales. Fuente: OpenStax A&P 2e, 20.2.</span>
      </figcaption>
    </figure>
  )
}
