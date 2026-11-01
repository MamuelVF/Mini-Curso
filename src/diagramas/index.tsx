import type { IdDiagrama } from '../lib/tipos'
import { CicloCardiaco } from './CicloCardiaco'
import { Circulacion } from './Circulacion'
import { Presion } from './Presion'
import { ECG } from './ECG'
import { Cardiotoxicidad } from './Cardiotoxicidad'
import { Coagulacion } from './Coagulacion'

export const DIAGRAMAS: { id: IdDiagrama; titulo: string; dia: number; listo: boolean }[] = [
  { id: 'ciclo-cardiaco', titulo: 'Ciclo cardiaco animado', dia: 1, listo: true },
  { id: 'circulacion', titulo: 'Recorrido de la sangre', dia: 1, listo: true },
  { id: 'presion', titulo: 'Presión y resistencia', dia: 2, listo: true },
  { id: 'ecg', titulo: 'Un electrocardiograma sencillo', dia: 3, listo: true },
  { id: 'cardiotoxicidad', titulo: 'Mapa de cardiotoxicidad', dia: 5, listo: true },
  { id: 'coagulacion', titulo: 'Cómo coagula la sangre', dia: 6, listo: true },
]

export function Diagrama({ id }: { id: IdDiagrama; compacto?: boolean }) {
  switch (id) {
    case 'ciclo-cardiaco': return <CicloCardiaco />
    case 'circulacion': return <Circulacion />
    case 'presion': return <Presion />
    case 'ecg': return <ECG />
    case 'cardiotoxicidad': return <Cardiotoxicidad />
    case 'coagulacion': return <Coagulacion />
    default: return <p className="tarjeta p-4 text-suave">Este diagrama estará disponible pronto.</p>
  }
}
