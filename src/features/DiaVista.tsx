import { dia as obtenerDia } from '../content'
import { Pagina } from '../components/Layout'
import { Audio } from '../components/Audio'
import { Fuentes } from '../components/Fuentes'
import { ImagenCreditada } from '../components/Imagen'
import { IcoCheck } from '../components/Iconos'
import { useEstado } from '../lib/almacen'
import { avanceDia } from '../lib/progreso'

export function DiaVista({ diaId }: { diaId: number }) {
  const d = obtenerDia(diaId)
  const e = useEstado()
  if (!d) return <Pagina titulo={`Día ${diaId}`} volver="/"><p className="tarjeta p-5">Este día estará disponible pronto.</p></Pagina>
  const av = avanceDia(d, e)
  const pr = e.practica[d.id]
  return (
    <Pagina titulo={`Día ${d.id}`} volver="/">
      <p className="etiqueta">{d.bloque === 'A' ? 'Cardiología general' : d.bloque === 'B' ? 'Cáncer y corazón' : 'Cierre'}</p>
      <h2 className="text-2xl font-semibold mt-2">{d.titulo}</h2>
      <p className="text-suave">{d.subtitulo} · unos {d.minutos} minutos</p>

      <details className="tarjeta p-4 mt-4">
        <summary className="font-semibold cursor-pointer min-h-8">Lo que aprenderá hoy</summary>
        <ul className="mt-2 list-disc pl-5 space-y-1">{d.objetivos.map((o) => <li key={o}>{o}</li>)}</ul>
      </details>

      <h3 className="text-lg font-semibold mt-6 mb-2">Lecciones ({av.hechas}/{av.total})</h3>
      <ol className="space-y-2">
        {d.lecciones.map((l, k) => {
          const hecha = e.leccionesHechas.includes(l.id)
          return (
            <li key={l.id}>
              <a href={`#/dia/${d.id}/leccion/${l.id}`} className="tarjeta flex items-center gap-3 p-4 no-underline text-tinta hover:bg-verde-50">
                <span className={`w-9 h-9 shrink-0 rounded-full grid place-items-center font-bold ${hecha ? 'bg-verde-700 text-white' : 'bg-verde-50 text-verde-900'}`}>
                  {hecha ? <IcoCheck className="w-5 h-5" /> : k + 1}
                </span>
                <span className="flex-1"><span className="font-semibold block">{l.titulo}</span><span className="text-sm text-suave">{l.tarjetas.length} tarjetas · {l.minutos} min</span></span>
              </a>
            </li>
          )
        })}
      </ol>

      <a href={`#/dia/${d.id}/practica`} className="btn btn-primario w-full mt-5 no-underline">
        Práctica del día{pr ? ` · último: ${pr.ultimo} de ${pr.total}` : ''}
      </a>
      <p className="text-xs text-suave text-center mt-1">El puntaje es solo una referencia: no aprueba ni reprueba.</p>
      {d.id === 7 && (
        <div className="grid gap-2 mt-4">
          <a href="#/caso" className="btn btn-secundario w-full no-underline">Abrir el caso integrador</a>
          <a href="#/derivar" className="btn btn-secundario w-full no-underline text-alerta">Ver la tarjeta Cuándo derivar</a>
        </div>
      )}

      <h3 className="text-lg font-semibold mt-6 mb-2">Escuchar</h3>
      <Audio audio={d.audio} />

      <h3 className="text-lg font-semibold mt-6 mb-2">{d.resumen.titulo}</h3>
      <div className="tarjeta p-4">
        <ul className="space-y-2">{d.resumen.puntos.map((p) => <li key={p} className="flex gap-2"><IcoCheck className="w-5 h-5 shrink-0 text-verde-500 mt-0.5" />{p}</li>)}</ul>
        <ImagenCreditada id={d.resumen.imagen} className="mt-4" />
      </div>
      <Fuentes ids={d.fuentes} />
    </Pagina>
  )
}
