<template>
  <a-card class="!bg-[color:var(--color-surface-card)] !border-[color:var(--color-border-default)] !rounded-[14px] !shadow-[0_1px_2px_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.03)] mb-5 overflow-hidden transition-shadow duration-300 hover:!shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_0_1px_rgba(34,197,94,0.1)]" size="small">
    <template #title>
      <span class="text-sm font-semibold text-[color:var(--color-txt-heading)]">{{ icon }} {{ title }}</span>
    </template>
    <template #extra>
      <a-space>
        <a-button type="primary" size="small" class="!rounded-lg" @click="handleRun">
          <template #icon><PlayCircleOutlined /></template>
          运行
        </a-button>
        <a-button size="small" class="!rounded-lg" @click="handleReset">
          <template #icon><ReloadOutlined /></template>
          重置
        </a-button>
      </a-space>
    </template>

    <div class="relative">
      <textarea
        ref="editorRef"
        :value="modelValue"
        class="w-full min-h-[220px] px-5 py-4.5 bg-[color:var(--color-surface-code)] text-[color:var(--color-txt)] border-none outline-none font-[family-name:var(--font-mono)] text-[13.5px] leading-[1.8] resize-y tab-size-2 transition-colors"
        spellcheck="false"
        @input="onInput"
        @keydown.tab.prevent="insertTab"
        @keydown="onKeydown"
      ></textarea>

      <!-- Code hints dropdown -->
      <div
        v-if="showHints && filteredHints.length"
        class="absolute z-50 bg-[color:var(--color-surface-card)] border border-[color:var(--color-border-default)] rounded-lg shadow-[0_8px_32px_rgba(0,0,0,0.4)] py-1 max-h-[180px] overflow-y-auto"
        :style="hintPosition"
      >
        <div
          v-for="(hint, i) in filteredHints"
          :key="hint.label"
          class="px-3 py-1.5 cursor-pointer text-[13px] font-[family-name:var(--font-mono)] flex items-center gap-2 transition-colors duration-100"
          :class="i === activeHintIndex ? 'bg-[rgba(34,197,94,0.1)] text-[color:var(--color-primary)]' : 'text-[color:var(--color-txt)] hover:bg-[color:var(--color-surface-hover)]'"
          @mousedown.prevent="applyHint(hint)"
        >
          <span class="text-[11px] font-semibold px-1.5 py-0.5 rounded bg-[rgba(34,197,94,0.12)] text-[color:var(--color-primary)]">{{ hint.kind }}</span>
          <span>{{ hint.label }}</span>
        </div>
      </div>
    </div>

    <div class="px-5 py-4 border-t border-[color:var(--color-border-default)]">
      <div class="text-[10px] uppercase tracking-widest text-[color:var(--color-txt-muted)] font-bold mb-2.5">输出结果</div>
      <div class="font-[family-name:var(--font-mono)] text-[13px] leading-[1.7] whitespace-pre-wrap break-all min-h-6">
        <template v-if="result">
          <span v-if="resultType === 'success'" class="text-[color:var(--color-success)] px-3.5 py-2.5 bg-[rgba(34,197,94,0.06)] rounded-lg border border-[rgba(34,197,94,0.1)] inline-block">{{ result }}</span>
          <span v-else-if="resultType === 'error'" class="text-[color:var(--color-error)] px-3.5 py-2.5 bg-[rgba(239,68,68,0.06)] rounded-lg border border-[rgba(239,68,68,0.1)] inline-block">{{ result }}</span>
          <span v-else class="text-[color:var(--color-txt-muted)]">{{ result }}</span>
        </template>
        <a-empty v-else description="点击运行查看输出" :image="emptyImage" />
      </div>
    </div>
  </a-card>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { PlayCircleOutlined, ReloadOutlined } from '@ant-design/icons-vue'
import { Empty } from 'ant-design-vue'
import { captureExecution } from '../utils/sandbox.js'

const props = defineProps({
  modelValue: String,
  title: { type: String, default: '代码示例' },
  icon: { type: String, default: ' ' },
  defaultCode: String
})

const emit = defineEmits(['update:modelValue', 'run'])

const editorRef = ref(null)
const result = ref('')
const resultType = ref('')
const emptyImage = Empty.PRESENTED_IMAGE_SIMPLE

// Code hints
const showHints = ref(false)
const activeHintIndex = ref(0)
const currentWord = ref('')
const hintPosition = ref({ top: '0px', left: '0px' })

const VUE3_HINTS = [
  { label: 'ref', kind: 'API', insert: 'ref(' },
  { label: 'reactive', kind: 'API', insert: 'reactive(' },
  { label: 'computed', kind: 'API', insert: 'computed(' },
  { label: 'watch', kind: 'API', insert: 'watch(' },
  { label: 'watchEffect', kind: 'API', insert: 'watchEffect(' },
  { label: 'onMounted', kind: 'Hook', insert: 'onMounted(' },
  { label: 'onUnmounted', kind: 'Hook', insert: 'onUnmounted(' },
  { label: 'onUpdated', kind: 'Hook', insert: 'onUpdated(' },
  { label: 'onBeforeMount', kind: 'Hook', insert: 'onBeforeMount(' },
  { label: 'onBeforeUnmount', kind: 'Hook', insert: 'onBeforeUnmount(' },
  { label: 'provide', kind: 'API', insert: 'provide(' },
  { label: 'inject', kind: 'API', insert: 'inject(' },
  { label: 'nextTick', kind: 'API', insert: 'nextTick(' },
  { label: 'defineProps', kind: 'API', insert: 'defineProps(' },
  { label: 'defineEmits', kind: 'API', insert: 'defineEmits(' },
  { label: 'defineExpose', kind: 'API', insert: 'defineExpose(' },
  { label: 'useSlots', kind: 'API', insert: 'useSlots(' },
  { label: 'useAttrs', kind: 'API', insert: 'useAttrs(' },
  { label: 'toRef', kind: 'API', insert: 'toRef(' },
  { label: 'toRefs', kind: 'API', insert: 'toRefs(' },
  { label: 'isRef', kind: 'API', insert: 'isRef(' },
  { label: 'unref', kind: 'API', insert: 'unref(' },
  { label: 'shallowRef', kind: 'API', insert: 'shallowRef(' },
  { label: 'triggerRef', kind: 'API', insert: 'triggerRef(' },
  { label: 'shallowReactive', kind: 'API', insert: 'shallowReactive(' },
  { label: 'markRaw', kind: 'API', insert: 'markRaw(' },
  { label: 'toRaw', kind: 'API', insert: 'toRaw(' },
  { label: 'readonly', kind: 'API', insert: 'readonly(' },
  { label: 'shallowReadonly', kind: 'API', insert: 'shallowReadonly(' },
  { label: 'customRef', kind: 'API', insert: 'customRef(' },
  { label: 'effectScope', kind: 'API', insert: 'effectScope(' },
  { label: 'getCurrentInstance', kind: 'API', insert: 'getCurrentInstance(' },
  { label: 'h', kind: 'API', insert: 'h(' },
  { label: 'render', kind: 'API', insert: 'render(' },
  { label: 'resolveComponent', kind: 'API', insert: 'resolveComponent(' },
  { label: 'defineComponent', kind: 'API', insert: 'defineComponent(' },
  { label: 'withDefaults', kind: 'API', insert: 'withDefaults(' },
  { label: 'console.log', kind: 'Func', insert: 'console.log(' },
  { label: 'console.warn', kind: 'Func', insert: 'console.warn(' },
  { label: 'console.error', kind: 'Func', insert: 'console.error(' },
  { label: 'setTimeout', kind: 'Func', insert: 'setTimeout(' },
  { label: 'Promise', kind: 'Class', insert: 'Promise' },
  { label: 'Promise.resolve', kind: 'Func', insert: 'Promise.resolve(' },
  { label: 'Promise.all', kind: 'Func', insert: 'Promise.all(' },
]

const filteredHints = computed(() => {
  if (!currentWord.value || currentWord.value.length < 2) return []
  const word = currentWord.value.toLowerCase()
  return VUE3_HINTS.filter(h => h.label.toLowerCase().startsWith(word)).slice(0, 8)
})

function handleRun() {
  const { output, error } = captureExecution(props.modelValue)
  if (error) {
    result.value = error
    resultType.value = 'error'
  } else {
    result.value = output
    resultType.value = 'success'
  }
  emit('run', { output, error })
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

function onInput(e) {
  emit('update:modelValue', e.target.value)
  updateHints(e.target)
}

function onKeydown(e) {
  if (showHints.value && filteredHints.value.length) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      activeHintIndex.value = (activeHintIndex.value + 1) % filteredHints.value.length
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      activeHintIndex.value = (activeHintIndex.value - 1 + filteredHints.value.length) % filteredHints.value.length
      return
    }
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault()
      applyHint(filteredHints.value[activeHintIndex.value])
      return
    }
    if (e.key === 'Escape') {
      showHints.value = false
      return
    }
  }
}

function updateHints(textarea) {
  const pos = textarea.selectionStart
  const text = textarea.value.substring(0, pos)
  const match = text.match(/([a-zA-Z.]+)$/)
  if (match && match[1].length >= 2) {
    currentWord.value = match[1]
    showHints.value = true
    activeHintIndex.value = 0
    const lines = text.split('\n')
    const lineNum = lines.length
    const colNum = lines[lines.length - 1].length
    hintPosition.value = {
      top: `${Math.min(lineNum * 24 + 16, 180)}px`,
      left: `${Math.min(colNum * 8 + 20, 400)}px`
    }
  } else {
    showHints.value = false
    currentWord.value = ''
  }
}

function applyHint(hint) {
  const textarea = editorRef.value
  const pos = textarea.selectionStart
  const text = textarea.value
  const before = text.substring(0, pos)
  const match = before.match(/([a-zA-Z.]+)$/)
  if (match) {
    const start = pos - match[1].length
    const after = text.substring(pos)
    const newText = text.substring(0, start) + hint.insert + after
    emit('update:modelValue', newText)
    nextTick(() => {
      const newPos = start + hint.insert.length
      textarea.selectionStart = textarea.selectionEnd = newPos
      textarea.focus()
    })
  }
  showHints.value = false
  currentWord.value = ''
}

function clearResult() {
  result.value = ''
  resultType.value = ''
}

defineExpose({ clearResult })
</script>
