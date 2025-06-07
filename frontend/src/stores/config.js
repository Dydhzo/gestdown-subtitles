import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useConfigStore = defineStore('config', () => {
  // State
  const selectedLanguage = ref('')
  const languages = ref({})
  const isLoading = ref(false)
  const error = ref('')

  // Getters
  const isConfigured = computed(() => selectedLanguage.value !== '')
  const manifestUrl = computed(() => {
    if (!selectedLanguage.value) return ''
    const baseUrl = window.location.origin
    return `${baseUrl}/${selectedLanguage.value}/manifest.json`
  })

  const stremioUrl = computed(() => {
    if (!manifestUrl.value) return ''
    // Extract hostname and pathname from manifestUrl.value
    const url = new URL(manifestUrl.value);
    return `stremio://${url.host}${url.pathname}`;
  })

  const selectedLanguageInfo = computed(() => {
    if (!selectedLanguage.value || !languages.value[selectedLanguage.value]) {
      return null
    }
    return languages.value[selectedLanguage.value]
  })

  // Actions
  const fetchLanguages = async () => {
    isLoading.value = true
    error.value = ''
    
    try {
      const response = await fetch('/languages.json')
      if (!response.ok) {
        throw new Error('Failed to fetch languages')
      }
      languages.value = await response.json()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
      console.error('Error fetching languages:', err)
    } finally {
      isLoading.value = false
    }
  }

  const setLanguage = (languageId) => {
    if (languages.value[languageId]) {
      selectedLanguage.value = languageId
      error.value = ''
    } else {
      error.value = 'Invalid language selected'
    }
  }

  const reset = () => {
    selectedLanguage.value = ''
    error.value = ''
  }

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
      return false
    }
  }

  return {
    // State
    selectedLanguage,
    languages,
    isLoading,
    error,
    
    // Getters
    isConfigured,
    manifestUrl,
    stremioUrl,
    selectedLanguageInfo,
    
    // Actions
    fetchLanguages,
    setLanguage,
    reset,
    copyToClipboard
  }
})