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
      <WelcomeApi v-if="!currentTopic" @start="startFirst" />
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
import { apiCategories, apiTopics } from '../../data/apiPractice.js'
import TopicPage from '../TopicPage.vue'
import { CheckCircleOutlined } from '@ant-design/icons-vue'

const isDark = inject('isDark')
const completedTopics = inject('completedTopics')

const currentTopic = ref('')
const selectedKeys = ref([])
const openKeys = ref(apiCategories.map(c => c.id))

const topicData = computed(() => apiTopics[currentTopic.value] || null)
const allTopics = computed(() => apiCategories.flatMap(c => c.topics))
const currentIndex = computed(() => allTopics.value.indexOf(currentTopic.value))
const prevTopic = computed(() => currentIndex.value > 0 ? allTopics.value[currentIndex.value - 1] : null)
const nextTopic = computed(() => currentIndex.value < allTopics.value.length - 1 ? allTopics.value[currentIndex.value + 1] : null)

const menuItems = computed(() => apiCategories.map(cat => ({
  key: cat.id,
  label: cat.name,
  children: cat.topics.map(tid => {
    const completed = completedTopics.value?.has(tid)
    return {
      key: tid,
      label: h('span', { style: 'display:flex;align-items:center;justify-content:space-between;width:100%' }, [
        h('span', apiTopics[tid]?.title || tid),
        completed ? h(CheckCircleOutlined, { style: 'color:var(--color-primary);font-size:13px' }) : null
      ])
    }
  })
})))

function onMenuClick({ key }) {
  if (apiTopics[key]) { currentTopic.value = key; selectedKeys.value = [key] }
}
function startFirst() {
  const first = allTopics.value[0]
  currentTopic.value = first; selectedKeys.value = [first]; openKeys.value = [apiCategories[0].id]
}
function goTo(topic) {
  if (!topic) return
  currentTopic.value = topic; selectedKeys.value = [topic]
  const cat = apiCategories.find(c => c.topics.includes(topic))
  if (cat && !openKeys.value.includes(cat.id)) openKeys.value = [...openKeys.value, cat.id]
}
function toggleComplete(id) {
  const s = new Set(completedTopics.value)
  s.has(id) ? s.delete(id) : s.add(id)
  completedTopics.value = s
}

// Welcome component for API page
const WelcomeApi = {
  emits: ['start'],
  template: `
    <div class="animate-[fade-in_0.5s_ease] text-center py-12 px-5 max-w-[840px] mx-auto">
      <div class="mb-11">
        <div class="w-20 h-20 rounded-[20px] bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8] inline-flex items-center justify-center text-white text-[36px] font-extrabold mb-5 shadow-[0_8px_32px_rgba(59,130,246,0.25)]">API</div>
        <h1 class="text-[34px] text-[color:var(--color-txt-heading)] mb-3.5 font-extrabold tracking-tight leading-tight">
          Vue 3 <span class="bg-gradient-to-r from-[#3b82f6] to-[#a855f7] bg-clip-text text-transparent">API 速查</span>
        </h1>
        <p class="text-[15px] text-[color:var(--color-txt-muted)] leading-relaxed max-w-[560px] mx-auto">
          涵盖 Vue 3 全部 Composition API、生命周期、组件 API、指令、工具函数等 50+ 个 API，每个都配有可运行的代码示例和练习题。
        </p>
      </div>
      <div class="flex justify-center gap-2 mb-10 max-w-[760px] mx-auto">
        <div class="flex-1 bg-[color:var(--color-surface-card)] border border-[color:var(--color-border-default)] rounded-[14px] p-5 text-center">
          <div class="text-[32px] font-extrabold text-[#3b82f6] leading-none mb-1.5">50+</div>
          <div class="text-[11px] text-[color:var(--color-txt-muted)] font-semibold uppercase tracking-wider">API 覆盖</div>
        </div>
        <div class="flex-1 bg-[color:var(--color-surface-card)] border border-[color:var(--color-border-default)] rounded-[14px] p-5 text-center">
          <div class="text-[32px] font-extrabold text-[#a855f7] leading-none mb-1.5">8</div>
          <div class="text-[11px] text-[color:var(--color-txt-muted)] font-semibold uppercase tracking-wider">分类</div>
        </div>
        <div class="flex-1 bg-[color:var(--color-surface-card)] border border-[color:var(--color-border-default)] rounded-[14px] p-5 text-center">
          <div class="text-[32px] font-extrabold text-[#22c55e] leading-none mb-1.5">50+</div>
          <div class="text-[11px] text-[color:var(--color-txt-muted)] font-semibold uppercase tracking-wider">练习题</div>
        </div>
      </div>
      <button class="px-8 h-11 rounded-xl text-[15px] font-semibold text-white bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] border-none cursor-pointer shadow-[0_4px_16px_rgba(59,130,246,0.3)] transition-all duration-200 hover:shadow-[0_6px_24px_rgba(59,130,246,0.4)] hover:-translate-y-0.5" @click="$emit('start')">
        开始查阅
      </button>
    </div>
  `
}
</script>
