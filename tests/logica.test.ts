import { describe, expect, it } from 'vitest'
import { calificar, sesionDeHoy, Rating, barajar, NUEVAS_POR_DIA } from '../src/lib/repaso'
import { siguienteRacha, rachaVisible, mensajePuntaje } from '../src/lib/progreso'
import { diasEntre } from '../src/lib/fechas'
import type { Flashcard } from '../src/lib/tipos'

const fc = (n: number, dia = 1): Flashcard => ({ id: `f${n}`, dia, frente: 'x', reverso: 'y', fuentes: ['F60'] })

describe('FSRS', () => {
  const ahora = new Date('2026-11-01T10:00:00Z')
  it('"Fácil" programa más lejos que "Otra vez"', () => {
    const facil = new Date(calificar(undefined, Rating.Easy, ahora).due)
    const otra = new Date(calificar(undefined, Rating.Again, ahora).due)
    expect(+facil).toBeGreaterThan(+otra)
  })
  it('respuestas correctas seguidas aumentan el intervalo', () => {
    let g = calificar(undefined, Rating.Good, ahora)
    const i1 = +new Date(g.due) - +ahora
    const t2 = new Date(g.due)
    g = calificar(g, Rating.Good, t2)
    const i2 = +new Date(g.due) - +t2
    expect(i2).toBeGreaterThan(i1)
  })
  it('la sesión respeta el límite de tarjetas nuevas y los días disponibles', () => {
    const todas = [...Array.from({ length: 20 }, (_, i) => fc(i)), fc(99, 2)]
    const s = sesionDeHoy(todas, [1], {}, 0, ahora)
    expect(s.length).toBe(NUEVAS_POR_DIA)
    expect(s.every((f) => f.dia === 1)).toBe(true)
    expect(sesionDeHoy(todas, [1], {}, NUEVAS_POR_DIA, ahora).length).toBe(0)
  })
  it('las vencidas aparecen aunque se haya llegado al límite de nuevas', () => {
    const g = calificar(undefined, Rating.Again, new Date('2026-10-30T10:00:00Z'))
    expect(sesionDeHoy([fc(1)], [1], { f1: g }, NUEVAS_POR_DIA, ahora).length).toBe(1)
  })
  it('barajar es reproducible y conserva los elementos', () => {
    const a = barajar([1, 2, 3, 4, 5], 42)
    expect(a).toEqual(barajar([1, 2, 3, 4, 5], 42))
    expect([...a].sort()).toEqual([1, 2, 3, 4, 5])
  })
})

describe('racha y puntaje', () => {
  it('cuenta días seguidos y reinicia si se salta un día', () => {
    let r = siguienteRacha({ actual: 0, mejor: 0, ultimoDia: null }, '2026-11-01')
    r = siguienteRacha(r, '2026-11-02')
    expect(r.actual).toBe(2)
    expect(siguienteRacha(r, '2026-11-02').actual).toBe(2)
    r = siguienteRacha(r, '2026-11-05')
    expect(r).toEqual({ actual: 1, mejor: 2, ultimoDia: '2026-11-05' })
  })
  it('la racha visible es 0 si pasaron más de un día', () => {
    expect(rachaVisible({ actual: 3, mejor: 3, ultimoDia: '2026-11-01' }, '2026-11-04')).toBe(0)
    expect(rachaVisible({ actual: 3, mejor: 3, ultimoDia: '2026-11-01' }, '2026-11-02')).toBe(3)
  })
  it('diasEntre funciona entre meses', () => expect(diasEntre('2026-10-31', '2026-11-01')).toBe(1))
  it('el mensaje del puntaje siempre es amable', () => {
    for (const a of [0, 1, 3, 5]) expect(mensajePuntaje(a, 5)).not.toMatch(/reprob|fall|mal/i)
  })
})
