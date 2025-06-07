<template>
  <div id="app" class="min-h-screen bg-animated bg-mesh relative overflow-hidden">
    <!-- Animated background particles -->
    <div class="absolute inset-0 pointer-events-none">
      <!-- Large floating orbs -->
      <div class="particle particle-1 top-20 left-20 floating"></div>
      <div class="particle particle-2 top-40 right-32 floating-delayed"></div>
      <div class="particle particle-3 bottom-32 left-16 floating-slow"></div>
      <div class="particle particle-4 bottom-20 right-20 floating"></div>
      <div class="particle particle-1 top-60 left-1/3 floating-delayed"></div>
      <div class="particle particle-2 top-80 right-1/4 floating-slow"></div>
      
      <!-- Gradient orbs -->
      <div class="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary-500/30 via-secondary-500/20 to-transparent rounded-full blur-3xl animate-pulse-slow"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-accent-500/25 via-primary-600/20 to-transparent rounded-full blur-3xl animate-pulse-slow" style="animation-delay: 2s;"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-transparent via-secondary-500/10 to-transparent rounded-full blur-2xl animate-pulse-slow" style="animation-delay: 4s;"></div>
      
      <!-- Mesh gradient overlay -->
      <div class="absolute inset-0 bg-gradient-to-br from-dark-950/80 via-dark-900/60 to-dark-800/80"></div>
    </div>

    <!-- Main content -->
    <div class="relative z-10">
      <router-view />
    </div>

  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style scoped>
#app {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Custom animations for this component */
@keyframes float-gentle {
  0%, 100% { transform: translateY(0px) scale(1); }
  50% { transform: translateY(-10px) scale(1.05); }
}

.floating-gentle {
  animation: float-gentle 4s ease-in-out infinite;
}
</style>