// Estado del alumno, guardado solo en este dispositivo (localStorage).
// No se guarda ningún dato personal ni de salud.
import { useSyncExternalStore } from 'react'

export interface TarjetaFsrsGuardada {
  due: string
  stability: number
  difficulty: number
  elapsed_days: number
  scheduled_days: number
  learning_steps: number
  reps: number
  lapses: number
  state: number
  last_review?: string
}

export interface Estado {
  version: 1
  leccionesHechas: string[]
  practica: Record<string, { ultimo: number; mejor: number; total: number }>
  fsrs: Record<string, TarjetaFsrsGuardada>
  nuevasHoy: { fecha: string; cantidad: number }
  racha: { actual: number; mejor: number; ultimoDia: string | null }
  casoTerminado: boolean
  bienvenidaVista: boolean
}

const CLAVE = 'curso-cardio:v1'

export const estadoInicial = (): Estado => ({
  version: 1,
  leccionesHechas: [],
  practica: {},
  fsrs: {},
  nuevasHoy: { fecha: '', cantidad: 0 },
  racha: { actual: 0, mejor: 0, ultimoDia: null },
  casoTerminado: false,
  bienvenidaVista: false,
})

function leer(): Estado {
  try {
    const crudo = localStorage.getItem(CLAVE)
    if (!crudo) return estadoInicial()
    const datos = JSON.parse(crudo)
    if (datos?.version !== 1) return estadoInicial()
    return { ...estadoInicial(), ...datos }
  } catch {
    return estadoInicial()
  }
}

let estado: Estado = typeof localStorage === 'undefined' ? estadoInicial() : leer()
const oyentes = new Set<() => void>()

export function obtenerEstado() {
  return estado
}

export function actualizar(cambio: (e: Estado) => Estado) {
  estado = cambio(estado)
  try {
    localStorage.setItem(CLAVE, JSON.stringify(estado))
  } catch {
    /* almacenamiento no disponible: el progreso dura solo esta sesión */
  }
  oyentes.forEach((o) => o())
}

export function useEstado(): Estado {
  return useSyncExternalStore(
    (o) => {
      oyentes.add(o)
      return () => oyentes.delete(o)
    },
    () => estado,
    () => estado,
  )
}

export function exportarProgreso(): string {
  return JSON.stringify(estado, null, 2)
}

export function importarProgreso(texto: string): boolean {
  try {
    const datos = JSON.parse(texto)
    if (datos?.version !== 1) return false
    actualizar(() => ({ ...estadoInicial(), ...datos }))
    return true
  } catch {
    return false
  }
}

export function reiniciarProgreso() {
  actualizar(() => estadoInicial())
}
