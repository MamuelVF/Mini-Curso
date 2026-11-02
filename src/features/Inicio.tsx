import { dias, flashcards, TOTAL_DIAS } from '../content'
import { Pagina } from '../components/Layout'
import { IcoAlerta, IcoCheck, IcoCorazon, IcoLlama } from '../components/Iconos'
import { useEstado } from '../lib/almacen'
import { avanceDia, rachaVisible, siguienteLeccion } from '../lib/progreso'
import { sesionDeHoy } from '../lib/repaso'
import { hoyISO } from '../lib/fechas'

const TITULOS = ['El corazón y la circulación', 'Presión arterial y aterosclerosis', 'Insuficiencia cardiaca, arritmias y prevención',
  'Biología del cáncer', 'Cardio-oncología', 'Coagulación, plantas e interacciones', 'Caso integrador y cuándo derivar']

export function Inicio() {
  const e = useEstado()
  const totalLecciones = dias.reduce((n, d) => n + d.lecciones.length, 0)
  const hechas = e.leccionesHechas.length
  const pct = totalLecciones ? Math.round((hechas / totalLecciones) * 100) : 0
  const sig = siguienteLeccion(dias, e)
  const empezados = dias.filter((d) => d.lecciones.some((l) => e.leccionesHechas.includes(l.id))).map((d) => d.id)
  const nuevasYa = e.nuevasHoy.fecha === hoyISO() ? e.nuevasHoy.cantidad : 0
  const repasoHoy = sesionDeHoy(flashcards, empezados, e.fsrs, nuevasYa).length
  const racha = rachaVisible(e.racha)

  return (
    <Pagina>
      <header className="pt-2">
        <p className="text-sm text-suave flex items-center gap-1"><IcoCorazon className="w-4 h-4" /> Microcurso de 7 días</p>
        <h1 className="text-3xl font-semibold mt-1">Plantas, corazón y cáncer</h1>
        <p className="text-suave">Las plantas medicinales en el cuidado del corazón y frente al cáncer, explicadas de forma sencilla y visual.</p>
      </header>

      <section className="grid grid-cols-2 gap-3 mt-5" aria-label="Tu avance">
        <div className="tarjeta p-4">
          <p className="text-sm text-suave">Avance</p>
          <p className="text-3xl font-serif font-semibold text-verde-700">{pct}%</p>
          <div className="h-2 rounded-full bg-linea mt-2" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Avance del curso">
            <div className="h-2 rounded-full bg-verde-500" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <div className="tarjeta p-4">
          <p className="text-sm text-suave">Racha diaria</p>
          <p className="text-3xl font-serif font-semibold text-tierra flex items-center gap-1"><IcoLlama className="w-7 h-7" />{racha}</p>
          <p className="text-xs text-suave mt-1">{racha === 1 ? 'día seguido' : 'días seguidos'}</p>
        </div>
      </section>

      {sig ? (
        <a href={`#/dia/${sig.dia.id}/leccion/${sig.leccion.id}`} className="btn btn-primario w-full mt-4 no-underline !min-h-14 text-lg">
          {hechas ? 'Continuar' : 'Empezar'} · Día {sig.dia.id}: {sig.leccion.titulo}
        </a>
      ) : (
        <p className="tarjeta p-4 mt-4 text-center">¡Ha completado todas las lecciones disponibles!</p>
      )}
      {repasoHoy > 0 && (
        <a href="#/repaso" className="btn btn-secundario w-full mt-3 no-underline">Repaso de hoy · {repasoHoy} tarjetas</a>
      )}

      <h2 className="text-xl font-semibold mt-7 mb-2">Los 7 días</h2>
      <ol className="space-y-2">
        {Array.from({ length: TOTAL_DIAS }, (_, k) => k + 1).map((n) => {
          const d = dias.find((x) => x.id === n)
          const av = d ? avanceDia(d, e) : null
          const contenido = (
            <>
              <span className={`w-10 h-10 shrink-0 rounded-full grid place-items-center font-bold ${av?.completo ? 'bg-verde-700 text-white' : 'bg-verde-50 text-verde-900'}`}>
                {av?.completo ? <IcoCheck className="w-5 h-5" /> : n}
              </span>
              <span className="flex-1">
                <span className="block font-semibold">{d?.titulo ?? TITULOS[n - 1]}</span>
                <span className="text-sm text-suave">{d ? `${av!.hechas}/${av!.total} lecciones` : 'Próximamente'}</span>
              </span>
            </>
          )
          return (
            <li key={n}>
              {d ? <a href={`#/dia/${n}`} className="tarjeta flex items-center gap-3 p-3 no-underline text-tinta hover:bg-verde-50">{contenido}</a>
                : <div className="tarjeta flex items-center gap-3 p-3 opacity-60">{contenido}</div>}
            </li>
          )
        })}
      </ol>

      <a href="#/derivar" className="tarjeta flex items-center gap-3 p-4 mt-6 no-underline bg-alerta-50 border-alerta/30 text-alerta">
        <IcoAlerta /> <span className="font-semibold">Cuándo derivar: señales de alarma</span>
      </a>
      <p className="text-xs text-suave mt-5">
        Curso educativo, no clínico. No sustituye la atención médica ni orienta tratamientos. <a href="#/acerca">Más información</a>
      </p>
    </Pagina>
  )
}
