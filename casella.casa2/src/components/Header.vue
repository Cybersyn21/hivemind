<template>
  <header class="bg-white dark:bg-dark shadow-lg sticky top-0 z-50 transition-all duration-300">
    <div class="container mx-auto px-4 py-4 flex justify-between items-center">
      <router-link to="/" class="text-xl font-bold text-primary dark:text-gold flex items-center">
        <i class="fas fa-building text-primary dark:text-gold text-2xl mr-3"></i>
        <div class="flex flex-col">
          <span class="text-lg">Inmobiliaria</span>
          <span class="text-xl">Casella & Casella</span>
        </div>
      </router-link>

      <nav class="hidden md:flex space-x-8">
        <a href="#inicio" class="hover:text-primary dark:hover:text-gold transition">Inicio</a>
        <a href="#propiedades" class="hover:text-primary dark:hover:text-gold transition">Propiedades</a>
        <a href="#servicios" class="hover:text-primary dark:hover:text-gold transition">Servicios</a>
        <a href="#nosotros" class="hover:text-primary dark:hover:text-gold transition">Nosotros</a>
        <a href="#contacto" class="hover:text-primary dark:hover:text-gold transition">Contacto</a>
      </nav>

      <div class="flex items-center space-x-4">
        <button @click="$emit('toggle-theme')" class="text-gray-600 dark:text-gray-300">
          <i :class="isDarkMode ? 'fa-sun' : 'fa-moon'" class="fas text-2xl"></i>
        </button>
        <button @click="toggleMobileMenu" class="md:hidden text-gray-600 dark:text-gray-300">
          <i class="fas fa-bars text-2xl"></i>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-show="showMobileMenu" class="md:hidden bg-white dark:bg-dark py-4 px-4 shadow-lg">
      <a href="#inicio" @click="toggleMobileMenu" class="block py-2 hover:text-primary dark:hover:text-gold">Inicio</a>
      <a href="#propiedades" @click="toggleMobileMenu" class="block py-2 hover:text-primary dark:hover:text-gold">Propiedades</a>
      <a href="#servicios" @click="toggleMobileMenu" class="block py-2 hover:text-primary dark:hover:text-gold">Servicios</a>
      <a href="#nosotros" @click="toggleMobileMenu" class="block py-2 hover:text-primary dark:hover:text-gold">Nosotros</a>
      <a href="#contacto" @click="toggleMobileMenu" class="block py-2 hover:text-primary dark:hover:text-gold">Contacto</a>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  isDarkMode: Boolean
})

defineEmits(['toggle-theme'])

const showMobileMenu = ref(false)

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}
</script>
