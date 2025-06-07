<template>
  <div class="relative">
    <label class="block text-lg font-semibold text-white mb-4">
      <div class="flex items-center">
        <div class="w-8 h-8 bg-gradient-to-r from-secondary-500 to-accent-500 rounded-xl flex items-center justify-center mr-3 glow-secondary">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path>
          </svg>
        </div>
        <span class="gradient-text-secondary">Select Subtitle Language</span>
      </div>
    </label>
    
    <!-- Search Input -->
    <div class="relative group">
      <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
        <svg class="w-6 h-6 text-dark-400 group-focus-within:text-primary-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>
      
      <input
        v-model="searchQuery"
        @focus="showDropdown = true"
        @blur="handleBlur"
        @keydown.enter.prevent="selectFirstResult"
        @keydown.arrow-down.prevent="navigateDown"
        @keydown.arrow-up.prevent="navigateUp"
        @keydown.escape="hideDropdown"
        type="text"
        :placeholder="selectedLanguage ? getLanguageName(selectedLanguage) : 'Search for a language...'"
        class="w-full pl-14 pr-14 py-4 text-lg font-medium placeholder:text-dark-500 focus:placeholder:text-dark-600 transition-all duration-300 bg-dark-800/80 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500/50"
        :class="{
          'ring-2 ring-primary-500 border-primary-500/50 bg-dark-800/90': showDropdown,
          'bg-dark-800/80': !showDropdown
        }"
      >
      
      <!-- Clear button -->
      <button
        v-if="searchQuery || selectedLanguage"
        @click="clearSelection"
        class="absolute inset-y-0 right-0 pr-4 flex items-center text-dark-400 hover:text-white transition-all duration-300 z-10 group"
      >
        <div class="w-8 h-8 rounded-lg bg-dark-700 hover:bg-dark-600 flex items-center justify-center group-hover:scale-110 transition-all duration-300">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>
      </button>
    </div>

    <!-- Dropdown Results -->
    <div
      v-if="showDropdown && filteredLanguages.length > 0"
      class="mt-3 bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-600 animate-slide-down"
      :style="{ height: getDropdownHeight(), maxHeight: '168px' }"
    >
      <div class="overflow-y-auto custom-scrollbar h-full">
        <div
          v-for="(language, index) in filteredLanguages"
          :key="language.key"
          @click="selectLanguage(language.key)"
          class="px-4 py-3 cursor-pointer transition-all duration-300 flex items-center justify-between group hover:bg-white/10 border-b border-white/5 last:border-b-0 h-14"
          :class="{
            'bg-gradient-to-r from-primary-500/20 to-secondary-500/20 text-white border-primary-500/30': index === highlightedIndex,
            'text-dark-200': index !== highlightedIndex
          }"
        >
          <div class="flex items-center">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center mr-3 text-xs font-bold text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
              {{ language.value.name.charAt(0).toUpperCase() }}
            </div>
            <div>
              <span class="font-medium text-base">{{ language.value.name }}</span>
              <p v-if="language.value.iso" class="text-xs text-dark-400 mt-0.5">{{ language.value.iso }}</p>
            </div>
          </div>
          
          <div class="flex items-center space-x-3">
            <span v-if="language.value.iso" class="bg-dark-700 px-3 py-1 rounded-lg text-xs font-medium">{{ language.value.iso }}</span>
            <svg v-if="index === highlightedIndex" class="w-5 h-5 text-primary-400 animate-bounce-gentle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </div>
        </div>
      </div>
      
      <!-- No results -->
      <div v-if="searchQuery && filteredLanguages.length === 0" class="px-6 py-12 text-center text-dark-400">
        <div class="w-16 h-16 mx-auto mb-4 bg-dark-700 rounded-2xl flex items-center justify-center">
          <svg class="w-8 h-8 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <p class="text-lg font-medium mb-2">No languages found</p>
        <p class="text-sm">Try searching for "{{ searchQuery }}" with different terms</p>
      </div>
    </div>

    <!-- Selected Language Display -->
    <div v-if="selectedLanguage && !showDropdown" class="mt-6 p-6 bg-gradient-to-r from-primary-500/10 via-secondary-500/10 to-accent-500/10 border border-primary-500/30 rounded-2xl animate-fade-in">
      <div class="flex items-center">
        <div class="w-12 h-12 rounded-2xl bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center mr-4 text-lg font-bold text-white shadow-lg glow-primary">
          {{ getLanguageName(selectedLanguage).charAt(0).toUpperCase() }}
        </div>
        <div class="flex-1">
          <p class="text-primary-300 font-bold text-xl">{{ getLanguageName(selectedLanguage) }}</p>
          <p v-if="getLanguageIso(selectedLanguage)" class="text-primary-400 text-sm mt-1 font-medium">{{ getLanguageIso(selectedLanguage) }}</p>
        </div>
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-success-500/20 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-success-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Language Stats -->
    <div v-if="!selectedLanguage && Object.keys(languages).length > 0" class="mt-4 text-center">
      <p class="text-dark-400 text-sm">
        <span class="font-semibold text-primary-400">{{ Object.keys(languages).length }}</span> languages available
      </p>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'

export default {
  name: 'LanguageSearch',
  props: {
    languages: {
      type: Object,
      required: true
    },
    modelValue: {
      type: String,
      required: true
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const searchQuery = ref('')
    const showDropdown = ref(false)
    const highlightedIndex = ref(0)

    const selectedLanguage = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value)
    })

    const filteredLanguages = computed(() => {
      if (!searchQuery.value) {
        // Display ALL languages sorted by name when no search
        return Object.entries(props.languages)
          .map(([key, value]) => ({ key, value }))
          .sort((a, b) => a.value.name.localeCompare(b.value.name))
      }
      
      const query = searchQuery.value.toLowerCase()
      return Object.entries(props.languages)
        .filter(([key, language]) =>
          language.name.toLowerCase().includes(query) ||
          language.id.toLowerCase().includes(query) ||
          (language.iso && language.iso.toLowerCase().includes(query))
        )
        .map(([key, value]) => ({ key, value }))
        .sort((a, b) => a.value.name.localeCompare(b.value.name))
    })

    const selectLanguage = (languageKey) => {
      selectedLanguage.value = languageKey
      searchQuery.value = ''
      showDropdown.value = false
      highlightedIndex.value = 0
    }

    const selectFirstResult = () => {
      if (filteredLanguages.value.length > 0) {
        selectLanguage(filteredLanguages.value[highlightedIndex.value].key)
      }
    }

    const navigateDown = () => {
      if (highlightedIndex.value < filteredLanguages.value.length - 1) {
        highlightedIndex.value++
      }
    }

    const navigateUp = () => {
      if (highlightedIndex.value > 0) {
        highlightedIndex.value--
      }
    }

    const hideDropdown = () => {
      showDropdown.value = false
      searchQuery.value = ''
      highlightedIndex.value = 0
    }

    const handleBlur = () => {
      // Delay hiding to allow click events
      setTimeout(() => {
        showDropdown.value = false
        searchQuery.value = ''
        highlightedIndex.value = 0
      }, 200)
    }

    const clearSelection = () => {
      selectedLanguage.value = ''
      searchQuery.value = ''
      showDropdown.value = true
      highlightedIndex.value = 0
    }

    const getLanguageName = (key) => {
      return props.languages[key]?.name || key
    }

    const getLanguageIso = (key) => {
      return props.languages[key]?.iso || null
    }

    const getDropdownHeight = () => {
      const itemHeight = 56 // h-14 = 56px
      const maxVisibleItems = 3 // Afficher maximum 3 items visibles
      const actualItems = filteredLanguages.value.length
      const visibleItems = Math.min(actualItems, maxVisibleItems)
      return `${visibleItems * itemHeight}px`
    }

    // Reset highlighted index when search changes
    watch(searchQuery, () => {
      highlightedIndex.value = 0
    })

    return {
      searchQuery,
      showDropdown,
      highlightedIndex,
      selectedLanguage,
      filteredLanguages,
      selectLanguage,
      selectFirstResult,
      navigateDown,
      navigateUp,
      hideDropdown,
      handleBlur,
      clearSelection,
      getLanguageName,
      getLanguageIso,
      getDropdownHeight
    }
  }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(14, 165, 233, 0.5);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(14, 165, 233, 0.7);
}
</style>