<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto px-4 py-8">
      <div class="text-center py-20">
        <h1 class="text-4xl font-bold mb-4">Página de Propiedad</h1>
        <p class="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Esta página se generará dinámicamente para cada propiedad
        </p>
        <router-link to="/" class="bg-primary hover:bg-secondary text-white px-6 py-3 rounded-lg inline-block">
          Volver al Inicio
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
// En el futuro aquí se cargaría la información de la propiedad basándose en route.params.id
</script>
