<template>
  <a-layout-sider
    width="260"
    class="app-sider"
    :collapsed="false"
    :trigger="null"
    collapsible
  >
    <div class="sidebar-wrapper pt-2">
      <a-menu
        :selectedKeys="selectedKeys"
        :openKeys="openKeys"
        mode="inline"
        :theme="isDark ? 'dark' : 'light'"
        :items="menuItems"
        class="sidebar-menu"
        @click="$emit('menu-click', $event)"
        @openChange="$emit('update:openKeys', $event)"
      />
    </div>
  </a-layout-sider>
</template>

<script setup>
import { computed, h } from 'vue'
import {
  CheckCircleOutlined,
  ThunderboltOutlined,
  FieldTimeOutlined,
  ApartmentOutlined,
  ApartmentOutlined as ComponentOutlined,
  AppstoreOutlined,
  CodeOutlined,
  ToolOutlined,
  SettingOutlined
} from '@ant-design/icons-vue'
import { categories, topics } from '../data/topics.js'

const categoryIcons = {
  reactivity: ThunderboltOutlined,
  lifecycle: FieldTimeOutlined,
  dependency: ApartmentOutlined,
  component: ComponentOutlined,
  builtins: AppstoreOutlined,
  directives: CodeOutlined,
  utilities: ToolOutlined,
  advanced: SettingOutlined,
  vite: SettingOutlined
}

const props = defineProps({
  selectedKeys: Array,
  openKeys: Array,
  searchText: String,
  completedTopics: Object,
  isDark: Boolean
})

defineEmits(['menu-click', 'update:openKeys'])

const filteredCategories = computed(() => {
  if (!props.searchText) return categories
  const q = props.searchText.toLowerCase()
  return categories
    .map(cat => ({
      ...cat,
      topics: cat.topics.filter(t =>
        t.toLowerCase().includes(q) || (topics[t]?.title || '').toLowerCase().includes(q)
      )
    }))
    .filter(cat => cat.topics.length > 0)
})

const menuItems = computed(() => {
  return filteredCategories.value.map(cat => ({
    key: cat.id,
    icon: () => h(categoryIcons[cat.id] || CodeOutlined),
    label: cat.name,
    children: cat.topics.map(topicId => {
      const topic = topics[topicId]
      const completed = props.completedTopics?.has(topicId)
      return {
        key: topicId,
        label: h('span', {
          style: 'display:flex;align-items:center;justify-content:space-between;width:100%'
        }, [
          h('span', topic?.title || topicId),
          completed ? h(CheckCircleOutlined, {
            style: 'color:var(--color-primary);font-size:13px'
          }) : null
        ])
      }
    })
  }))
})
</script>
