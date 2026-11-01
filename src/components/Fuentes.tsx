import { useState } from 'react'
import { fuente } from '../content'

/** Chip "Fuentes" que se despliega con los enlaces. */
export function Fuentes({ ids, abierto = false }: { ids: string[]; abierto?: boolean }) {
  const [ver, setVer] = useState(abierto)
  if (!ids.length) return null
  return (
    <div className="mt-3 text-sm">
      <button className="text-suave underline underline-offset-2 min-h-11" onClick={() => setVer(!ver)} aria-expanded={ver}>
        Fuentes ({ids.length})
      </button>
      {ver && (
        <ul className="mt-1 space-y-1 text-suave">
          {ids.map((id) => {
            const f = fuente(id)
            return (
              <li key={id}>
                <span className="font-mono text-xs mr-1">{id}</span>
                {f ? <a href={f.url} target="_blank" rel="noopener noreferrer">{f.titulo}</a> : 'Fuente no encontrada'}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
