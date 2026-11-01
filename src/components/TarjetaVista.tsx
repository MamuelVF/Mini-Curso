import type { Tarjeta } from '../lib/tipos'
import { Fuentes } from './Fuentes'
import { ImagenCreditada } from './Imagen'
import { Pregunta } from './Pregunta'
import { Diagrama } from '../diagramas'
import { IcoAlerta, IcoHoja } from './Iconos'

const estilos: Record<Tarjeta['tipo'], { etiqueta: string; clase: string }> = {
  concepto: { etiqueta: 'Concepto', clase: '' },
  'pregunta-previa': { etiqueta: 'Piense un momento', clase: '' },
  'ejemplo-resuelto': { etiqueta: 'Ejemplo resuelto', clase: '' },
  analogia: { etiqueta: 'Analogía vegetal', clase: 'bg-verde-50' },
  alerta: { etiqueta: 'Atención', clase: 'bg-alerta-50 border-alerta/30' },
  dato: { etiqueta: 'Dato', clase: '' },
}

export function TarjetaVista({ t, onRespondida }: { t: Tarjeta; onRespondida?: (c: boolean) => void }) {
  const e = estilos[t.tipo]
  return (
    <article className={`tarjeta p-5 ${e.clase}`} aria-labelledby={`${t.id}-t`}>
      <span className={`etiqueta ${t.tipo === 'alerta' ? '!bg-alerta/15 !text-alerta' : ''}`}>
        {t.tipo === 'analogia' && <IcoHoja className="inline w-4 h-4 mr-1 -mt-0.5" />}
        {t.tipo === 'alerta' && <IcoAlerta className="inline w-4 h-4 mr-1 -mt-0.5" />}
        {e.etiqueta}
      </span>
      <h2 id={`${t.id}-t`} className="text-xl font-semibold mt-2">{t.titulo}</h2>
      {t.texto && <p className="mt-2 text-[1.05rem]">{t.texto}</p>}
      {t.diagrama && <div className="mt-4"><Diagrama id={t.diagrama} compacto /></div>}
      <ImagenCreditada id={t.imagen} className="mt-4" />
      {t.pregunta && <div className="mt-3"><Pregunta p={t.pregunta} onRespondida={onRespondida} /></div>}
      {!t.pregunta && <Fuentes ids={t.fuentes} />}
    </article>
  )
}
