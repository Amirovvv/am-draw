import { createApp } from 'vue'

import App from '@/App.vue'
import router from '@/router'
import pinia from '@/store'

import '@/assets/styles.css'

const app = createApp(App)

app.use(router).use(pinia).mount('#app')
