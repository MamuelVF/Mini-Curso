import { useState } from 'react'
import { imagen } from '../content'

/** Imagen con su crédito y licencia siempre visibles. Si aún no existe o no carga, no muestra nada. */
export function ImagenCreditada({ id, className = '' }: { id?: string; className?: string }) {
  const img = imagen(id)
  const [falla, setFalla] = useState(false)
  if (!img || falla) return null
  const src = `${import.meta.env.BASE_URL}${img.archivo}`
  return (
    <figure className={className}>
      <img src={src} alt={img.alt} loading="lazy" decoding="async" onError={() => setFalla(true)} className="w-full rounded-xl bg-verde-50" />
      <figcaption className="mt-1 text-xs text-suave">
        {img.origen === 'ia' && <span className="etiqueta mr-1 !normal-case">Generada con IA</span>}
        {img.origen === 'notebooklm' && <span className="etiqueta mr-1 !normal-case">NotebookLM</span>}
        {img.urlOrigen ? <a href={img.urlOrigen} target="_blank" rel="noopener noreferrer">{img.titulo}</a> : img.titulo}
        {' · '}{img.autor}{' · '}
        {img.urlLicencia ? <a href={img.urlLicencia} target="_blank" rel="noopener noreferrer">{img.licencia}</a> : img.licencia}
      </figcaption>
    </figure>
  )
}
