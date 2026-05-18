<template>
  <a-layout-header class="app-header">
    <div class="flex items-center gap-3">
      <div class="w-[34px] h-[34px] rounded-[10px] bg-gradient-to-br from-[#22c55e] to-[#15803d] flex items-center justify-center text-white font-extrabold text-[16px] shadow-[0_2px_8px_rgba(34,197,94,0.3)]">
        V
      </div>
      <span class="text-[17px] font-bold text-[color:var(--color-txt-heading)] tracking-tight">Vue 3 学习平台</span>
    </div>

    <nav class="flex items-center gap-1">
      <router-link
        v-for="tab in tabs"
        :key="tab.to"
        :to="tab.to"
        class="nav-tab"
        :class="{ active: routeName === tab.name }"
      >
        <component :is="tab.icon" class="text-sm" />
        {{ tab.label }}
      </router-link>
    </nav>

    <div class="flex items-center gap-3">
      <a-tooltip :title="isDark ? '切换为亮色主题' : '切换为暗色主题'">
        <button
          class="w-9 h-9 rounded-[10px] flex items-center justify-center text-[color:var(--color-txt-muted)] border border-[color:var(--color-border-default)] bg-[color:var(--color-surface-card)] cursor-pointer transition-all duration-200 hover:text-[color:var(--color-primary)] hover:border-[color:var(--color-border-primary)] hover:bg-[rgba(34,197,94,0.08)]"
          @click="$emit('toggle-theme')"
        >
          <BulbOutlined v-if="isDark" />
          <BulbFilled v-else />
        </button>
      </a-tooltip>
    </div>
  </a-layout-header>
</template>

<script setup>
import { h } from 'vue'
import {
  BulbOutlined,
  BulbFilled,
  BookOutlined,
  ApiOutlined,
  ThunderboltOutlined,
  RobotOutlined
} from '@ant-design/icons-vue'

defineProps({
  isDark: Boolean,
  routeName: String
})

defineEmits(['toggle-theme'])

const tabs = [
  { to: '/', name: 'tutorial', label: '教程', icon: BookOutlined },
  { to: '/api', name: 'api', label: 'API 速查', icon: ApiOutlined },
  { to: '/vite', name: 'vite', label: 'Vite 配置', icon: ThunderboltOutlined },
  { to: '/agent', name: 'agent', label: 'AI Agent', icon: RobotOutlined },
]
</script>
