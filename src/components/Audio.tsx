import { useRef, useState } from 'react'
import type { Dia } from '../lib/tipos'
import { IcoAudio, IcoPausa, IcoPlay } from './Iconos'

/** Reproductor del resumen tipo podcast (archivo local en public/audio/). */
export function Audio({ audio }: { audio: Dia['audio'] }) {
  const ref = useRef<HTMLAudioElement>(null)
  const [sonando, setSonando] = useState(false)
  const [t, setT] = useState(0)
  const [dur, setDur] = useState(0)
  const [velocidad, setVelocidad] = useState(1)
  const [error, setError] = useState(false)

  if (audio.estado !== 'listo' || error) {
    return (
      <div className="tarjeta p-4 flex items-center gap-3 text-suave">
        <IcoAudio /> <span>{audio.titulo}: en preparación.</span>
      </div>
    )
  }
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
  const alternar = () => {
    const a = ref.current!
    if (a.paused) a.play().catch(() => setError(true))
    else a.pause()
  }
  const cambiarVelocidad = () => {
    const v = velocidad === 1 ? 1.25 : velocidad === 1.25 ? 1.5 : 1
    setVelocidad(v)
    if (ref.current) ref.current.playbackRate = v
  }
  return (
    <div className="tarjeta p-4">
      <p className="font-semibold text-verde-900 flex items-center gap-2"><IcoAudio className="w-5 h-5" />{audio.titulo}</p>
      <p className="text-xs text-suave">Generado con {audio.origen} a partir de las fuentes del curso y revisado.</p>
      <audio ref={ref} src={`${import.meta.env.BASE_URL}${audio.archivo}`} preload="metadata"
        onPlay={() => setSonando(true)} onPause={() => setSonando(false)} onError={() => setError(true)}
        onTimeUpdate={(e) => setT(e.currentTarget.currentTime)} onLoadedMetadata={(e) => setDur(e.currentTarget.duration)} />
      <div className="flex items-center gap-3 mt-3">
        <button className="btn btn-primario !rounded-full !w-12 !h-12 !p-0" onClick={alternar} aria-label={sonando ? 'Pausar' : 'Reproducir'}>
          {sonando ? <IcoPausa /> : <IcoPlay />}
        </button>
        <input type="range" min={0} max={dur || 0} step={1} value={t} aria-label="Posición"
          onChange={(e) => { if (ref.current) ref.current.currentTime = Number(e.target.value) }}
          className="flex-1 accent-verde-700" />
        <button className="btn btn-secundario !min-h-11 !px-2 text-sm" onClick={cambiarVelocidad} aria-label="Velocidad">{velocidad}×</button>
      </div>
      <p className="text-xs text-suave mt-1 text-right">{fmt(t)} / {fmt(dur)}</p>
    </div>
  )
}
