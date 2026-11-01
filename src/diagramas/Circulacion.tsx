import { useState } from 'react'

// Fuente: OpenStax A&P 2e, 19.1 y 20.5 (F60, F67)
const PARTES = [
  { id: 'ad', nombre: 'Aurícula derecha', texto: 'Recibe la sangre pobre en oxígeno que vuelve del cuerpo por las venas cavas.' },
  { id: 'vd', nombre: 'Ventrículo derecho', texto: 'Bombea la sangre pobre en oxígeno hacia los pulmones por el tronco pulmonar.' },
  { id: 'ap', nombre: 'Arterias pulmonares', texto: 'Las únicas arterias del adulto que llevan sangre pobre en oxígeno.' },
  { id: 'pu', nombre: 'Capilares de los pulmones', texto: 'La sangre suelta dióxido de carbono y toma oxígeno.' },
  { id: 'vp', nombre: 'Venas pulmonares', texto: 'Las únicas venas del adulto que llevan sangre rica en oxígeno, hacia la aurícula izquierda.' },
  { id: 'ai', nombre: 'Aurícula izquierda', texto: 'Recibe la sangre oxigenada de los pulmones.' },
  { id: 'vi', nombre: 'Ventrículo izquierdo', texto: 'Bombea la sangre oxigenada a la aorta. Es la cavidad de pared más gruesa.' },
  { id: 'ao', nombre: 'Aorta y arterias', texto: 'Reparten la sangre oxigenada por todo el cuerpo y se ramifican en arteriolas.' },
  { id: 'cc', nombre: 'Capilares del cuerpo', texto: 'Entregan oxígeno y nutrientes a los tejidos y recogen dióxido de carbono y desechos.' },
  { id: 'vc', nombre: 'Venas cavas', texto: 'Las venas más grandes: devuelven la sangre del cuerpo a la aurícula derecha.' },
] as const

type Id = (typeof PARTES)[number]['id']

export function Circulacion() {
  const [sel, setSel] = useState<Id>('ad')
  const parte = PARTES.find((p) => p.id === sel)!
  const idx = PARTES.findIndex((p) => p.id === sel)
  const rojo = '#b5473f', azul = '#4a6aa5'
  const z = (id: Id, el: React.ReactElement) => (
    <g role="button" tabIndex={0} aria-label={PARTES.find((p) => p.id === id)!.nombre} aria-pressed={sel === id}
      onClick={() => setSel(id)} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setSel(id))}
      className="cursor-pointer" style={{ outline: 'none' }} opacity={sel === id ? 1 : 0.78} stroke={sel === id ? '#1f3d2b' : 'none'} strokeWidth={sel === id ? 3 : 0}>
      {el}
    </g>
  )
  return (
    <figure className="tarjeta p-3">
      <svg viewBox="0 0 320 330" className="w-full h-auto" role="group" aria-label="Recorrido de la sangre. Toque cada parte.">
        {z('pu', <ellipse cx="160" cy="34" rx="110" ry="26" fill="#c9a6a6" />)}
        <text x="160" y="38" textAnchor="middle" fontSize="12" fill="#24302a" pointerEvents="none">Pulmones</text>
        {z('ap', <path d="M140 186 C164 170 162 96 100 54" fill="none" stroke={azul} strokeWidth="10" strokeLinecap="round" />)}
        {z('vp', <path d="M232 54 C272 70 276 104 246 120" fill="none" stroke={rojo} strokeWidth="12" strokeLinecap="round" />)}
        {z('ad', <rect x="50" y="120" width="92" height="50" rx="14" fill={azul} />)}
        {z('ai', <rect x="178" y="120" width="92" height="50" rx="14" fill={rojo} />)}
        {z('vd', <rect x="50" y="176" width="92" height="56" rx="14" fill={azul} />)}
        {z('vi', <rect x="178" y="176" width="92" height="56" rx="14" fill={rojo} />)}
        <g fontSize="11" fill="#fff" textAnchor="middle" pointerEvents="none">
          <text x="96" y="149">Aur. der.</text><text x="224" y="149">Aur. izq.</text>
          <text x="96" y="208">Vent. der.</text><text x="224" y="208">Vent. izq.</text>
        </g>
        {z('ao', <path d="M272 204 C306 220 304 262 270 282" fill="none" stroke={rojo} strokeWidth="12" strokeLinecap="round" />)}
        {z('cc', <ellipse cx="160" cy="300" rx="115" ry="24" fill="#b9a7c4" />)}
        <text x="160" y="304" textAnchor="middle" fontSize="12" fill="#24302a" pointerEvents="none">Tejidos del cuerpo</text>
        {z('vc', <path d="M46 282 C14 262 14 170 50 146" fill="none" stroke={azul} strokeWidth="12" strokeLinecap="round" />)}
      </svg>
      <figcaption aria-live="polite">
        <p className="font-semibold text-verde-900">{idx + 1}. {parte.nombre}</p>
        <p className="text-sm mt-1 min-h-12">{parte.texto}</p>
        <div className="flex gap-2 mt-2">
          <button className="btn btn-secundario flex-1" onClick={() => setSel(PARTES[(idx + PARTES.length - 1) % PARTES.length].id)}>Paso anterior</button>
          <button className="btn btn-primario flex-1" onClick={() => setSel(PARTES[(idx + 1) % PARTES.length].id)}>Siguiente paso</button>
        </div>
        <p className="text-xs text-suave mt-2">Rojo: sangre rica en oxígeno. Azul: pobre en oxígeno (convención didáctica; la sangre nunca es azul). Fuente: OpenStax A&P 2e, 19.1.</p>
      </figcaption>
    </figure>
  )
}
