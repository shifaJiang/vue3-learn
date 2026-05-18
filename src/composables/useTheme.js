import { ref, watch, computed } from 'vue'

const isDark = ref(localStorage.getItem('theme') !== 'light')

// Apply to document
function applyTheme() {
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
}

// Initialize
applyTheme()

watch(isDark, (val) => {
  localStorage.setItem('theme', val ? 'dark' : 'light')
  applyTheme()
})

export function useTheme() {
  const theme = computed(() => isDark.value ? 'dark' : 'light')
  const antdTheme = computed(() => isDark.value ? 'dark' : 'light')

  function toggleTheme() {
    isDark.value = !isDark.value
  }

  function setTheme(t) {
    isDark.value = t === 'dark'
  }

  return { isDark, theme, antdTheme, toggleTheme, setTheme }
}
