<template>
  <div class="min-h-screen flex flex-col relative">
    <!-- Hero Section -->
    <section class="flex-1 flex items-center justify-center py-20 px-4">
      <div class="container-custom">
        <div class="max-w-4xl mx-auto">
          <!-- Header with logo and title -->
          <div class="text-center mb-16 animate-fade-in">
            <div class="mb-12 flex justify-center">
              <div class="relative group">
                <div class="absolute -inset-4 bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                <div class="relative">
                  <img 
                    src="https://raw.githubusercontent.com/Dydhzo/gestdown-subtitles/refs/heads/main/frontend/public/gestdown-logos.png" 
                    alt="Gestdown Logo" 
                    class="w-32 h-32 rounded-3xl shadow-2xl glow-primary floating"
                  >
                  <div class="absolute -inset-2 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-3xl blur-lg"></div>
                </div>
              </div>
            </div>
            
            <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6 leading-tight">
              <span class="gradient-text">Gestdown Subtitles</span>
            </h1>
            
            <p class="text-2xl md:text-3xl text-dark-300 mb-4 font-medium">
              Subtitle Addon for
              <span class="gradient-text-secondary">Stremio</span>
            </p>
            <p class="text-lg text-dark-400 max-w-2xl mx-auto leading-relaxed">
              Gestdown works exclusively for TV series and acts as a proxy to Addic7ed,
              allowing you to bypass the 15 download limit and access a wide selection of subtitles.
            </p>
          </div>

          <!-- Main Content Grid -->
          <div class="flex justify-center">
            <!-- Configuration Card -->
            <div class="w-full max-w-2xl">
              <div class="card animate-slide-up" style="animation-delay: 0.2s;">
                <div class="flex items-center mb-8">
                  <div class="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mr-4 glow-primary">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <h2 class="text-3xl font-display font-bold text-white mb-2">Configuration</h2>
                    <p class="text-dark-400">Customize your subtitle experience</p>
                  </div>
                </div>

                <div class="space-y-8">
                  <LanguageSearch
                    v-model="configStore.selectedLanguage"
                    :languages="configStore.languages"
                  />
                </div>
              </div>

              <!-- Installation Card -->
              <div v-if="configStore.selectedLanguage" class="card animate-scale-in mt-8" style="animation-delay: 0.4s;">
                <div class="flex items-center mb-6">
                  <div class="w-12 h-12 bg-gradient-to-r from-success-500 to-primary-500 rounded-2xl flex items-center justify-center mr-4 glow-secondary">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-2xl font-display font-bold text-white mb-1">Install Addon</h3>
                    <p class="text-dark-400">Add to your Stremio library</p>
                  </div>
                </div>

                <div class="space-y-4">
                  <button 
                    @click="toggleInstallOptions"
                    class="w-full btn btn-primary py-4 px-6 text-lg font-semibold shimmer"
                  >
                    <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                    Install to Stremio
                  </button>

                  <!-- Install Options -->
                  <div v-if="showInstallOptions" class="space-y-4 animate-slide-down">
                    <p class="text-dark-300 text-center font-medium">Choose your preferred installation method:</p>
                    
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <button 
                        @click="openInStremio"
                        class="btn btn-secondary py-3 px-4 text-sm font-medium group"
                      >
                        <svg class="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        Open in Stremio
                      </button>
                      
                      <button 
                        @click="copyManifestLink"
                        class="btn btn-secondary py-3 px-4 text-sm font-medium group"
                      >
                        <svg class="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                        </svg>
                        Copy Link
                      </button>
                    </div>

                    <!-- Copy Success Message -->
                    <div v-if="showCopyMessage" class="text-center status-success p-3 rounded-lg animate-fade-in">
                      <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span class="font-medium">Link copied to clipboard!</span>
                    </div>

                    <!-- Manifest URL Display -->
                    <div class="glass rounded-xl p-4 border border-white/10">
                      <p class="text-xs text-dark-400 mb-2 font-medium uppercase tracking-wide">Manifest URL:</p>
                      <p class="text-sm text-dark-200 font-mono break-all bg-dark-800/50 p-3 rounded-lg">{{ configStore.manifestUrl }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Modern Footer -->
    <footer class="glass-strong border-t border-white/10 py-8 mt-20">
      <div class="container-custom">
        <div class="flex flex-col md:flex-row items-center justify-between">
          <div class="flex items-center mb-4 md:mb-0">
            <span class="text-dark-300 text-sm">Crafted with</span>
            <svg class="w-4 h-4 mx-2 text-red-500 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <span class="text-dark-300 text-sm">by</span>
            <span class="gradient-text-primary font-semibold text-sm ml-2">Dydhzo</span>
          </div>
          
          <div class="flex items-center space-x-6">
            <a
              href="https://github.com/Dydhzo/gestdown-subtitles"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center text-dark-400 hover:text-primary-400 transition-all duration-300 text-sm group"
            >
              <svg class="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span class="font-medium">GitHub</span>
            </a>
            
            <div class="flex items-center space-x-2">
              <div class="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
              <span class="text-dark-500 text-xs font-medium">v1.1.1</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useConfigStore } from '@/stores/config'
import LanguageSearch from '@/components/LanguageSearch.vue'

export default {
  name: 'ConfigView',
  components: {
    LanguageSearch
  },
  setup() {
    const configStore = useConfigStore()
    const showInstallOptions = ref(false)
    const showCopyMessage = ref(false)

    onMounted(async () => {
      await configStore.fetchLanguages()
    })

    const toggleInstallOptions = () => {
      showInstallOptions.value = !showInstallOptions.value
    }

    const openInStremio = () => {
      if (configStore.stremioUrl) {
        window.open(configStore.stremioUrl, '_blank')
      }
    }

    const copyManifestLink = async () => {
      if (configStore.manifestUrl) {
        const success = await configStore.copyToClipboard(configStore.manifestUrl)
        if (success) {
          showCopyMessage.value = true
          setTimeout(() => {
            showCopyMessage.value = false
          }, 3000)
        }
      }
    }

    return {
      configStore,
      showInstallOptions,
      showCopyMessage,
      toggleInstallOptions,
      openInStremio,
      copyManifestLink
    }
  }
}
</script>