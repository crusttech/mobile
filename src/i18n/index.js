import i18next from 'i18next'
import authEN from 'corteza-webapp-auth/src/i18n/en'
import hybridEN from './en'

export default () => {
  const newNS = { ...authEN, ...hybridEN }
  for (const ns in newNS) {
    i18next.addResourceBundle('en', ns, newNS[ns])
  }
}
