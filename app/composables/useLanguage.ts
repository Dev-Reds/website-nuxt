import { en, de } from '~/utils/translations'

const locale = ref<'en' | 'de'>('en')

export function useLanguage() {
  onMounted(() => {
    locale.value = window.location.hostname === 'namibiareferatgeo.vercel.app' ? 'de' : 'en'
  })

  function t(key: string, params?: Record<string, string | number>): string {
    const dict = locale.value === 'de' ? de : en
    let text = dict[key] || key
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        text = text.replace(`{${k}}`, String(v))
      }
    }
    return text
  }

  return { t, locale }
}
