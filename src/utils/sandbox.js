// Vue 3 API 沙箱执行器
// 提供 Vue 3 响应式 API 的浏览器端模拟实现

function createVueApis() {
  const ref = (v) => {
    const r = {
      value: typeof v === 'object' && v !== null ? JSON.parse(JSON.stringify(v)) : v,
      __isRef: true
    }
    return new Proxy(r, {
      get(target, key) { return key === 'value' ? target.value : target[key] },
      set(target, key, val) { if (key === 'value') { target.value = val; return true } return false }
    })
  }

  const reactive = (obj) => {
    const data = JSON.parse(JSON.stringify(obj))
    return new Proxy(data, {
      get(target, key) { return target[key] },
      set(target, key, val) { target[key] = val; return true }
    })
  }

  return {
    ref,
    reactive,
    computed: (fn) => {
      const val = typeof fn === 'function' ? fn() : fn.get()
      return { value: val, __isComputed: true }
    },
    watch: (source, cb, opts) => {
      const val = Array.isArray(source)
        ? source.map(s => s && s.__isRef ? s.value : s)
        : source && source.__isRef ? source.value : source
      if (opts?.immediate) cb(val, undefined)
      return () => {}
    },
    watchEffect: (fn) => { fn(() => {}); return () => {} },
    onMounted: (fn) => fn(),
    onUpdated: () => {},
    onUnmounted: () => {},
    onBeforeMount: (fn) => fn(),
    onBeforeUpdate: () => {},
    onBeforeUnmount: () => {},
    onErrorCaptured: () => {},
    onActivated: () => {},
    onDeactivated: () => {},
    onServerPrefetch: () => {},
    provide: () => {},
    inject: (key, defaultVal) => defaultVal,
    isRef: (v) => v && v.__isRef === true,
    unref: (v) => v && v.__isRef ? v.value : v,
    toRef: (obj, key) => ref(obj[key]),
    toRefs: (obj) => { const r = {}; for (const k in obj) r[k] = ref(obj[k]); return r },
    toRaw: (obj) => obj && obj.__isRef ? { value: obj.value } : JSON.parse(JSON.stringify(obj)),
    markRaw: (obj) => obj,
    shallowRef: (v) => ref(v),
    shallowReactive: (obj) => reactive(obj),
    shallowReadonly: (obj) => reactive(JSON.parse(JSON.stringify(obj))),
    readonly: (obj) => reactive(JSON.parse(JSON.stringify(obj))),
    triggerRef: () => {},
    customRef: (factory) => {
      const { get, set } = factory(() => {}, () => {})
      get()
      return { get value() { return get() }, set value(v) { set(v) } }
    },
    effectScope: () => ({ run: (fn) => fn(), stop: () => {} }),
    h: (tag, props, children) => ({ tag, props, children }),
    toValue: (v) => typeof v === 'function' ? v() : v && v.__isRef ? v.value : v,
    defineProps: (p) => p,
    defineEmits: (e) => e,
    defineExpose: () => {},
    defineSlots: () => {},
    useSlots: () => ({}),
    useAttrs: () => ({}),
    withDefaults: (p, d) => ({ ...p, ...d }),
    renderSlot: (slots, name) => slots[name]?.(),
    nextTick: (fn) => setTimeout(fn, 0)
  }
}

const API_NAMES = [
  'console', 'ref', 'reactive', 'computed', 'watch', 'watchEffect',
  'onMounted', 'onUpdated', 'onUnmounted', 'onBeforeMount', 'onBeforeUpdate',
  'onBeforeUnmount', 'onErrorCaptured', 'onActivated', 'onDeactivated',
  'onServerPrefetch', 'provide', 'inject', 'isRef', 'unref', 'toRef',
  'toRefs', 'toRaw', 'markRaw', 'shallowRef', 'shallowReactive',
  'shallowReadonly', 'readonly', 'triggerRef', 'customRef', 'effectScope',
  'h', 'toValue', 'defineProps', 'defineEmits', 'defineExpose',
  'defineSlots', 'useSlots', 'useAttrs', 'withDefaults', 'renderSlot', 'nextTick',
  'setTimeout', 'Promise'
]

export function captureExecution(codeStr) {
  const logs = []
  const errors = []

  const fakeConsole = {
    log: (...args) => logs.push(args.map(a =>
      typeof a === 'object' && a !== null ? JSON.stringify(a, null, 2) : String(a)
    ).join(' ')),
    warn: (...args) => logs.push('⚠ ' + args.join(' ')),
    error: (...args) => errors.push(args.join(' '))
  }

  const processed = codeStr
    .replace(/^import\s+.*?from\s+['"].*?['"];?\s*$/gm, '')
    .replace(/^import\s+\{[^}]*\}\s+from\s+['"].*?['"];?\s*$/gm, '')

  const vue = createVueApis()
  const apiValues = [
    fakeConsole, vue.ref, vue.reactive, vue.computed, vue.watch, vue.watchEffect,
    vue.onMounted, vue.onUpdated, vue.onUnmounted, vue.onBeforeMount, vue.onBeforeUpdate,
    vue.onBeforeUnmount, vue.onErrorCaptured, vue.onActivated, vue.onDeactivated,
    vue.onServerPrefetch, vue.provide, vue.inject, vue.isRef, vue.unref, vue.toRef,
    vue.toRefs, vue.toRaw, vue.markRaw, vue.shallowRef, vue.shallowReactive,
    vue.shallowReadonly, vue.readonly, vue.triggerRef, vue.customRef, vue.effectScope,
    vue.h, vue.toValue, vue.defineProps, vue.defineEmits, vue.defineExpose,
    vue.defineSlots, vue.useSlots, vue.useAttrs, vue.withDefaults, vue.renderSlot, vue.nextTick,
    setTimeout, Promise
  ]

  try {
    const fn = new Function(...API_NAMES, processed)
    fn(...apiValues)
    return { output: logs.join('\n') || '(无输出)', error: null }
  } catch (e) {
    return { output: logs.join('\n'), error: e.message }
  }
}
