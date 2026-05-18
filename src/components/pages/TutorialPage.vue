<template>
  <div class="flex h-[calc(100vh-60px)]">
    <!-- Sidebar -->
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
    <!-- Content -->
    <div class="app-content flex-1 p-8 overflow-y-auto">
      <WelcomePage v-if="!currentTopic" @start="startLearning" />
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
import { ref, computed, inject } from 'vue'
import { categories, topics } from '../../data/topics.js'
import WelcomePage from '../WelcomePage.vue'
import TopicPage from '../TopicPage.vue'

const isDark = inject('isDark')
const completedTopics = inject('completedTopics')

const currentTopic = ref('')
const selectedKeys = ref([])
const openKeys = ref(categories.map(c => c.id))

const topicData = computed(() => topics[currentTopic.value] || null)
const allTopics = computed(() => categories.flatMap(c => c.topics))
const currentIndex = computed(() => allTopics.value.indexOf(currentTopic.value))
const prevTopic = computed(() => currentIndex.value > 0 ? allTopics.value[currentIndex.value - 1] : null)
const nextTopic = computed(() => currentIndex.value < allTopics.value.length - 1 ? allTopics.value[currentIndex.value + 1] : null)

const menuItems = computed(() => categories.map(cat => ({
  key: cat.id,
  label: cat.name,
  children: cat.topics.map(tid => ({
    key: tid,
    label: topics[tid]?.title || tid
  }))
})))

function onMenuClick({ key }) {
  if (topics[key]) {
    currentTopic.value = key
    selectedKeys.value = [key]
  }
}
function startLearning() {
  const first = allTopics.value[0]
  currentTopic.value = first
  selectedKeys.value = [first]
  openKeys.value = [categories[0].id]
}
function goTo(topic) {
  if (!topic) return
  currentTopic.value = topic
  selectedKeys.value = [topic]
  const cat = categories.find(c => c.topics.includes(topic))
  if (cat && !openKeys.value.includes(cat.id)) openKeys.value = [...openKeys.value, cat.id]
}
function toggleComplete(id) {
  const s = new Set(completedTopics.value)
  s.has(id) ? s.delete(id) : s.add(id)
  completedTopics.value = s
}
</script>
