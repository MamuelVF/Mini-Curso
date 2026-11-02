// Esquema de validación del contenido. Si un JSON no cumple, las pruebas fallan.
import { z } from 'zod'

const fuentes = z.array(z.string().regex(/^F\d{2,3}$/)).min(1, 'Todo elemento necesita al menos una fuente')
const opcion = z.object({ texto: z.string().min(1), correcta: z.boolean(), explicacion: z.string().min(5) })

export const pregunta = z.discriminatedUnion('tipo', [
  z.object({ id: z.string(), tipo: z.literal('opcion-multiple'), enunciado: z.string().min(5), fuentes,
    opciones: z.array(opcion).min(2).refine((o) => o.filter((x) => x.correcta).length === 1, 'Debe haber exactamente una opción correcta') }),
  z.object({ id: z.string(), tipo: z.literal('verdadero-falso'), enunciado: z.string().min(5), respuesta: z.boolean(), explicacion: z.string().min(5), fuentes }),
  z.object({ id: z.string(), tipo: z.literal('ordenar'), enunciado: z.string().min(5), pasos: z.array(z.string()).min(3), explicacion: z.string().min(5), fuentes }),
])

const tarjeta = z.object({
  id: z.string(),
  tipo: z.enum(['concepto', 'pregunta-previa', 'ejemplo-resuelto', 'analogia', 'alerta', 'dato']),
  titulo: z.string().min(2),
  texto: z.string().max(420, 'Carga cognitiva: máximo ~60-70 palabras por tarjeta'),
  fuentes,
  imagen: z.string().optional(),
  diagrama: z.enum(['ciclo-cardiaco', 'circulacion', 'presion', 'cardiotoxicidad', 'ecg', 'coagulacion', 'valvula', 'planta-medicina']).optional(),
  pregunta: pregunta.optional(),
}).refine((t) => t.tipo !== 'pregunta-previa' || t.pregunta, 'Una tarjeta de pregunta necesita su pregunta')

export const dia = z.object({
  id: z.number().int().min(1).max(7),
  bloque: z.enum(['A', 'B', 'C']),
  titulo: z.string(),
  subtitulo: z.string(),
  minutos: z.number().max(30),
  objetivos: z.array(z.string()).min(2),
  lecciones: z.array(z.object({ id: z.string(), titulo: z.string(), minutos: z.number().max(6), tarjetas: z.array(tarjeta).min(3).max(8) })).min(4).max(6),
  practica: z.array(pregunta).min(3).max(6),
  audio: z.object({ archivo: z.string(), titulo: z.string(), estado: z.enum(['pendiente', 'listo']), origen: z.string() }),
  resumen: z.object({ titulo: z.string(), puntos: z.array(z.string()).min(3), imagen: z.string().optional() }),
  fuentes,
})

export const flashcard = z.object({ id: z.string(), dia: z.number(), frente: z.string().min(2), reverso: z.string().min(1).max(200), fuentes })
export const termino = z.object({ termino: z.string(), definicion: z.string().min(5), dia: z.number(), fuentes })
export const fuente = z.object({ id: z.string().regex(/^F\d{2,3}$/), titulo: z.string(), url: z.string().url(), consultado: z.string() })
export const imagen = z.object({
  id: z.string(), archivo: z.string(), titulo: z.string(), alt: z.string().min(5),
  origen: z.enum(['commons', 'ia', 'notebooklm', 'propia']), autor: z.string(), licencia: z.string(),
  urlLicencia: z.string().url().optional(), urlOrigen: z.string().url().optional(), consultado: z.string().optional(),
}).refine((i) => i.origen !== 'commons' || /^(Public domain|Dominio público|CC0|CC BY(-SA)? \d\.\d)/i.test(i.licencia), 'Licencia de Commons no permitida')

const dato = z.object({ texto: z.string().min(5), fuentes })
export const guiaDosis = z.object({
  introduccion: z.string().min(10),
  plantas: z.array(z.object({
    id: z.string(), dia: z.number().int().min(1).max(7), nombre: z.string(), cientifico: z.string(), parte: z.string(),
    imagen: z.string(), referencia: z.string().min(5), puntos: z.array(dato).min(1), ojo: dato.optional(), fuentes,
  })).min(1),
})
