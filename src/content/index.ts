import type { Caso, Dia, Flashcard, Fuente, Imagen, TerminoGlosario } from '../lib/tipos'
import flashcardsJson from './flashcards.json'
import glosarioJson from './glosario.json'
import fuentesJson from './fuentes.json'
import imagenesJson from './imagenes.json'
import casoJson from './caso.json'

const modulos = import.meta.glob<{ default: Dia }>('./dias/dia-*.json', { eager: true })

export const dias: Dia[] = Object.values(modulos)
  .map((m) => m.default)
  .sort((a, b) => a.id - b.id)

export const flashcards = flashcardsJson as Flashcard[]
export const glosario = (glosarioJson as TerminoGlosario[]).slice().sort((a, b) => a.termino.localeCompare(b.termino, 'es'))
export const fuentes = fuentesJson as Fuente[]
export const imagenes = imagenesJson as Imagen[]
export const caso = casoJson as Caso

export const TOTAL_DIAS = 7

const fuentesPorId = new Map(fuentes.map((f) => [f.id, f]))
export const fuente = (id: string) => fuentesPorId.get(id)
const imagenesPorId = new Map(imagenes.map((i) => [i.id, i]))
export const imagen = (id?: string) => (id ? imagenesPorId.get(id) : undefined)
export const dia = (id: number) => dias.find((d) => d.id === id)
