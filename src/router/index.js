import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'tutorial',
    component: () => import('../components/pages/TutorialPage.vue'),
    meta: { title: 'Vue 3 教程', sidebar: 'tutorial' }
  },
  {
    path: '/api',
    name: 'api',
    component: () => import('../components/pages/ApiPracticePage.vue'),
    meta: { title: 'API 速查', sidebar: 'api' }
  },
  {
    path: '/vite',
    name: 'vite',
    component: () => import('../components/pages/ViteConfigPage.vue'),
    meta: { title: 'Vite 配置', sidebar: 'vite' }
  },
  {
    path: '/agent',
    name: 'agent',
    component: () => import('../components/pages/AgentDevPage.vue'),
    meta: { title: 'AI Agent', sidebar: 'agent' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
