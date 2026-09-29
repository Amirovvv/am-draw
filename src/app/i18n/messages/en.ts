import type { MessageSchema } from '@/app/i18n/messages'

const en: MessageSchema = {
  common: {
    loading: 'Loading…',
  },
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
    emptyTitle: 'The feed is empty',
    emptyDescription: 'Drawings will appear here. Be the first to post!',
    drawFirst: 'Draw the first one',
  },
  draw: {
    title: 'Draw',
    emptyTitle: 'The canvas is coming soon',
    emptyDescription: 'Drawing tools arrive in the next updates',
  },
  profile: {
    title: 'Profile',
    emptyTitle: 'Your profile is empty',
    emptyDescription: 'It will appear after sign-in',
  },
  notFound: {
    title: 'Page not found',
    emptyTitle: 'Nothing here',
    emptyDescription: 'The link may be outdated or contain a typo',
    home: 'Go home',
  },
}

export default en
