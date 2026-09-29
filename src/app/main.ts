import '@/app/styles/base.css'

import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from '@/app/App.vue'
import { i18n } from '@/app/i18n'
import { router } from '@/app/router'

createApp(App).use(createPinia()).use(i18n).use(router).mount('#app')
