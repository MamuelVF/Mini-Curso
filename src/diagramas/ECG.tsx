import { useState } from 'react'
import { useMovimientoReducido } from './usarMovimiento'

// ECG esquemático (no a escala clínica). Ondas: OpenStax A&P 2e, 19.2 (F61, F62).
// Fibrilación auricular: sin ondas P claras y latidos irregulares (AHA, F59).

type Onda = 'P' | 'QRS' | 'T'
const TEXTO: Record<Onda, string> = {
  P: 'Onda P: se activan las aurículas.',
  QRS: 'Complejo QRS: se activan los ventrículos, justo antes de contraerse.',
  T: 'Onda T: los ventrículos se recuperan para el siguiente latido.',
}

function latido(x: number) {
  // P, segmento, QRS, segmento, T
  return `L${x} 60 q8 -10 16 0 l8 0 l4 6 l6 -46 l6 52 l4 -12 l14 0 q12 -16 24 0`
}

function trazoSinusal() {
  let d = 'M0 60'
  for (let i = 0; i < 4; i++) {
    const x = 6 + i * 80
    d += ` ${latido(x)} L${x + 80} 60`
  }
  return d
}

function trazoFA() {
  // línea de base temblorosa sin ondas P + QRS a intervalos irregulares
  const qrs = [22, 70, 98, 168, 232, 262]
  let d = 'M0 60'
  let x = 0
  for (const q of qrs) {
    while (x < q) {
      x += 4
      d += ` L${x} ${60 + (x % 8 === 0 ? -3 : 3)}`
    }
    d += ` l4 6 l6 -46 l6 52 l4 -12`
    x += 20
    d += ` L${x} 60`
  }
  while (x < 320) {
    x += 4
    d += ` L${x} ${60 + (x % 8 === 0 ? -3 : 3)}`
  }
  return d
}

export function ECG() {
  const [modo, setModo] = useState<'sinusal' | 'fa'>('sinusal')
  const [onda, setOnda] = useState<Onda>('QRS')
  const reducido = useMovimientoReducido()
  const sinusal = modo === 'sinusal'
  const zonas: { o: Onda; x: number; w: number }[] = [
    { o: 'P', x: 86, w: 18 },
    { o: 'QRS', x: 110, w: 22 },
    { o: 'T', x: 144, w: 28 },
  ]
  return (
    <figure className="tarjeta p-4">
      <div className="flex gap-2 mb-3" role="group" aria-label="Tipo de ritmo">
        {(['sinusal', 'fa'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setModo(m)}
            aria-pressed={modo === m}
            className={`flex-1 min-h-11 rounded-xl px-3 text-sm font-semibold border ${modo === m ? 'bg-verde-700 text-white border-verde-700' : 'bg-white border-[#dcdccf]'}`}
          >
            {m === 'sinusal' ? 'Ritmo normal' : 'Fibrilación auricular'}
          </button>
        ))}
      </div>
      <svg viewBox="0 0 320 100" className="w-full h-auto rounded-lg" style={{ background: '#fbf3f1' }} role="img"
        aria-label={sinusal ? 'ECG con ritmo normal: onda P, QRS y T repetidos a intervalos iguales' : 'ECG con fibrilación auricular: sin ondas P y latidos irregulares'}>
        <defs>
          <pattern id="cuad" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M10 0H0V10" fill="none" stroke="#f0c9c2" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width="320" height="100" fill="url(#cuad)" />
        {sinusal && zonas.map((z) => (
          <rect key={z.o} x={z.x} y="8" width={z.w} height="84" rx="4"
            fill={onda === z.o ? '#2f5d3f' : 'transparent'} fillOpacity={0.12}
            stroke={onda === z.o ? '#2f5d3f' : 'none'} strokeDasharray="3 3" />
        ))}
        <path key={modo} d={sinusal ? trazoSinusal() : trazoFA()} fill="none" stroke="#24302a" strokeWidth="1.8" strokeLinejoin="round"
          strokeDasharray={reducido ? undefined : 1200} strokeDashoffset={0}
          style={reducido ? undefined : { animation: 'trazo 2.4s linear' }} />
        {sinusal && zonas.map((z) => (
          <text key={z.o} x={z.x + z.w / 2} y="98" textAnchor="middle" fontSize="9" fontWeight="700" fill="#2f5d3f">{z.o}</text>
        ))}
        <style>{'@keyframes trazo{from{stroke-dashoffset:1200}to{stroke-dashoffset:0}}'}</style>
      </svg>
      {sinusal ? (
        <>
          <div className="flex gap-2 mt-3">
            {(['P', 'QRS', 'T'] as Onda[]).map((o) => (
              <button key={o} onClick={() => setOnda(o)} aria-pressed={onda === o}
                className={`flex-1 min-h-11 rounded-xl text-sm font-semibold border ${onda === o ? 'bg-tierra text-white border-tierra' : 'bg-white border-[#dcdccf]'}`}>
                {o}
              </button>
            ))}
          </div>
          <p className="mt-2 text-sm" aria-live="polite">{TEXTO[onda]}</p>
        </>
      ) : (
        <p className="mt-3 text-sm" aria-live="polite">
          No aparecen ondas P claras: las aurículas tiemblan en lugar de contraerse. Los latidos llegan a intervalos irregulares.
          Por eso la sangre puede estancarse y formar coágulos.
        </p>
      )}
      <figcaption className="text-xs text-suave mt-2">
        Esquema didáctico, no a escala clínica. Fuentes: OpenStax A&P 2e, 19.2; AHA, fibrilación auricular.
      </figcaption>
    </figure>
  )
}
