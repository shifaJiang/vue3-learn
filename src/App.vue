<template>
  <a-config-provider :theme="antdThemeConfig">
    <a-layout class="app-layout">
      <AppHeader
        :is-dark="isDark"
        :route-name="$route.name"
        @toggle-theme="toggleTheme"
      />
      <router-view />
    </a-layout>
  </a-config-provider>
</template>

<script setup>
import { computed, provide, ref } from 'vue'
import { useTheme } from './composables/useTheme.js'
import AppHeader from './components/AppHeader.vue'

const { isDark, toggleTheme } = useTheme()

const completedTopics = ref(new Set())

provide('isDark', isDark)
provide('completedTopics', completedTopics)

const antdThemeConfig = computed(() => ({
  token: {
    colorPrimary: isDark.value ? '#22c55e' : '#16a34a',
    borderRadius: 8,
    colorBgContainer: isDark.value ? 'rgba(18, 18, 24, 0.8)' : 'rgba(255, 255, 255, 0.9)',
    colorBgElevated: isDark.value ? '#121218' : '#ffffff',
    colorBgLayout: isDark.value ? '#09090b' : '#fafafa',
    colorBorder: isDark.value ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)',
    colorText: isDark.value ? '#e4e4e7' : '#27272a',
    colorTextSecondary: isDark.value ? '#71717a' : '#71717a',
  }
}))
</script>
