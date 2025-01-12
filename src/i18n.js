import { createI18n } from 'vue-i18n'

// Function to dynamically load locale messages
function loadLocaleMessages() {
  const locales = require.context(
    './locales',
    true,
    /[A-Za-z0-9-_,\s]+\.json$/i
  )
  const messages = {}
  locales.keys().forEach((key) => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i)
    if (matched && matched.length > 1) {
      const locale = matched[1]
      messages[locale] = locales(key)
    }
  })
  return messages
}

// Detect user's default locale (fall back to 'en' if not detected)
function detectLocale() {
  const language = navigator.language || navigator.userLanguage
  const supportedLocales = Object.keys(loadLocaleMessages())
  return supportedLocales.includes(language) ? language : 'zh'
}

// Create the i18n instance
const i18n = createI18n({
  locale: detectLocale(), // Default locale
  fallbackLocale: 'zh', // Fallback locale
  messages: loadLocaleMessages(), // Load translations dynamically
})

export default i18n
