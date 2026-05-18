<template>
  <div class="flex h-[calc(100vh-60px)]">
    <div class="w-[260px] flex-shrink-0 border-r border-[color:var(--color-border-default)] bg-[color:var(--color-surface)]">
      <div class="sidebar-wrapper pt-2">
        <a-menu
          :selectedKeys="selectedKeys"
          :openKeys="openKeys"
          mode="inline"
          :theme="isDark ? 'dark' : 'light'"
          :items="menuItems"
          @click="onMenuClick"
          @openChange="openKeys = $event"
        />
      </div>
    </div>
    <div class="app-content flex-1 p-8 overflow-y-auto">
      <WelcomeVite v-if="!currentTopic" @start="startFirst" />
      <TopicPage
        v-else
        :topic="topicData"
        :topic-id="currentTopic"
        :has-prev="!!prevTopic"
        :has-next="!!nextTopic"
        :is-completed="completedTopics.has(currentTopic)"
        @prev="goTo(prevTopic)"
        @next="goTo(nextTopic)"
        @complete="toggleComplete"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject, h } from 'vue'
import { viteCategories, viteTopics } from '../../data/viteConfig.js'
import TopicPage from '../TopicPage.vue'
import { CheckCircleOutlined } from '@ant-design/icons-vue'

const isDark = inject('isDark')
const completedTopics = inject('completedTopics')

const currentTopic = ref('')
const selectedKeys = ref([])
const openKeys = ref(viteCategories.map(c => c.id))

const topicData = computed(() => viteTopics[currentTopic.value] || null)
const allTopics = computed(() => viteCategories.flatMap(c => c.topics))
const currentIndex = computed(() => allTopics.value.indexOf(currentTopic.value))
const prevTopic = computed(() => currentIndex.value > 0 ? allTopics.value[currentIndex.value - 1] : null)
const nextTopic = computed(() => currentIndex.value < allTopics.value.length - 1 ? allTopics.value[currentIndex.value + 1] : null)

const menuItems = computed(() => viteCategories.map(cat => ({
  key: cat.id,
  label: cat.name,
  children: cat.topics.map(tid => {
    const completed = completedTopics.value?.has(tid)
    return {
      key: tid,
      label: h('span', { style: 'display:flex;align-items:center;justify-content:space-between;width:100%' }, [
        h('span', viteTopics[tid]?.title || tid),
        completed ? h(CheckCircleOutlined, { style: 'color:var(--color-primary);font-size:13px' }) : null
      ])
    }
  })
})))

function onMenuClick({ key }) {
  if (viteTopics[key]) { currentTopic.value = key; selectedKeys.value = [key] }
}
function startFirst() {
  const first = allTopics.value[0]
  currentTopic.value = first; selectedKeys.value = [first]; openKeys.value = [viteCategories[0].id]
}
function goTo(topic) {
  if (!topic) return
  currentTopic.value = topic; selectedKeys.value = [topic]
  const cat = viteCategories.find(c => c.topics.includes(topic))
  if (cat && !openKeys.value.includes(cat.id)) openKeys.value = [...openKeys.value, cat.id]
}
function toggleComplete(id) {
  const s = new Set(completedTopics.value)
  s.has(id) ? s.delete(id) : s.add(id)
  completedTopics.value = s
}

const WelcomeVite = {
  emits: ['start'],
  template: `
    <div class="animate-[fade-in_0.5s_ease] text-center py-12 px-5 max-w-[840px] mx-auto">
      <div class="mb-11">
        <div class="w-20 h-20 rounded-[20px] bg-gradient-to-br from-[#646cff] to-[#535bf2] inline-flex items-center justify-center text-white text-[32px] font-extrabold mb-5 shadow-[0_8px_32px_rgba(100,108,255,0.25)]">V</div>
        <h1 class="text-[34px] text-[color:var(--color-txt-heading)] mb-3.5 font-extrabold tracking-tight leading-tight">
          <span class="bg-gradient-to-r from-[#646cff] to-[#a78bfa] bg-clip-text text-transparent">Vite</span> 配置指南
        </h1>
        <p class="text-[15px] text-[color:var(--color-txt-muted)] leading-relaxed max-w-[560px] mx-auto">
          涵盖 Vite 开发中最常用的配置：跨域代理、路径别名、环境变量、插件、构建优化等。
        </p>
      </div>
      <div class="flex justify-center gap-2 mb-10 max-w-[760px] mx-auto">
        <div class="flex-1 bg-[color:var(--color-surface-card)] border border-[color:var(--color-border-default)] rounded-[14px] p-5 text-center">
          <div class="text-[32px] font-extrabold text-[#646cff] leading-none mb-1.5">15</div>
          <div class="text-[11px] text-[color:var(--color-txt-muted)] font-semibold uppercase tracking-wider">配置项</div>
        </div>
        <div class="flex-1 bg-[color:var(--color-surface-card)] border border-[color:var(--color-border-default)] rounded-[14px] p-5 text-center">
          <div class="text-[32px] font-extrabold text-[#a78bfa] leading-none mb-1.5">6</div>
          <div class="text-[11px] text-[color:var(--color-txt-muted)] font-semibold uppercase tracking-wider">分类</div>
        </div>
      </div>
      <button class="px-8 h-11 rounded-xl text-[15px] font-semibold text-white bg-gradient-to-r from-[#646cff] to-[#535bf2] border-none cursor-pointer shadow-[0_4px_16px_rgba(100,108,255,0.3)] transition-all duration-200 hover:-translate-y-0.5" @click="$emit('start')">
        开始学习
      </button>
    </div>
  `
}
</script>
