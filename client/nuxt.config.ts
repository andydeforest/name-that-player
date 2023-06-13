// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      titleTemplate: (titleChunk) => {
        return titleChunk ? `${titleChunk} | Nuxt 3 Starter` : 'Nuxt 3 Starter';
      },
      meta: [
        { name: 'description', content: 'A Nuxt 3 starter template' },
        { hid: 'og-type', property: 'og:type', content: 'website' },
        { hid: 'og-title', property: 'og:title', content: 'Flagle' },
        { hid: 'og-desc', property: 'og:description', content: 'A Nuxt 3 starter template' },
        { hid: 'og-image', property: 'og:image', content: '/meta.jpg' }
      ],
      link: [{ rel: 'icon', type: 'image/png', href: 'favicon.png' }]
    },
    pageTransition: { name: 'page', mode: 'out-in' }
  },
  css: [
    '@fortawesome/fontawesome-svg-core/styles.css',
    '@/assets/scss/app.scss'
  ],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          sourceMap: true,
          additionalData: '@import "~/assets/scss/mixins.scss"; @import "~/assets/scss/settings.scss";'
        }
      }
    }
  },
  modules: [
    '@element-plus/nuxt',
    '@nuxtjs/device',
    '@nuxtjs/google-fonts',
    [
      '@pinia/nuxt', {
        autoImports: ['defineStore', 'acceptHMRUpdate']

      }
    ]
  ],
  googleFonts: {
    families: {
      Inter: [400, 600, 700, 800],
      Raleway: [400, 600, 700, 800]
    },
    display: 'swap'
  },
  alias: {
    pinia: '/node_modules/@pinia/nuxt/node_modules/pinia/dist/pinia.mjs'
  },
  imports: {
    dirs: ['stores']
  },
  runtimeConfig: {
    public: {
      baseURL: process.env.BASE_URL || 'http://localhost:3000'
    }
  }
});
