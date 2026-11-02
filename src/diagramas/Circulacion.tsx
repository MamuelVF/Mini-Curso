import { useEffect, useRef, useState } from 'react'
import { useMovimientoReducido } from './usarMovimiento'
import { IcoPausa, IcoPlay } from '../components/Iconos'

// Fuente: OpenStax A&P 2e, 19.1 y 20.5 (F60, F67). Esquema didáctico, no a escala.
const PARTES = [
  { id: 'ad', nombre: 'Aurícula derecha', texto: 'Es como una sala de espera. Aquí llega la sangre que vuelve del cuerpo, ya sin oxígeno.' },
  { id: 'vd', nombre: 'Ventrículo derecho', texto: 'Una bomba pequeña. Empuja esa sangre hacia los pulmones, que están muy cerca.' },
  { id: 'ap', nombre: 'Arteria pulmonar', texto: 'El tubo que lleva la sangre del corazón a los pulmones.' },
  { id: 'pu', nombre: 'Pulmones', texto: 'La sangre suelta el dióxido de carbono (lo que exhalas) y se carga del oxígeno que inhalas. Por eso aquí cambia de azul a rojo.' },
  { id: 'vp', nombre: 'Venas pulmonares', texto: 'Traen la sangre, ya con oxígeno, de vuelta al corazón.' },
  { id: 'ai', nombre: 'Aurícula izquierda', texto: 'La sala de espera del lado izquierdo. Recibe la sangre llena de oxígeno.' },
  { id: 'vi', nombre: 'Ventrículo izquierdo', texto: 'La bomba más fuerte. Tiene la pared más gruesa porque empuja la sangre hasta el último rincón del cuerpo.' },
  { id: 'ao', nombre: 'Aorta', texto: 'La arteria más grande del cuerpo. Reparte la sangre con oxígeno por todas partes.' },
  { id: 'cc', nombre: 'Cuerpo', texto: 'En tubitos finísimos (capilares) la sangre entrega oxígeno y alimento a las células y recoge sus desechos.' },
  { id: 'vc', nombre: 'Venas cavas', texto: 'Las venas más grandes. Devuelven la sangre al corazón y el viaje empieza otra vez.' },
] as const
type Id = (typeof PARTES)[number]['id']

const AZUL = '#4a6aa5', ROJO = '#c0443b'
// Recorrido completo de la sangre, en orden. "mezcla" = cambia de color a lo largo del tramo.
const TRAMOS: { d: string; color: 'azul' | 'rojo' | 'a-rojo' | 'a-azul'; oculto?: boolean }[] = [
  { d: 'M112 240 C125 250 140 262 150 285', color: 'azul', oculto: true }, // AD -> VD (dentro del corazón)
  { d: 'M150 285 C150 250 152 225 150 205', color: 'azul', oculto: true }, // VD -> salida
  { d: 'M150 205 C146 180 132 160 112 132', color: 'azul' }, // arteria pulmonar
  { d: 'M112 132 C140 96 220 96 248 132', color: 'a-rojo' }, // capilares de los pulmones
  { d: 'M248 132 C230 160 218 180 210 205', color: 'rojo' }, // venas pulmonares
  { d: 'M210 205 C212 240 212 262 214 288', color: 'rojo', oculto: true }, // AI -> VI
  { d: 'M214 288 C225 288 232 284 240 278', color: 'rojo', oculto: true }, // VI -> salida
  { d: 'M240 278 C290 290 300 330 292 392', color: 'rojo' }, // aorta
  { d: 'M292 392 C262 446 98 446 68 392', color: 'a-azul' }, // capilares del cuerpo
  { d: 'M68 392 C52 330 70 250 112 240', color: 'azul' }, // venas cavas
]
const N_GLOBULOS = 22

function mezclar(a: string, b: string, t: number) {
  const h = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16))
  const [x, y] = [h(a), h(b)]
  return `rgb(${x.map((v, i) => Math.round(v + (y[i] - v) * t)).join(',')})`
}

export function Circulacion() {
  const reducido = useMovimientoReducido()
  const [sel, setSel] = useState<Id>('ad')
  const [anim, setAnim] = useState(!reducido)
  const refs = useRef<(SVGPathElement | null)[]>([])
  const globulos = useRef<(SVGCircleElement | null)[]>([])
  const parte = PARTES.find((p) => p.id === sel)!
  const idx = PARTES.findIndex((p) => p.id === sel)

  useEffect(() => {
    const paths = refs.current.filter(Boolean) as SVGPathElement[]
    if (paths.length !== TRAMOS.length) return
    const largos = paths.map((p) => p.getTotalLength())
    const total = largos.reduce((a, b) => a + b, 0)
    let raf = 0, t0 = performance.now()
    const pintar = (avance: number) => {
      globulos.current.forEach((c, i) => {
        if (!c) return
        let s = ((avance + (i / N_GLOBULOS) * total) % total + total) % total
        let k = 0
        while (s > largos[k]) { s -= largos[k]; k++ }
        const p = paths[k].getPointAtLength(s)
        const f = s / largos[k]
        const col = TRAMOS[k].color
        c.setAttribute('cx', String(p.x)); c.setAttribute('cy', String(p.y)); c.setAttribute('opacity', TRAMOS[k].oculto ? '0' : '1')
        c.setAttribute('fill', col === 'azul' ? AZUL : col === 'rojo' ? ROJO : col === 'a-rojo' ? mezclar(AZUL, ROJO, f) : mezclar(ROJO, AZUL, f))
      })
    }
    if (!anim) { pintar(0); return }
    const paso = (t: number) => { pintar(((t - t0) / 1000) * 70); raf = requestAnimationFrame(paso) }
    raf = requestAnimationFrame(paso)
    return () => cancelAnimationFrame(raf)
  }, [anim])

  const z = (id: Id, el: React.ReactElement) => (
    <g role="button" tabIndex={0} aria-label={PARTES.find((p) => p.id === id)!.nombre} aria-pressed={sel === id}
      onClick={() => setSel(id)} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setSel(id))}
      className="cursor-pointer" style={{ outline: 'none' }}
      filter={sel === id ? 'url(#brillo)' : undefined} opacity={sel === id ? 1 : 0.85}>
      {el}
    </g>
  )
  const latido = anim ? { animation: 'cc-latido 0.9s ease-in-out infinite', transformOrigin: '180px 250px' } : undefined
  const respira = anim ? { animation: 'cc-respira 4s ease-in-out infinite', transformOrigin: '180px 120px' } : undefined

  return (
    <figure className="tarjeta p-3">
      <svg viewBox="0 0 360 470" className="w-full h-auto" role="group" aria-label="Recorrido de la sangre por el corazón, los pulmones y el cuerpo. Toque cada parte.">
        <defs>
          <filter id="brillo" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#1f3d2b" floodOpacity=".7" />
          </filter>
          <clipPath id="mitad-der"><rect x="0" y="0" width="180" height="470" /></clipPath>
          <clipPath id="mitad-izq"><rect x="180" y="0" width="180" height="470" /></clipPath>
          <radialGradient id="pulmon" cx=".5" cy=".4" r=".7"><stop offset="0" stopColor="#f2c9c4" /><stop offset="1" stopColor="#d99a94" /></radialGradient>
          <radialGradient id="cuerpo" cx=".5" cy=".3" r=".8"><stop offset="0" stopColor="#f3e3d3" /><stop offset="1" stopColor="#dcc2a8" /></radialGradient>
        </defs>
        <style>{`
          @keyframes cc-latido { 0%,100% { transform: scale(1) } 15% { transform: scale(1.06) } 30% { transform: scale(.98) } }
          @keyframes cc-respira { 0%,100% { transform: scale(1) } 50% { transform: scale(1.05) } }
          @keyframes cc-aire { 0% { transform: translateY(-14px); opacity: 0 } 30% { opacity: .9 } 100% { transform: translateY(46px); opacity: 0 } }
        `}</style>

        {/* Pulmones con tráquea y bronquios */}
        {z('pu', (
          <g style={respira}>
            <path d="M166 62 C140 40 96 50 80 92 C66 128 66 166 88 182 C112 196 150 186 166 172 Z" fill="url(#pulmon)" stroke="#b97a74" strokeWidth="2" />
            <path d="M194 62 C220 40 264 50 280 92 C294 128 294 166 272 182 C248 196 210 186 194 172 Z" fill="url(#pulmon)" stroke="#b97a74" strokeWidth="2" />
            <g stroke="#e9dcd2" strokeWidth="5" strokeLinecap="round" fill="none">
              <path d="M180 14 V66" />
              <path d="M180 66 C170 74 156 80 140 96 M150 86 L124 104 M140 96 L128 128" />
              <path d="M180 66 C190 74 204 80 220 96 M210 86 L236 104 M220 96 L232 128" />
            </g>
            {[0, 1, 2].map((i) => (
              <circle key={i} cx="180" cy="20" r="3.2" fill="#9ecbe6" style={anim ? { animation: `cc-aire 2s ${i * 0.66}s linear infinite` } : { opacity: 0 }} />
            ))}
          </g>
        ))}
        <text x="14" y="100" fontSize="12" fill="#24302a" pointerEvents="none">Pulmones</text>
        <text x="190" y="24" fontSize="10" fill="#5b665f" pointerEvents="none">aire</text>

        {/* Cuerpo: tejido con red de capilares */}
        {z('cc', (
          <g>
            <path d="M52 392 C52 372 92 364 180 364 C268 364 308 372 308 392 C308 440 260 462 180 462 C100 462 52 440 52 392 Z" fill="url(#cuerpo)" stroke="#c4a586" strokeWidth="2" />
            <g stroke="#c98a7c" strokeWidth="1.2" fill="none" opacity=".7">
              <path d="M90 410 C120 400 140 430 170 418 C200 406 220 432 250 420 C266 414 276 420 286 414" />
              <path d="M84 428 C110 438 140 420 180 438 C210 450 240 430 276 436" />
              <path d="M120 396 V446 M180 384 V456 M240 396 V446" />
            </g>
            {[[110, 420], [150, 446], [210, 444], [250, 412], [180, 400]].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="6" fill="#efd9c6" stroke="#c4a586" />
            ))}
          </g>
        ))}
        <text x="180" y="447" textAnchor="middle" fontSize="11" fill="#5b4632" pointerEvents="none">Cuerpo: músculos, cerebro, órganos</text>

        {/* Vasos */}
        {z('ap', <path d={TRAMOS[2].d} fill="none" stroke={AZUL} strokeWidth="11" strokeLinecap="round" />)}
        {z('vp', <path d={TRAMOS[4].d} fill="none" stroke={ROJO} strokeWidth="11" strokeLinecap="round" />)}
        <path d={TRAMOS[3].d} fill="none" stroke="#c98a8a" strokeWidth="3" strokeDasharray="2 4" strokeLinecap="round" pointerEvents="none" />
        {z('ao', <path d={TRAMOS[7].d} fill="none" stroke={ROJO} strokeWidth="13" strokeLinecap="round" />)}
        {z('vc', <path d={TRAMOS[9].d} fill="none" stroke={AZUL} strokeWidth="13" strokeLinecap="round" />)}
        <path d={TRAMOS[8].d} fill="none" stroke="#c98a8a" strokeWidth="3" strokeDasharray="2 4" strokeLinecap="round" pointerEvents="none" />

        {/* Corazón con forma de corazón: lado derecho (azul) a la izquierda de la imagen */}
        <g style={latido}>
          {(['ad', 'vd', 'ai', 'vi'] as const).map((id) => {
            const izquierdo = id === 'ai' || id === 'vi'
            const arriba = id === 'ad' || id === 'ai'
            return (
              <g key={id} clipPath={`url(#${izquierdo ? 'mitad-izq' : 'mitad-der'})`}>
                <clipPath id={`q-${id}`}><rect x={izquierdo ? 180 : 0} y={arriba ? 0 : 262} width="180" height={arriba ? 262 : 210} /></clipPath>
                {z(id, (
                  <path clipPath={`url(#q-${id})`} d="M180 228 C166 196 112 194 110 238 C108 276 150 306 180 334 C210 306 252 276 250 238 C248 194 194 196 180 228 Z"
                    fill={izquierdo ? ROJO : AZUL} opacity={arriba ? 0.82 : 1} />
                ))}
              </g>
            )
          })}
          <path d="M180 228 C166 196 112 194 110 238 C108 276 150 306 180 334 C210 306 252 276 250 238 C248 194 194 196 180 228 Z" fill="none" stroke="#7a2e29" strokeWidth="2.5" pointerEvents="none" />
          <path d="M180 228 V330 M116 262 H244" stroke="#fff" strokeWidth="2.5" pointerEvents="none" />
          <g fontSize="9.5" fill="#fff" textAnchor="middle" pointerEvents="none" fontWeight="600">
            <text x="146" y="248">Aurícula</text><text x="146" y="258">derecha</text>
            <text x="214" y="248">Aurícula</text><text x="214" y="258">izquierda</text>
            <text x="152" y="284">Ventrículo</text><text x="152" y="294">derecho</text>
            <text x="208" y="284">Ventrículo</text><text x="208" y="294">izquierdo</text>
          </g>
        </g>

        {/* Glóbulos rojos que viajan */}
        {TRAMOS.map((t, i) => <path key={i} ref={(el) => { refs.current[i] = el }} d={t.d} fill="none" stroke="none" />)}
        <g pointerEvents="none">
          {Array.from({ length: N_GLOBULOS }, (_, i) => (
            <circle key={i} ref={(el) => { globulos.current[i] = el }} r="4.2" stroke="#fff" strokeWidth="1" />
          ))}
        </g>
      </svg>
      <figcaption aria-live="polite">
        <p className="font-semibold text-verde-900">{idx + 1}. {parte.nombre}</p>
        <p className="text-sm mt-1 min-h-12">{parte.texto}</p>
        <div className="flex gap-2 mt-2">
          <button className="btn btn-secundario flex-1" onClick={() => setSel(PARTES[(idx + PARTES.length - 1) % PARTES.length].id)}>Anterior</button>
          <button className="btn btn-secundario" onClick={() => setAnim(!anim)} aria-label={anim ? 'Pausar animación' : 'Reproducir animación'}>{anim ? <IcoPausa /> : <IcoPlay />}</button>
          <button className="btn btn-primario flex-1" onClick={() => setSel(PARTES[(idx + 1) % PARTES.length].id)}>Siguiente</button>
        </div>
        <p className="text-xs text-suave mt-2">Toca cada parte. Rojo: sangre con oxígeno. Azul: sangre sin oxígeno (es un truco de colores: la sangre nunca es azul). Fuente: OpenStax A&P 2e, 19.1 y 20.5.</p>
      </figcaption>
    </figure>
  )
}
