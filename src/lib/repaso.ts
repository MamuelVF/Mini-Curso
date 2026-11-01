// Repaso espaciado con FSRS (librería ts-fsrs).
import { createEmptyCard, fsrs, generatorParameters, Rating, type Card, type Grade } from 'ts-fsrs'
import type { Flashcard } from './tipos'
import type { TarjetaFsrsGuardada } from './almacen'

export const NUEVAS_POR_DIA = 10
export const programador = fsrs(generatorParameters({ request_retention: 0.9, enable_fuzz: true }))

export { Rating }
export type Calificacion = Grade

export function aTarjeta(g?: TarjetaFsrsGuardada, ahora = new Date()): Card {
  if (!g) return createEmptyCard(ahora)
  return { ...g, due: new Date(g.due), last_review: g.last_review ? new Date(g.last_review) : undefined } as Card
}

export function aGuardada(c: Card): TarjetaFsrsGuardada {
  return {
    due: c.due.toISOString(),
    stability: c.stability,
    difficulty: c.difficulty,
    elapsed_days: c.elapsed_days,
    scheduled_days: c.scheduled_days,
    learning_steps: c.learning_steps,
    reps: c.reps,
    lapses: c.lapses,
    state: c.state,
    last_review: c.last_review?.toISOString(),
  }
}

export function calificar(g: TarjetaFsrsGuardada | undefined, nota: Grade, ahora = new Date()): TarjetaFsrsGuardada {
  return aGuardada(programador.next(aTarjeta(g, ahora), ahora, nota).card)
}

/** Tarjetas para la sesión de hoy: primero las vencidas, luego nuevas (con límite diario). */
export function sesionDeHoy(
  todas: Flashcard[],
  diasDisponibles: number[],
  guardadas: Record<string, TarjetaFsrsGuardada>,
  nuevasYaHoy: number,
  ahora = new Date(),
): Flashcard[] {
  const disponibles = todas.filter((f) => diasDisponibles.includes(f.dia))
  const vencidas = disponibles
    .filter((f) => guardadas[f.id] && new Date(guardadas[f.id].due) <= ahora)
    .sort((a, b) => +new Date(guardadas[a.id].due) - +new Date(guardadas[b.id].due))
  const cupo = Math.max(0, NUEVAS_POR_DIA - nuevasYaHoy)
  const nuevas = disponibles.filter((f) => !guardadas[f.id]).slice(0, cupo)
  return [...vencidas, ...nuevas]
}

/** Texto del próximo repaso, para mostrar en los botones. */
export function intervaloTexto(g: TarjetaFsrsGuardada | undefined, nota: Grade, ahora = new Date()): string {
  const prox = new Date(calificar(g, nota, ahora).due)
  const min = Math.round((+prox - +ahora) / 60000)
  if (min < 60) return `${Math.max(1, min)} min`
  const h = Math.round(min / 60)
  if (h < 24) return `${h} h`
  const d = Math.round(h / 24)
  return d < 31 ? `${d} d` : `${Math.round(d / 30)} mes`
}

/** Mezcla (entrelazado): baraja de forma reproducible con una semilla. */
export function barajar<T>(lista: T[], semilla: number): T[] {
  const a = lista.slice()
  let s = semilla || 1
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 16807) % 2147483647
    const j = s % (i + 1)
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
