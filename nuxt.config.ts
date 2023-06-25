// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  rootDir: 'apps/client',
  devServer: {
    port: 3001,
  },
  app: {
    head: {
      title: 'Name That Player',
      meta: [
        {
          name: 'description',
          content: 'A historical baseball guessing game!',
        },
        { hid: 'og-type', property: 'og:type', content: 'website' },
        { hid: 'og-title', property: 'og:title', content: 'Name That Player' },
        {
          hid: 'og-desc',
          property: 'og:description',
          content: 'A historical baseball guessing game!',
        },
        {
          hid: 'og-image',
          property: 'og:image',
          content: 'https://main.d36jjxhupx9f3e.amplifyapp.com/meta.jpg',
        },
      ],
      link: [{ rel: 'icon', type: 'image/png', href: 'favicon.png' }],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },
  css: [
    '@fortawesome/fontawesome-svg-core/styles.css',
    '@/assets/scss/app.scss',
  ],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          sourceMap: true,
          additionalData:
            '@import "~/assets/scss/mixins.scss"; @import "~/assets/scss/settings.scss";',
        },
      },
    },
  },
  modules: [
    '@element-plus/nuxt',
    '@nuxtjs/device',
    '@nuxtjs/google-fonts',
    [
      '@pinia/nuxt',
      {
        autoImports: ['defineStore', 'acceptHMRUpdate'],
      },
    ],
  ],
  googleFonts: {
    families: {
      Inter: [400, 600, 700, 800],
      Raleway: [400, 600, 700, 800],
    },
    display: 'swap',
  },
  device: {
    refreshOnResize: true,
  },
  alias: {
    pinia: '/../../node_modules/@pinia/nuxt/node_modules/pinia/dist/pinia.mjs',
  },
  imports: {
    dirs: ['stores'],
  },
  runtimeConfig: {
    public: {
      baseURL: process.env.BASE_URL || 'http://localhost:3000',
    },
  },
});
