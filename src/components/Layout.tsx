import type { ReactNode } from 'react'
import { ir, rutaActual } from '../lib/ruta'
import { IcoAtras, IcoGlosario, IcoInicio, IcoMas, IcoRepaso } from './Iconos'

export function Pagina({ titulo, volver, children, sinNav }: { titulo?: string; volver?: string; children: ReactNode; sinNav?: boolean }) {
  return (
    <div className="mx-auto max-w-xl min-h-dvh flex flex-col">
      {(titulo || volver) && (
        <header className="sticky top-0 z-10 bg-fondo/95 backdrop-blur border-b border-linea px-4 py-2 flex items-center gap-2">
          {volver && (
            <button className="btn btn-secundario !min-h-11 !px-3" onClick={() => ir(volver)} aria-label="Volver">
              <IcoAtras className="w-5 h-5" />
            </button>
          )}
          {titulo && <h1 className="text-lg font-semibold truncate">{titulo}</h1>}
        </header>
      )}
      <main id="contenido" className={`flex-1 px-4 pt-4 ${sinNav ? 'pb-8' : 'pb-28'}`}>{children}</main>
      {!sinNav && <NavInferior />}
    </div>
  )
}

const enlaces = [
  { ruta: '/', texto: 'Inicio', Icono: IcoInicio },
  { ruta: '/repaso', texto: 'Repaso', Icono: IcoRepaso },
  { ruta: '/glosario', texto: 'Glosario', Icono: IcoGlosario },
  { ruta: '/mas', texto: 'Más', Icono: IcoMas },
]

function NavInferior() {
  const actual = rutaActual()
  return (
    <nav aria-label="Navegación principal" className="fixed bottom-0 inset-x-0 z-20 bg-papel/95 backdrop-blur border-t border-linea pb-[env(safe-area-inset-bottom)]">
      <ul className="mx-auto max-w-xl grid grid-cols-4">
        {enlaces.map(({ ruta, texto, Icono }) => {
          const activo = ruta === '/' ? actual === '/' : actual.startsWith(ruta)
          return (
            <li key={ruta}>
              <a href={`#${ruta}`} aria-current={activo ? 'page' : undefined}
                className={`flex flex-col items-center gap-0.5 py-2 min-h-14 text-xs font-medium no-underline ${activo ? 'text-verde-700' : 'text-suave'}`}>
                <Icono />
                {texto}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
