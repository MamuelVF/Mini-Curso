import { useEffect, useRef, useState } from 'react'
import { useMovimientoReducido } from './usarMovimiento'
import { IcoPausa, IcoPlay } from '../components/Iconos'

// ECG esquemático (no a escala clínica). Ondas: OpenStax A&P 2e, 19.2 (F61, F62).
// Fibrilación auricular: sin ondas P claras y latidos irregulares (AHA, F59).

type Onda = 'P' | 'QRS' | 'T' | null
const TEXTO: Record<'P' | 'QRS' | 'T', string> = {
  P: 'Onda P: la chispa recorre las aurículas (arriba) y se aprietan.',
  QRS: 'Pico QRS: la chispa llega a los ventrículos (abajo), que aprietan fuerte y sacan la sangre.',
  T: 'Onda T: los ventrículos se "recargan" para el siguiente latido.',
}
const CORAZON = 'M180 228 C166 196 112 194 110 238 C108 276 150 306 180 334 C210 306 252 276 250 238 C248 194 194 196 180 228 Z'
const ANCHO = 320, LATIDO = 80

function latido(x: number) {
  return `L${x} 60 q8 -10 16 0 l8 0 l4 6 l6 -46 l6 52 l4 -12 l14 0 q12 -16 24 0`
}
const SINUSAL = (() => { let d = 'M0 60'; for (let i = 0; i < 4; i++) { const x = 6 + i * LATIDO; d += ` ${latido(x)} L${x + LATIDO} 60` } return d })()
const QRS_FA = [22, 70, 98, 168, 232, 262]
const FA = (() => {
  let d = 'M0 60', x = 0
  for (const q of QRS_FA) {
    while (x < q) { x += 4; d += ` L${x} ${60 + (x % 8 === 0 ? -3 : 3)}` }
    d += ' l4 6 l6 -46 l6 52 l4 -12'; x += 20; d += ` L${x} 60`
  }
  while (x < ANCHO) { x += 4; d += ` L${x} ${60 + (x % 8 === 0 ? -3 : 3)}` }
  return d
})()

function ondaEn(x: number, sinusal: boolean): Onda {
  if (!sinusal) return QRS_FA.some((q) => x >= q && x < q + 20) ? 'QRS' : null
  const r = (((x - 6) % LATIDO) + LATIDO) % LATIDO
  if (r < 16) return 'P'
  if (r >= 24 && r < 44) return 'QRS'
  if (r >= 54 && r < 78) return 'T'
  return null
}

export function ECG() {
  const reducido = useMovimientoReducido()
  const [modo, setModo] = useState<'sinusal' | 'fa'>('sinusal')
  const [auto, setAuto] = useState(!reducido)
  const [x, setX] = useState(130)
  const ref = useRef(0)
  const sinusal = modo === 'sinusal'

  useEffect(() => {
    if (!auto) return
    let ult = performance.now()
    const paso = (ahora: number) => { setX((v) => (v + (ahora - ult) * 0.07) % ANCHO); ult = ahora; ref.current = requestAnimationFrame(paso) }
    ref.current = requestAnimationFrame(paso)
    return () => cancelAnimationFrame(ref.current)
  }, [auto])

  const onda = ondaEn(x, sinusal)
  const aur = sinusal ? onda === 'P' : true
  const ven = onda === 'QRS'
  const recarga = onda === 'T'
  const elegir = (o: 'P' | 'QRS' | 'T') => { setAuto(false); setX(6 + LATIDO + (o === 'P' ? 8 : o === 'QRS' ? 34 : 66)) }

  return (
    <figure className="tarjeta p-3">
      <div className="flex gap-2 mb-3" role="group" aria-label="Tipo de ritmo">
        {(['sinusal', 'fa'] as const).map((m) => (
          <button key={m} onClick={() => setModo(m)} aria-pressed={modo === m}
            className={`flex-1 min-h-11 rounded-xl px-3 text-sm font-semibold border ${modo === m ? 'bg-verde-700 text-white border-verde-700' : 'bg-white border-[#dcdccf]'}`}>
            {m === 'sinusal' ? 'Ritmo normal' : 'Fibrilación auricular'}
          </button>
        ))}
      </div>
      <svg viewBox="0 0 320 250" className="w-full h-auto" role="img"
        aria-label={sinusal ? 'Corazón y electrocardiograma con ritmo normal: onda P, pico QRS y onda T a intervalos iguales' : 'Corazón con aurículas que tiemblan y electrocardiograma sin ondas P y con latidos irregulares'}>
        <defs>
          <clipPath id="ecg-aur"><rect x="0" y="0" width="360" height="262" /></clipPath>
          <clipPath id="ecg-ven"><rect x="0" y="262" width="360" height="120" /></clipPath>
          <filter id="ecg-brillo"><feGaussianBlur stdDeviation="3" /></filter>
          <pattern id="ecg-cuad" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M10 0H0V10" fill="none" stroke="#1f4d36" strokeWidth="0.6" /></pattern>
        </defs>
        {/* Corazón */}
        <g transform="translate(-20 -195) scale(1)">
          <g clipPath="url(#ecg-aur)" className={!sinusal && !reducido ? 'ecg-tiembla' : ''}>
            <path d={CORAZON} fill={aur ? '#e0b44a' : '#d98b7c'} style={{ transition: 'fill .15s' }} />
          </g>
          <g clipPath="url(#ecg-ven)">
            <path d={CORAZON} fill={ven ? '#e0b44a' : recarga ? '#e9b8ac' : '#c0574a'} style={{ transition: 'fill .15s', transformOrigin: '180px 290px', transform: ven ? 'scale(.93)' : 'none' }} />
          </g>
          <path d={CORAZON} fill="none" stroke="#7a2e29" strokeWidth="2" />
          <line x1="112" y1="262" x2="248" y2="262" stroke="#7a2e29" strokeWidth="1.5" strokeDasharray="4 3" />
          {/* marcapasos natural */}
          {(sinusal && onda === 'P') && <circle cx="140" cy="222" r="8" fill="#fff3b0" filter="url(#ecg-brillo)" />}
          <circle cx="140" cy="222" r="3.5" fill="#fff3b0" stroke="#c89a2a" />
          <text x="256" y="232" fontSize="10" fill="#5b4a3a">aurículas</text>
          <text x="256" y="292" fontSize="10" fill="#5b4a3a">ventrículos</text>
        </g>
        {/* Monitor */}
        <g transform="translate(0 150)">
          <rect width="320" height="100" rx="10" fill="#0f2a1e" />
          <rect width="320" height="100" rx="10" fill="url(#ecg-cuad)" />
          <path d={sinusal ? SINUSAL : FA} fill="none" stroke="#3ee08a" strokeWidth="2" strokeLinejoin="round" opacity=".35" />
          <clipPath id="ecg-barrido"><rect x="0" y="0" width={x} height="100" /></clipPath>
          <path d={sinusal ? SINUSAL : FA} fill="none" stroke="#3ee08a" strokeWidth="2.2" strokeLinejoin="round" clipPath="url(#ecg-barrido)" />
          <line x1={x} y1="6" x2={x} y2="94" stroke="#b9ffd8" strokeWidth="1" opacity=".6" />
          {onda && <text x="300" y="20" textAnchor="end" fontSize="13" fontWeight="700" fill="#b9ffd8">{onda}</text>}
        </g>
        <style>{'.ecg-tiembla{animation:ecg-t .12s infinite alternate}@keyframes ecg-t{from{transform:translate(-.8px,.4px)}to{transform:translate(.8px,-.4px)}}'}</style>
      </svg>
      {sinusal ? (
        <>
          <div className="flex gap-2 mt-2">
            {(['P', 'QRS', 'T'] as const).map((o) => (
              <button key={o} onClick={() => elegir(o)} aria-pressed={onda === o}
                className={`flex-1 min-h-11 rounded-xl text-sm font-semibold border ${onda === o ? 'bg-tierra text-white border-tierra' : 'bg-white border-[#dcdccf]'}`}>{o}</button>
            ))}
            <button className="btn btn-secundario" onClick={() => setAuto(!auto)} aria-label={auto ? 'Pausar animación' : 'Reproducir animación'}>{auto ? <IcoPausa /> : <IcoPlay />}</button>
          </div>
          <p className="mt-2 text-sm min-h-10" aria-live="polite">{onda ? TEXTO[onda] : 'Entre latido y latido, la línea queda plana: el corazón descansa un instante.'}</p>
        </>
      ) : (
        <p className="mt-2 text-sm" aria-live="polite">
          Las aurículas tiemblan en vez de apretar, así que no aparece la onda P. Los latidos llegan a destiempo. La sangre puede quedarse quieta en las aurículas y formar coágulos.
        </p>
      )}
      <figcaption className="text-xs text-suave mt-2">Esquema didáctico, no a escala clínica. Fuentes: OpenStax A&P 2e, 19.2; AHA, fibrilación auricular.</figcaption>
    </figure>
  )
}
