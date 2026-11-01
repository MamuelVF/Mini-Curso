import { useMemo, useState } from 'react'
import type { Pregunta as P } from '../lib/tipos'
import { barajar } from '../lib/repaso'
import { Fuentes } from './Fuentes'
import { IcoCheck } from './Iconos'

const semilla = (s: string) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 2147483647, 7)

export function Pregunta({ p, onRespondida }: { p: P; onRespondida?: (correcta: boolean) => void }) {
  return (
    <div>
      <p className="font-semibold text-verde-900 mb-3">{p.enunciado}</p>
      {p.tipo === 'opcion-multiple' && <OpcionMultiple p={p} onRespondida={onRespondida} />}
      {p.tipo === 'verdadero-falso' && <VerdaderoFalso p={p} onRespondida={onRespondida} />}
      {p.tipo === 'ordenar' && <Ordenar p={p} onRespondida={onRespondida} />}
    </div>
  )
}

function Retro({ ok, texto, fuentes }: { ok: boolean; texto: string; fuentes: string[] }) {
  return (
    <div role="status" className={`mt-3 rounded-xl p-3 ${ok ? 'bg-verde-50 border border-verde-300' : 'bg-alerta-50 border border-alerta/30'}`}>
      <p className={`font-semibold ${ok ? 'text-ok' : 'text-alerta'}`}>{ok ? 'Correcto' : 'No exactamente'}</p>
      <p className="mt-1">{texto}</p>
      <Fuentes ids={fuentes} />
    </div>
  )
}

function OpcionMultiple({ p, onRespondida }: { p: Extract<P, { tipo: 'opcion-multiple' }>; onRespondida?: (c: boolean) => void }) {
  const [elegida, setElegida] = useState<number | null>(null)
  const opciones = useMemo(() => barajar(p.opciones.map((o, i) => ({ ...o, i })), semilla(p.id)), [p])
  const elegir = (i: number) => {
    if (elegida !== null) return
    setElegida(i)
    onRespondida?.(p.opciones[i].correcta)
  }
  return (
    <div>
      <div className="grid gap-2" role="group" aria-label="Opciones">
        {opciones.map((o) => {
          const estado = elegida === null ? '' : o.correcta ? 'border-ok bg-verde-50' : elegida === o.i ? 'border-alerta bg-alerta-50' : 'opacity-60'
          return (
            <button key={o.i} onClick={() => elegir(o.i)} disabled={elegida !== null && elegida !== o.i && !o.correcta}
              className={`text-left min-h-12 px-4 py-3 rounded-xl border-2 border-linea bg-papel ${estado}`}>
              {o.texto}
              {elegida !== null && o.correcta && <IcoCheck className="inline w-5 h-5 ml-2 text-ok" />}
            </button>
          )
        })}
      </div>
      {elegida !== null && <Retro ok={p.opciones[elegida].correcta} texto={p.opciones[elegida].explicacion} fuentes={p.fuentes} />}
    </div>
  )
}

function VerdaderoFalso({ p, onRespondida }: { p: Extract<P, { tipo: 'verdadero-falso' }>; onRespondida?: (c: boolean) => void }) {
  const [r, setR] = useState<boolean | null>(null)
  const elegir = (v: boolean) => {
    if (r !== null) return
    setR(v)
    onRespondida?.(v === p.respuesta)
  }
  return (
    <div>
      <div className="grid grid-cols-2 gap-2">
        {[true, false].map((v) => (
          <button key={String(v)} onClick={() => elegir(v)}
            className={`min-h-12 rounded-xl border-2 font-semibold bg-papel ${r === null ? 'border-linea' : v === p.respuesta ? 'border-ok bg-verde-50' : r === v ? 'border-alerta bg-alerta-50' : 'border-linea opacity-60'}`}>
            {v ? 'Verdadero' : 'Falso'}
          </button>
        ))}
      </div>
      {r !== null && <Retro ok={r === p.respuesta} texto={p.explicacion} fuentes={p.fuentes} />}
    </div>
  )
}

function Ordenar({ p, onRespondida }: { p: Extract<P, { tipo: 'ordenar' }>; onRespondida?: (c: boolean) => void }) {
  const mezcla = useMemo(() => {
    let m = barajar(p.pasos, semilla(p.id))
    if (m.every((x, i) => x === p.pasos[i])) m = m.slice().reverse()
    return m
  }, [p])
  const [orden, setOrden] = useState<string[]>([])
  const [comprobado, setComprobado] = useState<boolean | null>(null)
  const tocar = (paso: string) => {
    if (comprobado !== null) return
    setOrden((o) => (o.includes(paso) ? o.filter((x) => x !== paso) : [...o, paso]))
  }
  const comprobar = () => {
    const ok = orden.every((x, i) => x === p.pasos[i])
    setComprobado(ok)
    onRespondida?.(ok)
  }
  return (
    <div>
      <p className="text-sm text-suave mb-2">Toque los pasos en orden. Toque de nuevo para quitar uno.</p>
      <div className="grid gap-2">
        {mezcla.map((paso) => {
          const n = orden.indexOf(paso)
          return (
            <button key={paso} onClick={() => tocar(paso)} aria-pressed={n >= 0}
              className={`flex items-center gap-3 text-left min-h-12 px-3 py-2 rounded-xl border-2 bg-papel ${n >= 0 ? 'border-verde-500' : 'border-linea'}`}>
              <span className={`shrink-0 w-8 h-8 rounded-full grid place-items-center text-sm font-bold ${n >= 0 ? 'bg-verde-700 text-white' : 'bg-verde-50 text-suave'}`}>
                {n >= 0 ? n + 1 : '·'}
              </span>
              {paso}
            </button>
          )
        })}
      </div>
      {comprobado === null ? (
        <button className="btn btn-primario w-full mt-3" disabled={orden.length !== p.pasos.length} onClick={comprobar}>Comprobar</button>
      ) : (
        <>
          {!comprobado && (
            <ol className="mt-3 list-decimal pl-6 text-sm">
              {p.pasos.map((x) => <li key={x}>{x}</li>)}
            </ol>
          )}
          <Retro ok={comprobado} texto={p.explicacion} fuentes={p.fuentes} />
        </>
      )}
    </div>
  )
}
