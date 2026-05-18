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
      <WelcomeAgent v-if="!currentTopic" @start="startFirst" />
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
import { agentCategories, agentTopics } from '../../data/agentDev.js'
import TopicPage from '../TopicPage.vue'
import { CheckCircleOutlined } from '@ant-design/icons-vue'

const isDark = inject('isDark')
const completedTopics = inject('completedTopics')

const currentTopic = ref('')
const selectedKeys = ref([])
const openKeys = ref(agentCategories.map(c => c.id))

const topicData = computed(() => agentTopics[currentTopic.value] || null)
const allTopics = computed(() => agentCategories.flatMap(c => c.topics))
const currentIndex = computed(() => allTopics.value.indexOf(currentTopic.value))
const prevTopic = computed(() => currentIndex.value > 0 ? allTopics.value[currentIndex.value - 1] : null)
const nextTopic = computed(() => currentIndex.value < allTopics.value.length - 1 ? allTopics.value[currentIndex.value + 1] : null)

const menuItems = computed(() => agentCategories.map(cat => ({
  key: cat.id,
  label: cat.name,
  children: cat.topics.map(tid => {
    const completed = completedTopics.value?.has(tid)
    return {
      key: tid,
      label: h('span', { style: 'display:flex;align-items:center;justify-content:space-between;width:100%' }, [
        h('span', agentTopics[tid]?.title || tid),
        completed ? h(CheckCircleOutlined, { style: 'color:var(--color-primary);font-size:13px' }) : null
      ])
    }
  })
})))

function onMenuClick({ key }) {
  if (agentTopics[key]) { currentTopic.value = key; selectedKeys.value = [key] }
}
function startFirst() {
  const first = allTopics.value[0]
  currentTopic.value = first; selectedKeys.value = [first]; openKeys.value = [agentCategories[0].id]
}
function goTo(topic) {
  if (!topic) return
  currentTopic.value = topic; selectedKeys.value = [topic]
  const cat = agentCategories.find(c => c.topics.includes(topic))
  if (cat && !openKeys.value.includes(cat.id)) openKeys.value = [...openKeys.value, cat.id]
}
function toggleComplete(id) {
  const s = new Set(completedTopics.value)
  s.has(id) ? s.delete(id) : s.add(id)
  completedTopics.value = s
}

const WelcomeAgent = {
  emits: ['start'],
  template: `
    <div class="animate-[fade-in_0.5s_ease] text-center py-12 px-5 max-w-[840px] mx-auto">
      <div class="mb-11">
        <div class="w-20 h-20 rounded-[20px] bg-gradient-to-br from-[#f59e0b] to-[#d97706] inline-flex items-center justify-center text-white text-[28px] font-extrabold mb-5 shadow-[0_8px_32px_rgba(245,158,11,0.25)]">AI</div>
        <h1 class="text-[34px] text-[color:var(--color-txt-heading)] mb-3.5 font-extrabold tracking-tight leading-tight">
          <span class="bg-gradient-to-r from-[#f59e0b] to-[#ef4444] bg-clip-text text-transparent">AI Agent</span> 应用开发
        </h1>
        <p class="text-[15px] text-[color:var(--color-txt-muted)] leading-relaxed max-w-[560px] mx-auto">
          从零学习 AI Agent 开发：Agent 基础、工具调用、多轮对话、RAG 检索增强、LangChain 框架、实战项目。
        </p>
      </div>
      <div class="grid grid-cols-3 gap-3 mb-10 max-w-[760px] mx-auto">
        <div class="bg-[color:var(--color-surface-card)] border border-[color:var(--color-border-default)] rounded-[14px] p-5 text-center">
          <div class="text-[28px] font-extrabold text-[#f59e0b] leading-none mb-1.5">20</div>
          <div class="text-[11px] text-[color:var(--color-txt-muted)] font-semibold uppercase tracking-wider">知识点</div>
        </div>
        <div class="bg-[color:var(--color-surface-card)] border border-[color:var(--color-border-default)] rounded-[14px] p-5 text-center">
          <div class="text-[28px] font-extrabold text-[#ef4444] leading-none mb-1.5">6</div>
          <div class="text-[11px] text-[color:var(--color-txt-muted)] font-semibold uppercase tracking-wider">分类</div>
        </div>
        <div class="bg-[color:var(--color-surface-card)] border border-[color:var(--color-border-default)] rounded-[14px] p-5 text-center">
          <div class="text-[28px] font-extrabold text-[#22c55e] leading-none mb-1.5">2</div>
          <div class="text-[11px] text-[color:var(--color-txt-muted)] font-semibold uppercase tracking-wider">实战项目</div>
        </div>
      </div>
      <button class="px-8 h-11 rounded-xl text-[15px] font-semibold text-white bg-gradient-to-r from-[#f59e0b] to-[#d97706] border-none cursor-pointer shadow-[0_4px_16px_rgba(245,158,11,0.3)] transition-all duration-200 hover:-translate-y-0.5" @click="$emit('start')">
        开始学习
      </button>
    </div>
  `
}
</script>
