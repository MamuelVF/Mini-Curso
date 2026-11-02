import { useMemo, useState } from 'react'
import { dias, flashcards } from '../content'
import { Pagina } from '../components/Layout'
import { Pregunta } from '../components/Pregunta'
import { Fuentes } from '../components/Fuentes'
import { actualizar, useEstado } from '../lib/almacen'
import { hoyISO } from '../lib/fechas'
import { registrarActividad } from '../lib/progreso'
import { barajar, calificar, intervaloTexto, Rating, sesionDeHoy, type Calificacion } from '../lib/repaso'

const botones: { nota: Calificacion; texto: string }[] = [
  { nota: Rating.Again, texto: 'Otra vez' },
  { nota: Rating.Hard, texto: 'Difícil' },
  { nota: Rating.Good, texto: 'Bien' },
  { nota: Rating.Easy, texto: 'Fácil' },
]

export function Repaso() {
  const e = useEstado()
  const empezados = dias.filter((d) => d.lecciones.some((l) => e.leccionesHechas.includes(l.id))).map((d) => d.id)
  const hoy = hoyISO()
  // La cola se fija al abrir la pantalla para que no cambie mientras se repasa.
  const [cola, setCola] = useState(() => sesionDeHoy(flashcards, empezados, e.fsrs, e.nuevasHoy.fecha === hoy ? e.nuevasHoy.cantidad : 0))
  const [volteada, setVolteada] = useState(false)
  const [hechas, setHechas] = useState(0)
  const [mezcla, setMezcla] = useState(false)

  // Entrelazado: preguntas de días anteriores mezcladas.
  const preguntasMezcla = useMemo(() => {
    const anteriores = dias.filter((d) => empezados.includes(d.id)).flatMap((d) => d.practica)
    return barajar(anteriores, Number(hoy.replaceAll('-', ''))).slice(0, 4)
  }, [empezados.join(','), hoy])

  if (!empezados.length) {
    return <Pagina titulo="Repaso"><p className="tarjeta p-5">Las tarjetas de repaso aparecen cuando empieza las lecciones de un día.</p></Pagina>
  }

  const actual = cola[0]
  const calificarActual = (nota: Calificacion) => {
    const esNueva = !e.fsrs[actual.id]
    actualizar((s) => ({
      ...s,
      fsrs: { ...s.fsrs, [actual.id]: calificar(s.fsrs[actual.id], nota) },
      nuevasHoy: esNueva ? { fecha: hoy, cantidad: (s.nuevasHoy.fecha === hoy ? s.nuevasHoy.cantidad : 0) + 1 } : s.nuevasHoy,
    }))
    registrarActividad()
    setHechas(hechas + 1)
    setVolteada(false)
    // "Otra vez" vuelve a poner la tarjeta al final de la sesión de hoy.
    setCola((c) => (nota === Rating.Again ? [...c.slice(1), c[0]] : c.slice(1)))
  }

  if (mezcla) {
    return (
      <Pagina titulo="Preguntas mezcladas" volver="/repaso">
        <p className="text-suave mb-3">Mezclar temas de días distintos ayuda a recordar mejor.</p>
        <div className="space-y-4">{preguntasMezcla.map((p) => <div key={p.id} className="tarjeta p-5"><Pregunta p={p} /></div>)}</div>
      </Pagina>
    )
  }

  return (
    <Pagina titulo="Repaso de hoy">
      {actual ? (
        <>
          <p className="text-sm text-suave mb-3">Quedan {cola.length} · repasadas {hechas}</p>
          <button className="tarjeta w-full min-h-64 p-6 text-left flex flex-col justify-center" onClick={() => setVolteada(true)} aria-label={volteada ? 'Respuesta' : 'Mostrar respuesta'}>
            <span className="etiqueta self-start">Día {actual.dia}</span>
            <span className="block text-xl font-serif font-semibold text-verde-900 mt-3">{actual.frente}</span>
            {volteada ? <span className="block mt-4 text-lg border-t border-linea pt-4">{actual.reverso}</span>
              : <span className="block mt-6 text-sm text-suave">Piensa la respuesta y toca para verla</span>}
          </button>
          {volteada && (
            <>
              <p className="text-sm text-suave mt-4 mb-2 text-center">¿Qué tal la recordó?</p>
              <div className="grid grid-cols-4 gap-2">
                {botones.map((b) => (
                  <button key={b.nota} className={`btn !px-1 !flex-col !gap-0 text-sm ${b.nota === Rating.Good ? 'btn-primario' : 'btn-secundario'}`} onClick={() => calificarActual(b.nota)}>
                    {b.texto}<span className="text-xs font-normal opacity-80">{intervaloTexto(e.fsrs[actual.id], b.nota)}</span>
                  </button>
                ))}
              </div>
              <Fuentes ids={actual.fuentes} />
            </>
          )}
        </>
      ) : (
        <div className="tarjeta p-6 text-center">
          <p className="text-xl font-serif font-semibold text-verde-700">¡Repaso de hoy terminado!</p>
          <p className="text-suave mt-2">La app te mostrará cada tarjeta justo antes de que tiendas a olvidarla.</p>
        </div>
      )}
      {preguntasMezcla.length > 0 && (
        <button className="btn btn-secundario w-full mt-6" onClick={() => setMezcla(true)}>Preguntas mezcladas de días anteriores</button>
      )}
    </Pagina>
  )
}
