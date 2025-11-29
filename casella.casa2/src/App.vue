<template>
  <div :class="{ 'dark': isDarkMode }">
    <Header @toggle-theme="toggleTheme" :is-dark-mode="isDarkMode" />

    <router-view />

    <Footer />

    <!-- WhatsApp Float Button -->
    <a
      href="https://wa.me/5492657609278?text=Hola,%20me%20gustaría%20consultar%20sobre%20una%20propiedad"
      target="_blank"
      class="whatsapp-float"
      title="Contactar por WhatsApp"
    >
      <i class="fab fa-whatsapp"></i>
    </a>

    <!-- Back to Top Button -->
    <button
      v-show="showBackToTop"
      @click="scrollToTop"
      class="fixed bottom-24 right-12 z-50 bg-primary hover:bg-secondary text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition"
    >
      <i class="fas fa-arrow-up"></i>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'

const isDarkMode = ref(false)
const showBackToTop = ref(false)

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')
}

const handleScroll = () => {
  showBackToTop.value = window.pageYOffset > 300
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  isDarkMode.value = savedTheme === 'dark'

  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
