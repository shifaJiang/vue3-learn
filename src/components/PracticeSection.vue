<template>
  <a-card class="!bg-[color:var(--color-surface-card)] !border-[color:var(--color-border-default)] !rounded-[14px] !shadow-[0_1px_2px_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.03)] mb-5 overflow-hidden transition-shadow duration-300 hover:!shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_0_1px_rgba(34,197,94,0.1)]" size="small">
    <template #title>
      <span class="text-sm font-semibold text-[color:var(--color-txt-heading)]"> {{ title }}</span>
    </template>
    <template #extra>
      <a-space>
        <a-tooltip title="运行练习代码">
          <a-button type="primary" size="small" class="!rounded-lg" @click="handleRun">
            <template #icon><PlayCircleOutlined /></template>
            运行
          </a-button>
        </a-tooltip>
        <a-tooltip title="重置代码">
          <a-button size="small" class="!rounded-lg" @click="handleReset">
            <template #icon><ReloadOutlined /></template>
            重置
          </a-button>
        </a-tooltip>
        <a-tooltip :title="showHint ? '隐藏提示' : '查看提示'">
          <a-button size="small" :type="showHint ? 'warning' : 'default'" class="!rounded-lg" @click="showHint = !showHint">
            <template #icon><BulbOutlined /></template>
            提示
          </a-button>
        </a-tooltip>
        <a-tooltip :title="showSolution ? '隐藏答案' : '查看答案'">
          <a-button size="small" :type="showSolution ? 'primary' : 'default'" class="!rounded-lg" @click="showSolution = !showSolution" ghost>
            <template #icon><CodeOutlined /></template>
            答案
          </a-button>
        </a-tooltip>
      </a-space>
    </template>

    <!-- Practice description -->
    <a-alert
      v-if="description"
      type="info"
      :message="null"
      class="!mx-5 !mt-4 !mb-0 !bg-[rgba(34,197,94,0.04)] !border-[color:var(--color-border-primary)] !rounded-[10px]"
    >
      <template #message>
        <div class="text-[color:var(--color-txt-muted)] leading-[1.8] text-sm [&_code]:bg-[rgba(34,197,94,0.08)] [&_code]:text-[color:var(--color-primary)] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs [&_code]:font-[family-name:var(--font-mono)] [&_code]:border [&_code]:border-[color:var(--color-border-primary)]" v-html="description"></div>
      </template>
    </a-alert>

    <!-- Editor -->
    <div class="mt-4">
      <textarea
        :value="modelValue"
        class="w-full min-h-[160px] px-5 py-4 bg-[color:var(--color-surface-code)] text-[color:var(--color-txt)] border-none outline-none font-[family-name:var(--font-mono)] text-[13.5px] leading-[1.8] resize-y tab-size-2"
        spellcheck="false"
        @input="$emit('update:modelValue', $event.target.value)"
        @keydown.tab.prevent="insertTab"
      ></textarea>
    </div>

    <!-- Hint -->
    <div
      v-if="showHint"
      class="mx-5 mt-3 px-[18px] py-3.5 bg-[rgba(245,158,11,0.05)] border border-[rgba(245,158,11,0.15)] rounded-[10px] text-[color:var(--color-warning)] text-[13px] leading-[1.7] flex items-start gap-2"
    >
      <BulbOutlined class="mt-0.5 flex-shrink-0" />
      <span>{{ hint }}</span>
    </div>

    <!-- Solution -->
    <div v-if="showSolution" class="mx-5 mt-3 bg-[color:var(--color-surface-code)] border border-[color:var(--color-border-default)] rounded-[10px] overflow-hidden">
      <div class="px-5 py-2.5 border-b border-[color:var(--color-border-default)] text-[color:var(--color-info)] text-[12px] font-semibold uppercase tracking-wider flex items-center gap-1.5">
        <CodeOutlined />
        参考答案
      </div>
      <pre class="bg-transparent text-[color:var(--color-txt)] px-5 py-4 font-[family-name:var(--font-mono)] text-[13px] leading-[1.8] whitespace-pre-wrap overflow-x-auto m-0">{{ solution }}</pre>
    </div>

    <!-- Result -->
    <div class="px-5 py-4 border-t border-[color:var(--color-border-default)]">
      <div class="text-[10px] uppercase tracking-widest text-[color:var(--color-txt-muted)] font-bold mb-2.5">输出结果</div>
      <div class="font-[family-name:var(--font-mono)] text-[13px] leading-[1.7] whitespace-pre-wrap break-all min-h-6">
        <template v-if="result">
          <span v-if="resultType === 'success'" class="text-[color:var(--color-success)] px-3.5 py-2.5 bg-[rgba(34,197,94,0.06)] rounded-lg border border-[rgba(34,197,94,0.1)] inline-block">{{ result }}</span>
          <span v-else-if="resultType === 'error'" class="text-[color:var(--color-error)] px-3.5 py-2.5 bg-[rgba(239,68,68,0.06)] rounded-lg border border-[rgba(239,68,68,0.1)] inline-block">{{ result }}</span>
        </template>
        <a-empty v-else description="点击运行查看输出" :image="Empty.PRESENTED_IMAGE_SIMPLE" />
      </div>
    </div>
  </a-card>
</template>

<script setup>
import { ref, computed } from 'vue'
import { PlayCircleOutlined, ReloadOutlined, BulbOutlined, CodeOutlined } from '@ant-design/icons-vue'
import { Empty } from 'ant-design-vue'
import { captureExecution } from '../utils/sandbox.js'

const props = defineProps({
  modelValue: String,
  title: String,
  description: String,
  hint: String,
  solution: String,
  defaultCode: String
})

const emit = defineEmits(['update:modelValue'])

const result = ref('')
const resultType = ref('')
const showHint = ref(false)
const showSolution = ref(false)

function handleRun() {
  const { output, error } = captureExecution(props.modelValue)
  if (error) {
    result.value = error
    resultType.value = 'error'
  } else {
    result.value = output
    resultType.value = 'success'
  }
}

function handleReset() {
  emit('update:modelValue', props.defaultCode || '')
  result.value = ''
  resultType.value = ''
}

function insertTab(e) {
  const textarea = e.target
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const val = textarea.value
  textarea.value = val.substring(0, start) + '  ' + val.substring(end)
  textarea.selectionStart = textarea.selectionEnd = start + 2
  emit('update:modelValue', textarea.value)
}

function clearResult() {
  result.value = ''
  resultType.value = ''
  showHint.value = false
  showSolution.value = false
}

defineExpose({ clearResult })
</script>
