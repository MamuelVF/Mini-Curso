// Genera los iconos PNG de la PWA a partir del SVG (usa el Chromium de Playwright).
;(async () => {
const { chromium } = require('playwright')
const { readFileSync } = require('node:fs')
const svg = readFileSync('public/icons/favicon.svg', 'utf8')
const navegador = await chromium.launch()
const pagina = await navegador.newPage()
for (const [nombre, tam, relleno] of [['icon-192', 192, 0], ['icon-512', 512, 0], ['icon-512-maskable', 512, 0.12]]) {
  await pagina.setViewportSize({ width: tam, height: tam })
  const p = Math.round(tam * relleno)
  await pagina.setContent(`<body style="margin:0;background:#2f5d3f"><div style="padding:${p}px;width:${tam - 2 * p}px;height:${tam - 2 * p}px">${svg.replace('<svg ', '<svg width="100%" height="100%" ')}</div></body>`)
  await pagina.screenshot({ path: `public/icons/${nombre}.png`, omitBackground: false })
}
await navegador.close()
console.log('iconos listos')
})()
