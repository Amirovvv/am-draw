import type { MessageSchema } from '@/app/i18n/messages'

const en: MessageSchema = {
  app: {
    name: 'amdraw',
    tagline: 'Draw on your phone and share with the world',
  },
  nav: {
    label: 'Main navigation',
    feed: 'Feed',
    draw: 'Draw',
    profile: 'Profile',
  },
  locale: {
    label: 'Language',
    ru: 'Русский',
    en: 'English',
  },
  feed: {
    title: 'Feed',
    placeholder: 'Drawings will appear here soon',
  },
  draw: {
    title: 'Draw',
    placeholder: 'The canvas is coming in the next updates',
  },
  profile: {
    title: 'Profile',
    placeholder: 'Your profile will appear after sign-in',
  },
  notFound: {
    title: 'Page not found',
    description: 'The link may be outdated or contain a typo',
    home: 'Go home',
  },
}

export default en
