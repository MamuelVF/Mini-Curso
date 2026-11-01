import { useState } from 'react'
import { dia as obtenerDia } from '../content'
import { Pagina } from '../components/Layout'
import { Pregunta } from '../components/Pregunta'
import { guardarPractica, mensajePuntaje } from '../lib/progreso'

export function Practica({ diaId }: { diaId: number }) {
  const d = obtenerDia(diaId)
  const [i, setI] = useState(0)
  const [aciertos, setAciertos] = useState(0)
  const [respondida, setRespondida] = useState(false)
  const [fin, setFin] = useState(false)
  const [intento, setIntento] = useState(0)
  if (!d) return null
  const total = d.practica.length
  const siguiente = () => {
    if (i + 1 < total) { setI(i + 1); setRespondida(false) }
    else { guardarPractica(d.id, aciertos, total); setFin(true) }
  }
  const repetir = () => { setI(0); setAciertos(0); setRespondida(false); setFin(false); setIntento(intento + 1) }

  if (fin) {
    return (
      <Pagina titulo={`Práctica · Día ${d.id}`} volver={`/dia/${d.id}`}>
        <div className="tarjeta p-6 text-center">
          <p className="text-suave">Su resultado de referencia</p>
          <p className="text-5xl font-serif font-semibold text-verde-700 my-3">{aciertos} de {total}</p>
          <p>{mensajePuntaje(aciertos, total)}</p>
          <p className="text-sm text-suave mt-3">Este puntaje no decide nada: puede seguir con el curso cuando quiera.</p>
        </div>
        <div className="grid gap-3 mt-5">
          <a className="btn btn-primario no-underline" href={d.id < 7 ? `#/dia/${d.id + 1}` : '#/'}>{d.id < 7 ? `Ir al día ${d.id + 1}` : 'Volver al inicio'}</a>
          <button className="btn btn-secundario" onClick={repetir}>Repetir la práctica</button>
          <a className="btn btn-secundario no-underline" href="#/repaso">Repasar con tarjetas</a>
        </div>
      </Pagina>
    )
  }
  return (
    <Pagina titulo={`Práctica · Día ${d.id}`} volver={`/dia/${d.id}`} sinNav>
      <p className="text-sm text-suave mb-3">Pregunta {i + 1} de {total} · sin presión, es para repasar</p>
      <div className="tarjeta p-5">
        <Pregunta key={`${d.practica[i].id}-${intento}`} p={d.practica[i]} onRespondida={(c) => { setRespondida(true); if (c) setAciertos((a) => a + 1) }} />
      </div>
      <button className="btn btn-primario w-full mt-5" disabled={!respondida} onClick={siguiente}>{i + 1 < total ? 'Siguiente' : 'Ver resultado'}</button>
    </Pagina>
  )
}
