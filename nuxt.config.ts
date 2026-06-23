// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  nitro: {
    preset: 'vercel'
  },
  app: {
    head: {
      viewport: 'width=device-width, initial-scale=1.0',
    }
  }
})
