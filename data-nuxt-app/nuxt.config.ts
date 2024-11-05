// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['~/assets/css/main.css'],
  nitro: {
    experimental: {
      openAPI: true,
    },
    routeRules: {
      '/api/**': {
        cors: true,
      },
    },
  },
  devtools: { enabled: true },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  modules: [
    '@nuxt/fonts',
    '@pinia/nuxt',
    '@nuxt/ui',
    '@nuxt/icon',
    'nuxt-openapi-docs-module',
    [
      'nuxt-openapi-docs-module',
      {
        folder: './docs',
        name: 'Api Docs',
        debug: true,
        list: true,
      }
    ]
  ],

  future: {
    compatibilityVersion: 4,
  },

  experimental: {
    sharedPrerenderData: false,
    compileTemplate: true,
    resetAsyncDataToUndefined: true,
    templateUtils: true,
    relativeWatchPaths: true,
    defaults: {
      useAsyncData: {
        deep: true
      }
    }
  },

  unhead: {
    renderSSRHeadOptions: {
      omitLineBreaks: false
    }
  },
  app: {
    baseURL: '/data-nuxt-app/',
    cdnURL: 'http://localhost/data-nuxt-app/',
  },

  compatibilityDate: '2024-09-27'
})