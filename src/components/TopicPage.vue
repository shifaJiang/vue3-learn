<template>
  <div class="animate-[fade-in_0.35s_ease] max-w-[960px]">
    <!-- Title & Meta -->
    <div class="mb-6">
      <div class="flex items-center gap-3.5 mb-3">
        <h1 class="text-[28px] font-bold text-[color:var(--color-txt-heading)] font-[family-name:var(--font-mono)] tracking-tight">{{ topic.api }}</h1>
        <span
          class="text-[12px] font-semibold px-3 py-0.5 rounded-full tracking-wide"
          :class="difficultyClass"
        >
          {{ difficultyText }}
        </span>
        <a-tooltip :title="isCompleted ? '点击取消完成' : '标记为已完成'">
          <a-button
            size="small"
            :type="isCompleted ? 'primary' : 'default'"
            class="!rounded-lg"
            @click="$emit('complete', topicId)"
          >
            <template #icon>
              <CheckCircleOutlined v-if="isCompleted" />
              <BorderOutlined v-else />
            </template>
            {{ isCompleted ? '已完成' : '标记完成' }}
          </a-button>
        </a-tooltip>
      </div>

      <!-- Progress Steps -->
      <a-steps
        :current="currentStep"
        size="small"
        :items="stepItems"
        class="mt-2"
      />
    </div>

    <!-- Description -->
    <a-card class="desc-card !bg-[color:var(--color-surface-card)] !border-[color:var(--color-border-default)] !rounded-[14px] !shadow-[0_1px_2px_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.03)] backdrop-blur-md mb-5" size="small">
      <a-collapse
        :active-key="['desc']"
        :bordered="false"
        expand-icon-position="end"
        style="background: transparent"
      >
        <a-collapse-panel key="desc" :show-arrow="false">
          <template #header>
            <span class="font-semibold text-[14px] text-[color:var(--color-txt-heading)] flex items-center">
              <InfoCircleOutlined class="mr-1.5 text-[color:var(--color-primary)]" />
              API 说明
            </span>
          </template>
          <div class="text-[color:var(--color-txt-muted)] leading-[1.9] text-sm pb-1 [&_code]:bg-[rgba(34,197,94,0.08)] [&_code]:text-[color:var(--color-primary)] [&_code]:px-2 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:text-[13px] [&_code]:font-[family-name:var(--font-mono)] [&_code]:border [&_code]:border-[color:var(--color-border-primary)] [&_strong]:text-[color:var(--color-txt)]" v-html="topic.description"></div>
        </a-collapse-panel>
      </a-collapse>
    </a-card>

    <!-- Code Example -->
    <CodePlayground
      ref="playgroundRef"
      v-model="code"
      :default-code="topic.code"
      title="代码示例"
      icon=" "
      @run="onPlaygroundRun"
    />

    <!-- Practice -->
    <PracticeSection
      v-if="topic.practice"
      ref="practiceRef"
      v-model="practiceCode"
      :title="topic.practice.title"
      :description="topic.practice.description"
      :hint="topic.practice.hint"
      :solution="topic.practice.solution"
      :default-code="topic.practice.solution"
    />

    <!-- Navigation -->
    <div class="flex justify-between mt-10 pt-7 border-t border-[color:var(--color-border-default)]">
      <a-button @click="$emit('prev')" :disabled="!hasPrev" size="large" class="!rounded-xl !font-medium !h-[42px] !px-6">
        <template #icon><LeftOutlined /></template>
        上一个
      </a-button>
      <a-button type="primary" @click="$emit('next')" :disabled="!hasNext" size="large" class="!rounded-xl !font-medium !h-[42px] !px-6">
        下一个
        <template #icon><RightOutlined /></template>
      </a-button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import {
  CheckCircleOutlined,
  BorderOutlined,
  LeftOutlined,
  RightOutlined,
  InfoCircleOutlined
} from '@ant-design/icons-vue'
import CodePlayground from './CodePlayground.vue'
import PracticeSection from './PracticeSection.vue'

const props = defineProps({
  topic: Object,
  topicId: String,
  hasPrev: Boolean,
  hasNext: Boolean,
  isCompleted: Boolean
})

defineEmits(['prev', 'next', 'complete'])

const code = ref('')
const practiceCode = ref('')
const playgroundRef = ref(null)
const practiceRef = ref(null)

const difficultyClass = computed(() => {
  const map = {
    easy: 'text-[color:var(--color-success)] bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.2)]',
    medium: 'text-[color:var(--color-warning)] bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.2)]',
    hard: 'text-[color:var(--color-error)] bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)]'
  }
  return map[props.topic?.difficulty] || ''
})

const difficultyText = computed(() => {
  const map = { easy: '入门', medium: '进阶', hard: '高级' }
  return map[props.topic?.difficulty] || props.topic?.difficulty
})

const currentStep = ref(0)
const stepItems = [
  { title: '阅读说明' },
  { title: '运行示例' },
  { title: '完成练习' },
  { title: '标记完成' }
]

watch(() => props.topicId, () => {
  if (props.topic) {
    code.value = props.topic.code
    practiceCode.value = props.topic.practice?.solution || ''
    currentStep.value = 0
    playgroundRef.value?.clearResult()
    practiceRef.value?.clearResult()
  }
}, { immediate: true })

function onPlaygroundRun() {
  if (currentStep.value < 1) currentStep.value = 1
}
</script>
