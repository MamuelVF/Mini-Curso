import { useState } from 'react'
import derivar from '../content/derivar.json'
import dosis from '../content/dosis.json'
import { caso, dias, fuentes, imagenes } from '../content'
import { Pagina } from '../components/Layout'
import { Fuentes } from '../components/Fuentes'
import { ImagenCreditada } from '../components/Imagen'
import { IcoAlerta } from '../components/Iconos'
import { DIAGRAMAS, Diagrama } from '../diagramas'
import { actualizar, exportarProgreso, importarProgreso, reiniciarProgreso, useEstado } from '../lib/almacen'
import { avanceDia, rachaVisible } from '../lib/progreso'
import type { IdDiagrama } from '../lib/tipos'

export function Mas() {
  const enlaces = [
    ['#/dosis', 'Guía de dosis', 'Cuánto se usa de cada planta principal'],
    ['#/derivar', 'Cuándo derivar', 'Señales de alarma'],
    ['#/diagramas', 'Diagramas interactivos', 'Ciclo cardiaco, circulación, presión…'],
    ['#/caso', 'Caso integrador', 'Decisiones paso a paso (día 7)'],
    ['#/galeria', 'Galería de imágenes', 'Con autor y licencia'],
    ['#/progreso', 'Mi progreso', 'Lecciones, práctica y racha'],
    ['#/fuentes', 'Fuentes', 'Todas las referencias del curso'],
    ['#/acerca', 'Acerca del curso', 'Créditos y descargo'],
  ]
  return (
    <Pagina titulo="Más">
      <ul className="space-y-2">
        {enlaces.map(([h, t, s]) => (
          <li key={h}><a href={h} className="tarjeta block p-4 no-underline text-tinta hover:bg-verde-50"><span className="font-semibold block">{t}</span><span className="text-sm text-suave">{s}</span></a></li>
        ))}
      </ul>
    </Pagina>
  )
}

export function GuiaDosis() {
  const [abierta, setAbierta] = useState<string | null>(null)
  return (
    <Pagina titulo="Guía de dosis" volver="/mas">
      <p className="text-suave">{dosis.introduccion}</p>
      <ul className="mt-4 space-y-3">
        {dosis.plantas.map((p) => {
          const ver = abierta === p.id
          return (
            <li key={p.id} className="tarjeta overflow-hidden">
              <button className="w-full text-left p-4 flex gap-3 items-center min-h-11" onClick={() => setAbierta(ver ? null : p.id)} aria-expanded={ver}>
                <MiniFoto id={p.imagen} />
                <span className="flex-1 min-w-0">
                  <span className="font-semibold block">{p.nombre} <i className="font-normal text-suave">{p.cientifico}</i></span>
                  <span className="text-sm block mt-0.5">{p.referencia}</span>
                  <span className="text-xs text-suave block mt-0.5">{p.parte} · día {p.dia}</span>
                </span>
                <span aria-hidden className={`text-suave transition-transform ${ver ? 'rotate-90' : ''}`}>›</span>
              </button>
              {ver && (
                <div className="px-4 pb-4">
                  <ImagenCreditada id={p.imagen} className="mb-3" />
                  <h3 className="font-semibold">Lo que dicen las fuentes</h3>
                  <ul className="list-disc pl-5 mt-1 space-y-1">{p.puntos.map((x) => <li key={x.texto}>{x.texto} <span className="font-mono text-xs text-suave">{x.fuentes.join(', ')}</span></li>)}</ul>
                  {'ojo' in p && p.ojo && (
                    <p className="mt-3 p-3 rounded-xl bg-alerta-50 text-sm"><b className="text-alerta">Ojo:</b> {p.ojo.texto} <span className="font-mono text-xs text-suave">{p.ojo.fuentes.join(', ')}</span></p>
                  )}
                  <Fuentes ids={p.fuentes} />
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </Pagina>
  )
}

/** Foto pequeña de la planta para la lista (sin crédito: el crédito se ve al abrir la ficha). */
function MiniFoto({ id }: { id: string }) {
  const img = imagenes.find((i) => i.id === id)
  if (!img) return null
  return <img src={`${import.meta.env.BASE_URL}${img.archivo}`} alt="" loading="lazy" onError={(e) => { e.currentTarget.style.visibility = 'hidden' }} className="w-14 h-14 rounded-xl object-cover shrink-0 bg-verde-50" />
}

export function CuandoDerivar() {
  return (
    <Pagina titulo="Cuándo derivar" volver="/mas">
      <div className="tarjeta p-4 bg-alerta-50 border-alerta/30 flex gap-3">
        <IcoAlerta className="w-7 h-7 shrink-0 text-alerta" />
        <p className="font-semibold text-alerta">{derivar.introduccion}</p>
      </div>
      {derivar.grupos.map((g) => (
        <section key={g.titulo} className="tarjeta p-4 mt-4">
          <h2 className="text-lg font-semibold">{g.titulo}</h2>
          <ul className="list-disc pl-5 mt-2 space-y-1">{g.senales.map((s) => <li key={s}>{s}</li>)}</ul>
          {'nota' in g && g.nota && <p className="text-sm text-suave mt-2">{g.nota}</p>}
          <Fuentes ids={g.fuentes} />
        </section>
      ))}
    </Pagina>
  )
}

export function Diagramas({ id }: { id?: string }) {
  if (id) {
    const d = DIAGRAMAS.find((x) => x.id === id)
    return <Pagina titulo={d?.titulo ?? 'Diagrama'} volver="/diagramas"><Diagrama id={id as IdDiagrama} /></Pagina>
  }
  return (
    <Pagina titulo="Diagramas interactivos" volver="/mas">
      <ul className="space-y-2">
        {DIAGRAMAS.map((d) => (
          <li key={d.id}>
            {d.listo ? <a href={`#/diagramas/${d.id}`} className="tarjeta block p-4 no-underline text-tinta hover:bg-verde-50"><span className="font-semibold">{d.titulo}</span><span className="block text-sm text-suave">Día {d.dia}</span></a>
              : <div className="tarjeta p-4 opacity-60"><span className="font-semibold">{d.titulo}</span><span className="block text-sm text-suave">Día {d.dia} · próximamente</span></div>}
          </li>
        ))}
      </ul>
    </Pagina>
  )
}

export function Galeria() {
  return (
    <Pagina titulo="Galería" volver="/mas">
      <p className="text-suave">Cada imagen muestra su autor, licencia y enlace de origen. Las ilustraciones generadas con IA están marcadas y no se usan como fuente de anatomía exacta.</p>
      {imagenes.length === 0 ? <p className="tarjeta p-5 mt-4">Las imágenes se están preparando.</p> : (
        <div className="grid gap-4 mt-4">{imagenes.map((i) => <ImagenCreditada key={i.id} id={i.id} className="tarjeta p-3" />)}</div>
      )}
    </Pagina>
  )
}

export function Progreso() {
  const e = useEstado()
  const [msg, setMsg] = useState('')
  const descargar = () => {
    const url = URL.createObjectURL(new Blob([exportarProgreso()], { type: 'application/json' }))
    const a = document.createElement('a')
    a.href = url
    a.download = 'progreso-curso-corazon.json'
    a.click()
    URL.revokeObjectURL(url)
  }
  const cargar = async (f?: File) => {
    if (!f) return
    setMsg(importarProgreso(await f.text()) ? 'Progreso cargado.' : 'El archivo no es válido.')
  }
  return (
    <Pagina titulo="Mi progreso" volver="/mas">
      <div className="grid grid-cols-2 gap-3">
        <div className="tarjeta p-4"><p className="text-sm text-suave">Racha actual</p><p className="text-3xl font-serif text-tierra">{rachaVisible(e.racha)}</p></div>
        <div className="tarjeta p-4"><p className="text-sm text-suave">Mejor racha</p><p className="text-3xl font-serif text-tierra">{e.racha.mejor}</p></div>
      </div>
      <h2 className="text-lg font-semibold mt-6 mb-2">Por día</h2>
      <ul className="space-y-2">
        {dias.map((d) => {
          const av = avanceDia(d, e)
          const p = e.practica[d.id]
          return (
            <li key={d.id} className="tarjeta p-4">
              <p className="font-semibold">Día {d.id}: {d.titulo}</p>
              <p className="text-sm text-suave">Lecciones {av.hechas}/{av.total} · Práctica (referencia): {p ? `último ${p.ultimo}/${p.total}, mejor ${p.mejor}/${p.total}` : 'sin hacer'}</p>
            </li>
          )
        })}
      </ul>
      <p className="text-sm text-suave mt-3">Tarjetas de repaso vistas: {Object.keys(e.fsrs).length}</p>
      <h2 className="text-lg font-semibold mt-6 mb-2">Sus datos</h2>
      <p className="text-sm text-suave">Tu progreso se guarda solo en este dispositivo. No se envía a ningún servidor.</p>
      <div className="grid gap-2 mt-3">
        <button className="btn btn-secundario" onClick={descargar}>Guardar copia del progreso</button>
        <label className="btn btn-secundario">Cargar copia del progreso<input type="file" accept="application/json" className="sr-only" onChange={(ev) => cargar(ev.target.files?.[0])} /></label>
        <button className="btn btn-secundario text-alerta" onClick={() => { if (confirm('¿Borrar todo el progreso de este dispositivo?')) reiniciarProgreso() }}>Borrar mi progreso</button>
      </div>
      {msg && <p role="status" className="mt-2">{msg}</p>}
    </Pagina>
  )
}

export function FuentesPagina() {
  return (
    <Pagina titulo="Fuentes" volver="/mas">
      <p className="text-suave">Todo el contenido se basa en estas fuentes, consultadas el 1 de noviembre de 2026. Las guías clínicas se actualizan: verifique siempre la versión vigente.</p>
      <ul className="mt-4 space-y-2 text-sm">
        {fuentes.map((f) => (
          <li key={f.id} className="tarjeta p-3"><span className="font-mono text-xs mr-2">{f.id}</span><a href={f.url} target="_blank" rel="noopener noreferrer">{f.titulo}</a></li>
        ))}
      </ul>
    </Pagina>
  )
}

export function Acerca() {
  return (
    <Pagina titulo="Acerca del curso" volver="/mas">
      <section className="tarjeta p-4 bg-alerta-50 border-alerta/30">
        <h2 className="text-lg font-semibold text-alerta">Descargo</h2>
        <p className="mt-1">Este curso es educativo. Las dosis de la Guía de dosis son cantidades de referencia tomadas de monografías oficiales, estudios en personas y uso tradicional, cada una con su fuente.</p>
      </section>
      <section className="tarjeta p-4 mt-4">
        <h2 className="text-lg font-semibold">Para quién es</h2>
        <p className="mt-1">Diseñado para el Biólogo Naturista Samuel Vinces Zamora (<a href="https://biovinces.com" target="_blank" rel="noopener noreferrer">biovinces.com</a>), con más de 30 años en fitoterapia clínica en Guayaquil, Ecuador, como proyecto de portafolio y con su autorización.</p>
      </section>
      <section className="tarjeta p-4 mt-4">
        <h2 className="text-lg font-semibold">Cómo está hecho</h2>
        <ul className="list-disc pl-5 mt-1 space-y-1">
          <li>Basado en la ciencia del aprendizaje: una idea por tarjeta, preguntas antes de explicar, repaso espaciado con FSRS y temas mezclados.</li>
          <li>Contenido redactado con ayuda de Claude a partir de guías clínicas y fuentes institucionales, todas citadas.</li>
          <li>Audios e infografías generados con NotebookLM a partir de las mismas fuentes y revisados antes de publicarse.</li>
          <li>Las ilustraciones generadas con IA están marcadas como tales.</li>
        </ul>
      </section>
      <section className="tarjeta p-4 mt-4">
        <h2 className="text-lg font-semibold">Privacidad</h2>
        <p className="mt-1">La aplicación no pide ni guarda datos personales ni de salud. El progreso queda solo en tu dispositivo.</p>
      </section>
      <p className="text-sm text-suave mt-4"><a href="#/fuentes">Ver todas las fuentes</a> · <a href="#/galeria">Créditos de imágenes</a></p>
    </Pagina>
  )
}

export function CasoVista() {
  const e = useEstado()
  const [id, setId] = useState(caso.inicio)
  const [elegida, setElegida] = useState<number | null>(null)
  const [seguras, setSeguras] = useState(0)
  const [pasos, setPasos] = useState(0)
  const nodo = caso.nodos.find((n) => n.id === id)!
  const reiniciar = () => { setId(caso.inicio); setElegida(null); setSeguras(0); setPasos(0) }
  return (
    <Pagina titulo={caso.titulo} volver="/mas">
      {id === caso.inicio && elegida === null && <p className="text-suave mb-3">{caso.introduccion}</p>}
      <div className="tarjeta p-5">
        <p className="text-[1.05rem]">{nodo.texto}</p>
        {nodo.opciones && (
          <div className="grid gap-2 mt-4">
            {nodo.opciones.map((o, k) => (
              <button key={o.texto} disabled={elegida !== null}
                onClick={() => { setElegida(k); setPasos(pasos + 1); if (o.segura) setSeguras(seguras + 1) }}
                className={`text-left min-h-12 px-4 py-3 rounded-xl border-2 bg-papel ${elegida === k ? (o.segura ? 'border-ok bg-verde-50' : 'border-alerta bg-alerta-50') : 'border-linea'}`}>
                {o.texto}
              </button>
            ))}
          </div>
        )}
        {elegida !== null && nodo.opciones && (
          <div role="status" className="mt-3">
            <p className={`font-semibold ${nodo.opciones[elegida].segura ? 'text-ok' : 'text-alerta'}`}>{nodo.opciones[elegida].segura ? 'Decisión segura' : 'Hay una opción más segura'}</p>
            <p className="mt-1">{nodo.opciones[elegida].explicacion}</p>
            <button className="btn btn-primario w-full mt-3" onClick={() => { setId(nodo.opciones![elegida].siguiente); setElegida(null) }}>Continuar</button>
          </div>
        )}
        <Fuentes ids={nodo.fuentes} />
      </div>
      {nodo.final && (
        <div className="mt-4">
          {pasos > 0 && <p className="tarjeta p-4 text-center">Decisiones seguras (referencia): <strong>{seguras} de {pasos}</strong></p>}
          <button className="btn btn-secundario w-full mt-3" onClick={() => { reiniciar(); if (!e.casoTerminado) actualizar((s) => ({ ...s, casoTerminado: true })) }}>Volver a empezar el caso</button>
        </div>
      )}
    </Pagina>
  )
}
