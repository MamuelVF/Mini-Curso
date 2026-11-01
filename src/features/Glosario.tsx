import { useState } from 'react'
import { glosario } from '../content'
import { Pagina } from '../components/Layout'
import { Fuentes } from '../components/Fuentes'

const normalizar = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()

export function Glosario() {
  const [q, setQ] = useState('')
  const n = normalizar(q)
  const lista = glosario.filter((g) => !n || normalizar(g.termino).includes(n) || normalizar(g.definicion).includes(n))
  return (
    <Pagina titulo="Glosario">
      <label className="block">
        <span className="sr-only">Buscar término</span>
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar término…"
          className="w-full min-h-12 px-4 rounded-xl border-2 border-linea bg-papel" />
      </label>
      <p className="text-sm text-suave mt-2">{lista.length} términos</p>
      <dl className="mt-3 space-y-3">
        {lista.map((g) => (
          <div key={g.termino} className="tarjeta p-4">
            <dt className="font-serif font-semibold text-verde-900 text-lg">{g.termino} <span className="etiqueta ml-1 align-middle">Día {g.dia}</span></dt>
            <dd className="mt-1">{g.definicion}<Fuentes ids={g.fuentes} /></dd>
          </div>
        ))}
      </dl>
    </Pagina>
  )
}
