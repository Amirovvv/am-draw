import type { Component } from 'vue'

import IconBrush from '~icons/lucide/brush'
import IconHouse from '~icons/lucide/house'
import IconUserRound from '~icons/lucide/user-round'

export interface NavItem {
  name: 'feed' | 'draw' | 'profile'
  labelKey: 'nav.feed' | 'nav.draw' | 'nav.profile'
  icon: Component
  /** Emphasized as the main action in the bottom navigation. */
  primary?: boolean
}

export const NAV_ITEMS: readonly NavItem[] = [
  { name: 'feed', labelKey: 'nav.feed', icon: IconHouse },
  { name: 'draw', labelKey: 'nav.draw', icon: IconBrush, primary: true },
  { name: 'profile', labelKey: 'nav.profile', icon: IconUserRound },
]
