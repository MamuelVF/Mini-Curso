// Iconos simples en SVG (sin librerías).
type P = { className?: string }
const base = (d: React.ReactNode, c?: string) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" className={c ?? 'w-6 h-6'} aria-hidden="true">{d}</svg>
)
export const IcoInicio = ({ className }: P) => base(<><path d="M3 11l9-7 9 7" /><path d="M5 10v10h14V10" /></>, className)
export const IcoRepaso = ({ className }: P) => base(<><rect x="3" y="6" width="14" height="12" rx="2" /><path d="M7 3h12a2 2 0 0 1 2 2v11" /></>, className)
export const IcoGlosario = ({ className }: P) => base(<><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" /><path d="M4 19V5" /><path d="M9 8h6" /></>, className)
export const IcoMas = ({ className }: P) => base(<><circle cx="5" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="19" cy="12" r="1.5" /></>, className)
export const IcoAtras = ({ className }: P) => base(<path d="M15 5l-7 7 7 7" />, className)
export const IcoCheck = ({ className }: P) => base(<path d="M5 12l5 5 9-10" />, className)
export const IcoLlama = ({ className }: P) => base(<path d="M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-9z" />, className)
export const IcoAlerta = ({ className }: P) => base(<><path d="M12 3l10 18H2z" /><path d="M12 10v5" /><path d="M12 18h.01" /></>, className)
export const IcoHoja = ({ className }: P) => base(<><path d="M5 19c0-9 6-14 15-14 0 9-5 15-14 15" /><path d="M5 19l8-8" /></>, className)
export const IcoAudio = ({ className }: P) => base(<><path d="M4 10v4h4l5 4V6L8 10z" /><path d="M16 9a4 4 0 0 1 0 6" /></>, className)
export const IcoPlay = ({ className }: P) => base(<path d="M7 5l12 7-12 7z" />, className)
export const IcoPausa = ({ className }: P) => base(<><path d="M8 5v14" /><path d="M16 5v14" /></>, className)
export const IcoLibro = ({ className }: P) => base(<><path d="M12 6c-2-1.5-5-2-8-2v14c3 0 6 .5 8 2 2-1.5 5-2 8-2V4c-3 0-6 .5-8 2z" /><path d="M12 6v14" /></>, className)
export const IcoCorazon = ({ className }: P) => base(<path d="M12 20s-7-4.5-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.5-9 9-9 9z" />, className)
