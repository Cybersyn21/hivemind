<template>
  <main>
    <!-- Hero Section -->
    <section id="inicio" class="relative h-screen flex items-center justify-center text-white px-4" style="background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1473&q=80'); background-size: cover; background-position: center; background-attachment: fixed;">
      <div class="container mx-auto max-w-5xl text-center">
        <h1 class="text-5xl md:text-6xl font-bold mb-6" data-aos="fade-up">Tu Casa, Nuestra Pasión</h1>
        <p class="text-xl mb-8" data-aos="fade-up" data-aos-delay="200">Más de 30 años de experiencia en el mercado inmobiliario de Villa Mercedes y San Luis</p>
        <div data-aos="fade-up" data-aos-delay="400">
          <a href="#propiedades" class="bg-primary hover:bg-secondary text-white px-8 py-3 rounded-lg font-medium transition duration-300 inline-block">Ver Propiedades</a>
          <a href="#contacto" class="bg-white hover:bg-gray-100 text-primary px-8 py-3 rounded-lg font-medium transition duration-300 ml-4 inline-block">Contactar</a>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="bg-gray-50 dark:bg-gray-800 py-12">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div data-aos="zoom-in">
            <i class="fas fa-home text-primary dark:text-gold text-3xl mb-2"></i>
            <h3 class="text-3xl font-bold mb-1">500+</h3>
            <p class="text-gray-600 dark:text-gray-300">Propiedades Vendidas</p>
          </div>
          <div data-aos="zoom-in" data-aos-delay="100">
            <i class="fas fa-users text-primary dark:text-gold text-3xl mb-2"></i>
            <h3 class="text-3xl font-bold mb-1">1000+</h3>
            <p class="text-gray-600 dark:text-gray-300">Clientes Satisfechos</p>
          </div>
          <div data-aos="zoom-in" data-aos-delay="200">
            <i class="fas fa-award text-primary dark:text-gold text-3xl mb-2"></i>
            <h3 class="text-3xl font-bold mb-1">30+</h3>
            <p class="text-gray-600 dark:text-gray-300">Años de Experiencia</p>
          </div>
          <div data-aos="zoom-in" data-aos-delay="300">
            <i class="fas fa-handshake text-primary dark:text-gold text-3xl mb-2"></i>
            <h3 class="text-3xl font-bold mb-1">100%</h3>
            <p class="text-gray-600 dark:text-gray-300">Confianza y Transparencia</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Servicios Section -->
    <section id="servicios" class="py-20 px-4 bg-white dark:bg-dark">
      <div class="container mx-auto max-w-6xl">
        <h2 class="text-3xl font-bold mb-12 text-center text-gray-800 dark:text-gray-100" data-aos="fade-up">Nuestros Servicios</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="(service, index) in services" :key="index" class="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl hover:shadow-lg transition-all" data-aos="flip-up" :data-aos-delay="index * 100">
            <div class="bg-primary/10 text-primary dark:text-gold w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
              <i :class="service.icon"></i>
            </div>
            <h3 class="text-xl font-bold mb-3">{{ service.title }}</h3>
            <p class="text-gray-600 dark:text-gray-300">{{ service.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Propiedades Destacadas -->
    <section id="propiedades" class="py-20 px-4 bg-gray-50 dark:bg-gray-800">
      <div class="container mx-auto">
        <h2 class="text-3xl font-bold mb-12 text-center text-gray-800 dark:text-gray-100" data-aos="fade-up">Propiedades Destacadas</h2>

        <div class="flex justify-center space-x-4 mb-8 flex-wrap gap-2">
          <button
            v-for="filter in filters"
            :key="filter.value"
            @click="activeFilter = filter.value"
            :class="activeFilter === filter.value ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100'"
            class="px-4 py-2 rounded-lg font-medium"
          >
            {{ filter.label }}
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <PropertyCard
            v-for="property in filteredProperties"
            :key="property.id"
            :property="property"
          />
        </div>

        <div class="text-center mt-12" data-aos="fade-up">
          <a href="#contacto" class="bg-primary hover:bg-secondary text-white px-8 py-3 rounded-lg font-medium transition duration-300 inline-block">Ver Todas las Propiedades</a>
        </div>
      </div>
    </section>

    <!-- Nosotros Section -->
    <section id="nosotros" class="py-20 px-4 bg-white dark:bg-dark">
      <div class="container mx-auto max-w-6xl">
        <div class="flex flex-col md:flex-row items-center gap-12">
          <div class="md:w-1/2" data-aos="fade-right">
            <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1373&q=80" alt="Oficina" class="rounded-xl shadow-lg">
          </div>

          <div class="md:w-1/2" data-aos="fade-left">
            <h2 class="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Sobre Nosotros</h2>
            <h3 class="text-2xl font-bold text-primary mb-4">CASELLA HORACIO</h3>
            <p class="text-lg text-gray-700 dark:text-gray-300 mb-2">Martillero Público M.P. 1062</p>
            <p class="text-gray-600 dark:text-gray-300 mb-6">Con más de 30 años de experiencia en el mercado inmobiliario de Villa Mercedes y San Luis, nos especializamos en brindar soluciones integrales para la compra, venta y alquiler de propiedades.</p>

            <div class="space-y-4 mb-8">
              <div class="flex items-start">
                <i class="fas fa-check-circle text-primary dark:text-gold text-xl mr-3 mt-1"></i>
                <div>
                  <h4 class="font-bold mb-1">Experiencia y Profesionalismo</h4>
                  <p class="text-gray-600 dark:text-gray-300">Trayectoria comprobada en el mercado local</p>
                </div>
              </div>
              <div class="flex items-start">
                <i class="fas fa-check-circle text-primary dark:text-gold text-xl mr-3 mt-1"></i>
                <div>
                  <h4 class="font-bold mb-1">Asesoramiento Personalizado</h4>
                  <p class="text-gray-600 dark:text-gray-300">Atención dedicada a cada cliente</p>
                </div>
              </div>
              <div class="flex items-start">
                <i class="fas fa-check-circle text-primary dark:text-gold text-xl mr-3 mt-1"></i>
                <div>
                  <h4 class="font-bold mb-1">Transparencia Total</h4>
                  <p class="text-gray-600 dark:text-gray-300">Operaciones claras y seguras</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 px-4 bg-primary dark:bg-secondary text-white">
      <div class="container mx-auto max-w-4xl text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-6" data-aos="fade-up">¿Buscando tu Propiedad Ideal?</h2>
        <p class="text-xl mb-8" data-aos="fade-up" data-aos-delay="100">Contáctanos y te ayudaremos a encontrar el lugar perfecto para ti</p>
        <a href="#contacto" class="bg-white hover:bg-gray-100 text-primary px-8 py-4 rounded-lg font-medium text-lg transition duration-300 inline-block" data-aos="fade-up" data-aos-delay="200">Contactar Ahora</a>
      </div>
    </section>

    <!-- Contact Section -->
    <section id="contacto" class="py-20 px-4 bg-white dark:bg-dark">
      <div class="container mx-auto max-w-6xl">
        <h2 class="text-3xl font-bold mb-12 text-center text-gray-800 dark:text-gray-100" data-aos="fade-up">Contacto</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div data-aos="fade-right">
            <div class="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl h-full">
              <h3 class="text-2xl font-bold mb-6 text-primary">Inmobiliaria Casella & Casella</h3>

              <div class="space-y-6 mb-8">
                <div class="flex items-start">
                  <i class="fas fa-user text-primary dark:text-gold mt-1 mr-4 text-xl"></i>
                  <div>
                    <h4 class="font-bold">CASELLA HORACIO</h4>
                    <p class="text-gray-600 dark:text-gray-300">Martillero Público M.P. 1062</p>
                  </div>
                </div>

                <div class="flex items-start">
                  <i class="fas fa-map-marker-alt text-primary dark:text-gold mt-1 mr-4 text-xl"></i>
                  <div>
                    <h4 class="font-bold">Dirección</h4>
                    <p class="text-gray-600 dark:text-gray-300">Betbeder 46 – Villa Mercedes, San Luis</p>
                  </div>
                </div>

                <div class="flex items-start">
                  <i class="fas fa-mobile-alt text-primary dark:text-gold mt-1 mr-4 text-xl"></i>
                  <div>
                    <h4 class="font-bold">Celular</h4>
                    <p class="text-gray-600 dark:text-gray-300">2657-609278</p>
                  </div>
                </div>

                <div class="flex items-start">
                  <i class="fas fa-phone-alt text-primary dark:text-gold mt-1 mr-4 text-xl"></i>
                  <div>
                    <h4 class="font-bold">Teléfono</h4>
                    <p class="text-gray-600 dark:text-gray-300">02657-424494</p>
                  </div>
                </div>

                <div class="flex items-start">
                  <i class="fas fa-envelope text-primary dark:text-gold mt-1 mr-4 text-xl"></i>
                  <div>
                    <h4 class="font-bold">Email</h4>
                    <p class="text-gray-600 dark:text-gray-300">horaciocasella@yahoo.com.ar</p>
                  </div>
                </div>

                <div class="flex items-start">
                  <i class="fas fa-clock text-primary dark:text-gold mt-1 mr-4 text-xl"></i>
                  <div>
                    <h4 class="font-bold">Horario de Atención</h4>
                    <p class="text-gray-600 dark:text-gray-300">Lun-Vie: 9:00 - 13:00 / 17:00 - 21:00<br>Sáb: 9:00 - 13:00</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 class="font-bold mb-4">Síguenos en Redes Sociales</h4>
                <div class="flex space-x-4">
                  <a href="#" class="bg-primary/10 text-primary dark:text-gold w-12 h-12 rounded-full flex items-center justify-center hover:bg-primary hover:text-white dark:hover:bg-gold dark:hover:text-dark transition">
                    <i class="fab fa-facebook-f"></i>
                  </a>
                  <a href="#" class="bg-primary/10 text-primary dark:text-gold w-12 h-12 rounded-full flex items-center justify-center hover:bg-primary hover:text-white dark:hover:bg-gold dark:hover:text-dark transition">
                    <i class="fab fa-instagram"></i>
                  </a>
                  <a href="https://wa.me/5492657609278" target="_blank" class="bg-emerald/10 text-emerald w-12 h-12 rounded-full flex items-center justify-center hover:bg-emerald hover:text-white transition">
                    <i class="fab fa-whatsapp"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div data-aos="fade-left">
            <form @submit.prevent="sendWhatsApp" class="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl">
              <h3 class="text-xl font-bold mb-6">Envíanos un Mensaje</h3>

              <div class="mb-4">
                <label class="block mb-2 text-gray-700 dark:text-gray-300">Nombre Completo</label>
                <input v-model="form.name" type="text" required class="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-gold bg-white dark:bg-gray-700" placeholder="Tu nombre">
              </div>

              <div class="mb-4">
                <label class="block mb-2 text-gray-700 dark:text-gray-300">Email</label>
                <input v-model="form.email" type="email" required class="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-gold bg-white dark:bg-gray-700" placeholder="tu@email.com">
              </div>

              <div class="mb-4">
                <label class="block mb-2 text-gray-700 dark:text-gray-300">Teléfono</label>
                <input v-model="form.phone" type="tel" required class="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-gold bg-white dark:bg-gray-700" placeholder="Tu teléfono">
              </div>

              <div class="mb-4">
                <label class="block mb-2 text-gray-700 dark:text-gray-300">Tipo de Consulta</label>
                <select v-model="form.type" class="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-gold bg-white dark:bg-gray-700">
                  <option>Comprar</option>
                  <option>Vender</option>
                  <option>Alquilar</option>
                  <option>Tasación</option>
                  <option>Otro</option>
                </select>
              </div>

              <div class="mb-6">
                <label class="block mb-2 text-gray-700 dark:text-gray-300">Mensaje</label>
                <textarea v-model="form.message" rows="4" class="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-gold bg-white dark:bg-gray-700" placeholder="Cuéntanos qué necesitas..."></textarea>
              </div>

              <button type="submit" class="w-full bg-primary hover:bg-secondary text-white py-3 px-4 rounded-lg font-medium transition duration-300">
                <i class="fas fa-paper-plane mr-2"></i>Enviar Consulta
              </button>
            </form>
          </div>
        </div>

        <!-- Map -->
        <div class="mt-12" data-aos="fade-up">
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3355.3829641879844!2d-65.46316492428324!3d-33.67843767329674!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95d2dfe1f8e3e8e5%3A0x5a0d3e0e0e0e0e0!2sVilla%20Mercedes%2C%20San%20Luis!5e0!3m2!1ses!2sar!4v1234567890123!5m2!1ses!2sar" class="w-full h-96 rounded-xl shadow-lg" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import PropertyCard from '../components/PropertyCard.vue'

const activeFilter = ref('all')

const form = ref({
  name: '',
  email: '',
  phone: '',
  type: 'Comprar',
  message: ''
})

const filters = [
  { value: 'all', label: 'Todas' },
  { value: 'venta', label: 'Venta' },
  { value: 'alquiler', label: 'Alquiler' },
  { value: 'terrenos', label: 'Terrenos' }
]

const services = [
  {
    icon: 'fas fa-home',
    title: 'Venta de Propiedades',
    description: 'Casas, departamentos, terrenos y locales comerciales'
  },
  {
    icon: 'fas fa-key',
    title: 'Alquiler',
    description: 'Viviendas y locales comerciales en alquiler'
  },
  {
    icon: 'fas fa-chart-line',
    title: 'Tasaciones',
    description: 'Valuación profesional de propiedades'
  },
  {
    icon: 'fas fa-file-contract',
    title: 'Asesoramiento Legal',
    description: 'Gestión completa de trámites y documentación'
  },
  {
    icon: 'fas fa-landmark',
    title: 'Terrenos',
    description: 'Lotes urbanos y rurales en venta'
  },
  {
    icon: 'fas fa-store',
    title: 'Locales Comerciales',
    description: 'Espacios comerciales en ubicaciones estratégicas'
  }
]

const properties = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    title: 'Casa en Barrio Residencial',
    location: 'Villa Mercedes, San Luis',
    type: 'Venta',
    bedrooms: 3,
    bathrooms: 2,
    garage: true,
    price: 'Consultar'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80',
    title: 'Departamento Céntrico',
    location: 'Centro, Villa Mercedes',
    type: 'Alquiler',
    bedrooms: 2,
    bathrooms: 1,
    surface: 65,
    price: 'Consultar'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1632&q=80',
    title: 'Terreno con Servicios',
    location: 'Zona Norte, Villa Mercedes',
    type: 'Terreno',
    surface: 300,
    price: 'Consultar'
  }
]

const filteredProperties = computed(() => {
  if (activeFilter.value === 'all') {
    return properties
  }
  return properties.filter(p => p.type.toLowerCase() === activeFilter.value)
})

const sendWhatsApp = () => {
  const message = `Hola! Mi nombre es ${form.value.name}.%0A%0AConsulto por: ${form.value.type}%0A%0A${form.value.message}%0A%0AMis datos de contacto:%0AEmail: ${form.value.email}%0ATeléfono: ${form.value.phone}`
  window.open(`https://wa.me/5492657609278?text=${message}`, '_blank')
}
</script>
