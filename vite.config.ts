import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// BASE: ruta en GitHub Pages (https://<usuario>.github.io/curso-cardiologia/).
// Se puede cambiar con la variable de entorno BASE al compilar.
const base = process.env.BASE ?? '/curso-cardiologia/'

export default defineConfig({
  base,
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png', 'icons/*.svg'],
      manifest: {
        name: 'Plantas, corazón y cáncer: lo esencial en 7 días',
        short_name: 'Plantas y corazón',
        description: 'Microcurso de 7 días sobre plantas medicinales para el corazón y frente al cáncer.',
        lang: 'es',
        start_url: base,
        scope: base,
        display: 'standalone',
        background_color: '#f6f5ef',
        theme_color: '#2f5d3f',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Todo el texto, código e imágenes se precargan para funcionar sin conexión.
        globPatterns: ['**/*.{js,css,html,svg,png,webp,jpg,woff2,json}'],
        globIgnores: ['**/*cyrillic*', '**/*vietnamese*', '**/*math*', '**/*symbols*', '**/*greek*'],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        // Los audios pesan: se guardan en caché la primera vez que se escuchan.
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.includes('/audio/') || url.pathname.includes('/video/'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'medios',
              rangeRequests: true,
              cacheableResponse: { statuses: [0, 200] },
              expiration: { maxEntries: 20 },
            },
          },
        ],
      },
    }),
  ],
  test: { environment: 'node' },
})
