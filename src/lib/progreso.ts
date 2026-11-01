import type { Dia } from './tipos'
import { actualizar, type Estado } from './almacen'
import { diasEntre, hoyISO } from './fechas'

/** Cuenta la actividad de hoy para la racha diaria. */
export function registrarActividad(hoy = hoyISO()) {
  actualizar((e) => ({ ...e, racha: siguienteRacha(e.racha, hoy) }))
}

export function siguienteRacha(r: Estado['racha'], hoy: string): Estado['racha'] {
  if (r.ultimoDia === hoy) return r
  const seguida = r.ultimoDia !== null && diasEntre(r.ultimoDia, hoy) === 1
  const actual = seguida ? r.actual + 1 : 1
  return { actual, mejor: Math.max(r.mejor, actual), ultimoDia: hoy }
}

/** Racha visible: si pasó más de un día sin actividad, se muestra 0. */
export function rachaVisible(r: Estado['racha'], hoy = hoyISO()): number {
  if (!r.ultimoDia) return 0
  return diasEntre(r.ultimoDia, hoy) <= 1 ? r.actual : 0
}

export function marcarLeccion(id: string) {
  actualizar((e) => (e.leccionesHechas.includes(id) ? e : { ...e, leccionesHechas: [...e.leccionesHechas, id] }))
  registrarActividad()
}

export function guardarPractica(diaId: number, aciertos: number, total: number) {
  actualizar((e) => {
    const previo = e.practica[diaId]
    return {
      ...e,
      practica: { ...e.practica, [diaId]: { ultimo: aciertos, mejor: Math.max(previo?.mejor ?? 0, aciertos), total } },
    }
  })
  registrarActividad()
}

export function avanceDia(d: Dia, e: Estado) {
  const hechas = d.lecciones.filter((l) => e.leccionesHechas.includes(l.id)).length
  return { hechas, total: d.lecciones.length, completo: hechas === d.lecciones.length }
}

/** Primera lección sin terminar, para el botón "Continuar". */
export function siguienteLeccion(dias: Dia[], e: Estado): { dia: Dia; leccion: Dia['lecciones'][number] } | null {
  for (const d of dias) for (const l of d.lecciones) if (!e.leccionesHechas.includes(l.id)) return { dia: d, leccion: l }
  return null
}

/** Mensaje amable para el puntaje de referencia (nunca decide nada). */
export function mensajePuntaje(aciertos: number, total: number): string {
  const p = total ? aciertos / total : 0
  if (p === 1) return '¡Excelente! Todo claro.'
  if (p >= 0.6) return 'Muy bien. Puede repasar las explicaciones cuando quiera.'
  return 'Buen primer intento. Las explicaciones le ayudarán a afianzarlo.'
}
