import { useEffect, useRef, useState } from 'react'
import { dia as obtenerDia } from '../content'
import { Pagina } from '../components/Layout'
import { TarjetaVista } from '../components/TarjetaVista'
import { marcarLeccion } from '../lib/progreso'
import { ir } from '../lib/ruta'

export function Leccion({ diaId, leccionId }: { diaId: number; leccionId: string }) {
  const d = obtenerDia(diaId)
  const l = d?.lecciones.find((x) => x.id === leccionId)
  const [i, setI] = useState(0)
  const inicioX = useRef<number | null>(null)
  const zona = useRef<HTMLDivElement>(null)

  useEffect(() => { zona.current?.focus() }, [i])
  if (!d || !l) return <Pagina titulo="Lección no encontrada" volver="/"><p>No encontramos esta lección.</p></Pagina>

  const total = l.tarjetas.length
  const ultima = i === total - 1
  const idx = d.lecciones.findIndex((x) => x.id === l.id)
  const siguienteLeccion = d.lecciones[idx + 1]

  const avanzar = () => {
    if (!ultima) return setI(i + 1)
    marcarLeccion(l.id)
    ir(siguienteLeccion ? `/dia/${d.id}/leccion/${siguienteLeccion.id}?fin=${l.id}` : `/dia/${d.id}?fin=1`)
    setI(0)
  }
  const retroceder = () => i > 0 && setI(i - 1)

  return (
    <Pagina titulo={l.titulo} volver={`/dia/${d.id}`} sinNav>
      <div className="flex gap-1.5 mb-4" aria-hidden="true">
        {l.tarjetas.map((t, k) => (
          <span key={t.id} className={`h-1.5 flex-1 rounded-full ${k <= i ? 'bg-verde-500' : 'bg-linea'}`} />
        ))}
      </div>
      <p className="sr-only" aria-live="polite">Tarjeta {i + 1} de {total}</p>
      <div ref={zona} tabIndex={-1} className="outline-none"
        onTouchStart={(e) => (inicioX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (inicioX.current === null) return
          const dx = e.changedTouches[0].clientX - inicioX.current
          inicioX.current = null
          if (Math.abs(dx) > 70) dx < 0 ? avanzar() : retroceder()
        }}>
        <TarjetaVista key={l.tarjetas[i].id} t={l.tarjetas[i]} />
      </div>
      <div className="grid grid-cols-2 gap-3 mt-5">
        <button className="btn btn-secundario" onClick={retroceder} disabled={i === 0}>Anterior</button>
        <button className="btn btn-primario" onClick={avanzar}>{ultima ? (siguienteLeccion ? 'Terminar lección' : 'Terminar el día') : 'Siguiente'}</button>
      </div>
      <p className="text-center text-sm text-suave mt-3">{i + 1} de {total} · también puede deslizar</p>
    </Pagina>
  )
}
