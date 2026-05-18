<template>
  <div class="animate-[fade-in_0.5s_ease]">
    <div class="text-center py-12 px-5 max-w-[840px] mx-auto">
      <!-- Hero -->
      <div class="mb-11">
        <div class="w-20 h-20 rounded-[20px] bg-gradient-to-br from-[#22c55e] to-[#15803d] inline-flex items-center justify-center text-white text-[36px] font-extrabold mb-5 shadow-[0_8px_32px_rgba(34,197,94,0.25)] relative">
          V3
          <div class="absolute -inset-1 rounded-3xl bg-gradient-to-br from-[rgba(34,197,94,0.3)] to-transparent -z-10 blur-xl opacity-60"></div>
        </div>
        <h1 class="text-[34px] text-[color:var(--color-txt-heading)] mb-3.5 font-extrabold tracking-tight leading-tight">
          欢迎来到 <span class="bg-gradient-to-r from-[#22c55e] to-[#3b82f6] bg-clip-text text-transparent">Vue 3</span> 语法学习平台
        </h1>
        <p class="text-[15px] text-[color:var(--color-txt-muted)] leading-relaxed max-w-[560px] mx-auto">
          涵盖 Vue 3 所有核心 API + Vite 配置，每个知识点都配有详细说明、可运行的代码示例和动手练习。<br>
          在左侧菜单中选择一个主题开始学习！
        </p>
      </div>

      <!-- Feature Cards - Bento Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 max-w-[760px] mx-auto">
        <div
          v-for="f in features"
          :key="f.title"
          class="bg-[color:var(--color-surface-card)] backdrop-blur-md border border-[color:var(--color-border-default)] rounded-2xl text-center transition-all duration-300 hover:-translate-y-1 hover:border-[color:var(--color-border-primary)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.3),0_0_0_1px_rgba(34,197,94,0.1)] group relative overflow-hidden cursor-default"
        >
          <div class="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#22c55e] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div class="p-7 pt-8">
            <div
              class="w-12 h-12 rounded-xl inline-flex items-center justify-center mb-3.5 text-xl"
              :class="f.iconBg"
            >
              <component :is="f.icon" />
            </div>
            <div class="font-semibold text-[color:var(--color-txt-heading)] mb-1.5 text-[15px]">{{ f.title }}</div>
            <div class="text-[13px] text-[color:var(--color-txt-muted)] leading-relaxed">{{ f.desc }}</div>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="flex justify-center gap-2 mb-10 max-w-[760px] mx-auto">
        <div
          v-for="s in stats"
          :key="s.label"
          class="flex-1 bg-[color:var(--color-surface-card)] border border-[color:var(--color-border-default)] rounded-[14px] p-5 text-center shadow-[0_1px_2px_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.03)]"
        >
          <div class="text-[32px] font-extrabold text-[color:var(--color-primary)] tabular-nums leading-none mb-1.5">{{ s.value }}</div>
          <div class="text-[11px] text-[color:var(--color-txt-muted)] font-semibold uppercase tracking-wider">{{ s.label }}</div>
        </div>
      </div>

      <!-- CTA Button -->
      <button
        class="px-8 h-11 rounded-xl text-[15px] font-semibold text-white bg-gradient-to-r from-[#22c55e] to-[#16a34a] border-none cursor-pointer shadow-[0_4px_16px_rgba(34,197,94,0.3)] transition-all duration-200 hover:shadow-[0_6px_24px_rgba(34,197,94,0.4)] hover:-translate-y-0.5 active:translate-y-0"
        @click="$emit('start')"
      >
        开始学习
      </button>
    </div>
  </div>
</template>

<script setup>
import { ThunderboltOutlined, CodeOutlined, ExperimentOutlined } from '@ant-design/icons-vue'

defineEmits(['start'])

const features = [
  { icon: ThunderboltOutlined, iconBg: 'bg-[rgba(34,197,94,0.1)] text-[color:var(--color-primary)]', title: '50+ API', desc: '涵盖 Composition API、生命周期、指令、Vite 配置等全部知识' },
  { icon: CodeOutlined, iconBg: 'bg-[rgba(59,130,246,0.1)] text-[color:var(--color-accent-blue)]', title: '交互式代码', desc: '直接在浏览器中编辑和运行 Vue 3 代码，即时查看结果' },
  { icon: ExperimentOutlined, iconBg: 'bg-[rgba(168,85,247,0.1)] text-[color:var(--color-accent-purple)]', title: '动手练习', desc: '每个 API 都配有练习题、提示和参考答案' }
]

const stats = [
  { label: '知识点', value: 50 },
  { label: '代码示例', value: 50 },
  { label: '练习题', value: 50 },
  { label: '分类', value: 9 }
]
</script>
