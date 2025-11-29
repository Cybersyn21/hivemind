import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import AOS from 'aos'

const app = createApp(App)

app.use(router)

app.mount('#app')

// Initialize AOS
AOS.init({
  duration: 1000,
  once: true
})
