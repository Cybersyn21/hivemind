<template>
  <div class="property-card bg-white dark:bg-gray-700 rounded-xl overflow-hidden shadow-lg" data-aos="fade-up">
    <div class="relative">
      <img :src="property.image" :alt="property.title" class="w-full h-64 object-cover">
      <div class="absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium" :class="badgeClass">
        {{ property.type }}
      </div>
    </div>
    <div class="p-6">
      <h3 class="text-xl font-bold mb-2">{{ property.title }}</h3>
      <p class="text-gray-600 dark:text-gray-300 mb-4">
        <i class="fas fa-map-marker-alt text-primary mr-2"></i>{{ property.location }}
      </p>
      <div class="flex items-center space-x-4 mb-4 text-sm">
        <span v-if="property.bedrooms">
          <i class="fas fa-bed text-primary mr-1"></i> {{ property.bedrooms }} Dorm.
        </span>
        <span v-if="property.bathrooms">
          <i class="fas fa-bath text-primary mr-1"></i> {{ property.bathrooms }} Baños
        </span>
        <span v-if="property.surface">
          <i class="fas fa-ruler-combined text-primary mr-1"></i> {{ property.surface }} m²
        </span>
        <span v-if="property.garage">
          <i class="fas fa-car text-primary mr-1"></i> Garage
        </span>
      </div>
      <div class="flex justify-between items-center">
        <p class="text-2xl font-bold text-primary">{{ property.price }}</p>
        <a href="#contacto" class="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-lg text-sm transition">
          Ver Más
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  property: {
    type: Object,
    required: true
  }
})

const badgeClass = computed(() => {
  switch (props.property.type.toLowerCase()) {
    case 'venta':
      return 'bg-primary text-white'
    case 'alquiler':
      return 'bg-emerald text-white'
    case 'terreno':
      return 'bg-secondary text-white'
    default:
      return 'bg-primary text-white'
  }
})
</script>
