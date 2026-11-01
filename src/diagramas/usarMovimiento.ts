import { useEffect, useState } from 'react'

/** true si el usuario pidió reducir animaciones. */
export function useMovimientoReducido() {
  const q = typeof matchMedia !== 'undefined' ? matchMedia('(prefers-reduced-motion: reduce)') : null
  const [r, setR] = useState(q?.matches ?? false)
  useEffect(() => {
    if (!q) return
    const f = () => setR(q.matches)
    q.addEventListener('change', f)
    return () => q.removeEventListener('change', f)
  }, [])
  return r
}
