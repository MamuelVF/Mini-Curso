import { useEffect } from 'react'
import { coincide, useRuta } from './lib/ruta'
import { Inicio } from './features/Inicio'
import { DiaVista } from './features/DiaVista'
import { Leccion } from './features/Leccion'
import { Practica } from './features/Practica'
import { Repaso } from './features/Repaso'
import { Glosario } from './features/Glosario'
import { Acerca, CasoVista, CuandoDerivar, Diagramas, FuentesPagina, Galeria, GuiaDosis, Mas, Progreso } from './features/Paginas'

export default function App() {
  const ruta = useRuta()
  useEffect(() => { document.getElementById('contenido')?.focus?.() }, [ruta])
  let m
  if ((m = coincide('/dia/:d/leccion/:l', ruta))) return <Leccion key={m.l} diaId={Number(m.d)} leccionId={m.l} />
  if ((m = coincide('/dia/:d/practica', ruta))) return <Practica key={m.d} diaId={Number(m.d)} />
  if ((m = coincide('/dia/:d', ruta))) return <DiaVista diaId={Number(m.d)} />
  if ((m = coincide('/diagramas/:id', ruta))) return <Diagramas id={m.id} />
  if (coincide('/diagramas', ruta)) return <Diagramas />
  if (coincide('/repaso', ruta)) return <Repaso />
  if (coincide('/glosario', ruta)) return <Glosario />
  if (coincide('/mas', ruta)) return <Mas />
  if (coincide('/derivar', ruta)) return <CuandoDerivar />
  if (coincide('/dosis', ruta)) return <GuiaDosis />
  if (coincide('/caso', ruta)) return <CasoVista />
  if (coincide('/galeria', ruta)) return <Galeria />
  if (coincide('/progreso', ruta)) return <Progreso />
  if (coincide('/fuentes', ruta)) return <FuentesPagina />
  if (coincide('/acerca', ruta)) return <Acerca />
  return <Inicio />
}
