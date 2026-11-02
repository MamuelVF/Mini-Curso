// Tipos del contenido del curso. El esquema de validación está en src/lib/esquema.ts.
export type IdFuente = string

export interface Opcion { texto: string; correcta: boolean; explicacion: string }

export type Pregunta =
  | { id: string; tipo: 'opcion-multiple'; enunciado: string; opciones: Opcion[]; fuentes: IdFuente[] }
  | { id: string; tipo: 'verdadero-falso'; enunciado: string; respuesta: boolean; explicacion: string; fuentes: IdFuente[] }
  | { id: string; tipo: 'ordenar'; enunciado: string; pasos: string[]; explicacion: string; fuentes: IdFuente[] }

export type TipoTarjeta = 'concepto' | 'pregunta-previa' | 'ejemplo-resuelto' | 'analogia' | 'alerta' | 'dato'

export type IdDiagrama = 'ciclo-cardiaco' | 'circulacion' | 'presion' | 'cardiotoxicidad' | 'ecg' | 'coagulacion' | 'valvula'

export interface Tarjeta {
  id: string
  tipo: TipoTarjeta
  titulo: string
  texto: string
  fuentes: IdFuente[]
  imagen?: string
  diagrama?: IdDiagrama
  pregunta?: Pregunta
}

export interface Leccion { id: string; titulo: string; minutos: number; tarjetas: Tarjeta[] }

export interface Dia {
  id: number
  bloque: 'A' | 'B' | 'C'
  titulo: string
  subtitulo: string
  minutos: number
  objetivos: string[]
  lecciones: Leccion[]
  practica: Pregunta[]
  audio: { archivo: string; titulo: string; estado: 'pendiente' | 'listo'; origen: string }
  resumen: { titulo: string; puntos: string[]; imagen?: string }
  fuentes: IdFuente[]
}

export interface Flashcard { id: string; dia: number; frente: string; reverso: string; fuentes: IdFuente[] }
export interface TerminoGlosario { termino: string; definicion: string; dia: number; fuentes: IdFuente[] }
export interface Fuente { id: string; titulo: string; url: string; consultado: string }

export interface Imagen {
  id: string
  archivo: string
  titulo: string
  alt: string
  origen: 'commons' | 'ia' | 'notebooklm' | 'propia'
  autor: string
  licencia: string
  urlLicencia?: string
  urlOrigen?: string
  consultado?: string
}

export interface NodoCaso {
  id: string
  texto: string
  opciones?: { texto: string; siguiente: string; segura: boolean; explicacion: string }[]
  final?: boolean
  fuentes: IdFuente[]
}
export interface Caso { titulo: string; introduccion: string; inicio: string; nodos: NodoCaso[] }
