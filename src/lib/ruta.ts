// Navegación con hash (#/dia/1), compatible con GitHub Pages sin servidor.
// En la vista previa (VITE_MEMORIA=1) la ruta vive en memoria, para entornos que no permiten cambiar el hash.
import { useSyncExternalStore } from 'react'

const MEMORIA = import.meta.env.VITE_MEMORIA === '1'
let rutaMemoria = '/'
const oyentes = new Set<() => void>()

const leer = () => (MEMORIA ? rutaMemoria : location.hash.replace(/^#/, '') || '/')

if (MEMORIA && typeof document !== 'undefined') {
  document.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest?.('a')
    const href = a?.getAttribute('href')
    if (href?.startsWith('#/')) {
      e.preventDefault()
      ir(href.slice(1))
    }
  })
}

export function useRuta(): string {
  return useSyncExternalStore(
    (o) => {
      oyentes.add(o)
      window.addEventListener('hashchange', o)
      return () => { oyentes.delete(o); window.removeEventListener('hashchange', o) }
    },
    leer,
    () => '/',
  )
}

export function rutaActual() {
  return leer()
}

export function ir(ruta: string) {
  if (MEMORIA) {
    rutaMemoria = ruta
    oyentes.forEach((o) => o())
  } else location.hash = ruta
  window.scrollTo(0, 0)
}

export function coincide(patron: string, ruta: string): Record<string, string> | null {
  const p = patron.split('/').filter(Boolean)
  const r = ruta.split('?')[0].split('/').filter(Boolean)
  if (p.length !== r.length) return null
  const params: Record<string, string> = {}
  for (let i = 0; i < p.length; i++) {
    if (p[i].startsWith(':')) params[p[i].slice(1)] = decodeURIComponent(r[i])
    else if (p[i] !== r[i]) return null
  }
  return params
}
