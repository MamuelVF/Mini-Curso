import { describe, expect, it } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { dia, flashcard, fuente, imagen, termino } from '../src/lib/esquema'

const leer = (p: string) => JSON.parse(readFileSync(new URL(`../src/content/${p}`, import.meta.url), 'utf8'))
const dias = readdirSync(new URL('../src/content/dias/', import.meta.url)).map((f) => leer(`dias/${f}`))
const fuentes = leer('fuentes.json') as { id: string }[]
const ids = new Set(fuentes.map((f) => f.id))

/** Recorre cualquier objeto y devuelve todos los ids de fuente citados. */
function citas(x: unknown, out: string[] = []): string[] {
  if (Array.isArray(x)) x.forEach((y) => citas(y, out))
  else if (x && typeof x === 'object') for (const [k, v] of Object.entries(x)) k === 'fuentes' && Array.isArray(v) ? out.push(...v) : citas(v, out)
  return out
}
function textos(x: unknown, out: string[] = []): string[] {
  if (typeof x === 'string') out.push(x)
  else if (Array.isArray(x)) x.forEach((y) => textos(y, out))
  else if (x && typeof x === 'object') Object.values(x).forEach((v) => textos(v, out))
  return out
}

describe('contenido', () => {
  it('cada día cumple el esquema', () => { for (const d of dias) expect(() => dia.parse(d)).not.toThrow() })
  it('flashcards, glosario, fuentes e imágenes cumplen el esquema', () => {
    leer('flashcards.json').forEach((f: unknown) => flashcard.parse(f))
    leer('glosario.json').forEach((t: unknown) => termino.parse(t))
    fuentes.forEach((f) => fuente.parse(f))
    leer('imagenes.json').forEach((i: unknown) => imagen.parse(i))
  })
  it('todas las citas existen en fuentes.json', () => {
    const todo = [...dias, leer('flashcards.json'), leer('glosario.json'), leer('derivar.json'), leer('caso.json')]
    const faltan = citas(todo).filter((c) => !ids.has(c))
    expect(faltan).toEqual([])
  })
  it('los ids son únicos', () => {
    const todos = [...dias.flatMap((d) => [...d.lecciones.flatMap((l: any) => [l.id, ...l.tarjetas.map((t: any) => t.id)]), ...d.practica.map((p: any) => p.id)]), ...leer('flashcards.json').map((f: any) => f.id)]
    expect(new Set(todos).size).toBe(todos.length)
  })
  it('seguridad: sin dosis ni promesas de cura', () => {
    const prohibido = [/\b\d+(\.\d+)?\s?(mg|mcg|µg|g\/d[ií]a|ml\/kg)\b/i, /\bcura(n|r)?\s+el\s+c[aá]ncer\b/i, /\bdosis\s+(recomendada|de\s+\d)/i]
    const contenido = textos([...dias, leer('flashcards.json'), leer('glosario.json'), leer('caso.json'), leer('derivar.json')])
    const permitido = (t: string) => /ninguna planta cura|no cura|no digas|no insin/i.test(t)
    for (const t of contenido) for (const r of prohibido) if (!permitido(t)) expect(t, `Texto no permitido: ${t}`).not.toMatch(r)
  })
  it('el caso es un recorrido válido que termina', () => {
    const caso = leer('caso.json') as { inicio: string; nodos: { id: string; final?: boolean; opciones?: { siguiente: string; segura: boolean }[] }[] }
    const porId = new Map(caso.nodos.map((n) => [n.id, n]))
    expect(porId.has(caso.inicio)).toBe(true)
    for (const n of caso.nodos) {
      if (n.final) continue
      expect(n.opciones?.length, n.id).toBeGreaterThanOrEqual(2)
      expect(n.opciones!.filter((o) => o.segura).length, n.id).toBe(1)
      for (const o of n.opciones!) expect(porId.has(o.siguiente), `${n.id} → ${o.siguiente}`).toBe(true)
    }
    expect(caso.nodos.some((n) => n.final)).toBe(true)
  })
})
