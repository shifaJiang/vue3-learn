export const categories = [
  {
    id: 'reactivity',
    name: '响应式',
    topics: ['declare-state', 'update-state', 'computed']
  },
  {
    id: 'template',
    name: '模板语法',
    topics: ['template-syntax', 'minimal-template']
  },
  {
    id: 'dom',
    name: '样式与DOM',
    topics: ['styles', 'dom-loop', 'click-event', 'dom-ref', 'conditional-render']
  },
  {
    id: 'lifecycle',
    name: '生命周期',
    topics: ['component-lifecycle', 'on-mount', 'on-unmount']
  },
  {
    id: 'component',
    name: '组件通信',
    topics: ['component-compose', 'props', 'emit-event', 'slot', 'slot-content', 'context']
  },
  {
    id: 'forms-web',
    name: '表单与Web',
    topics: ['form-input', 'input-text', 'checkbox', 'radio', 'select', 'render-app', 'fetch-data']
  }
]

export const topics = {
  // ==================== 响应式 ====================
  'declare-state': {
    title: '声明状态',
    api: 'ref()',
    difficulty: 'easy',
    description: `使用 <code>ref()</code> 声明响应式状态。它接受一个初始值，返回一个带有 <code>.value</code> 属性的响应式对象。<br><br><strong>要点：</strong><br>• 在 <code>&lt;script&gt;</code> 中通过 <code>.value</code> 读写<br>• 在 <code>&lt;template&gt;</code> 中自动解包，无需 <code>.value</code><br>• 适合基本类型（string, number, boolean）`,
    code: `import { ref } from 'vue'

// 声明各种类型的响应式状态
const count = ref(0)
const name = ref('Vue 3')
const isVisible = ref(true)

console.log('count:', count.value)
console.log('name:', name.value)
console.log('isVisible:', isVisible.value)

// ref 也可以包装对象（但推荐用 reactive）
const config = ref({ theme: 'dark', lang: 'zh' })
console.log('theme:', config.value.theme)`,
    practice: {
      title: '练习：声明个人信息',
      description: '使用 <code>ref</code> 声明三个状态：<code>age</code>（数字 <code>20</code>）、<code>city</code>（字符串 <code>"北京"</code>）、<code>isStudent</code>（布尔 <code>true</code>）。输出这三个值。',
      hint: '分别用 ref() 包装三个不同类型的初始值',
      solution: `import { ref } from 'vue'

const age = ref(20)
const city = ref('北京')
const isStudent = ref(true)

console.log('年龄:', age.value)
console.log('城市:', city.value)
console.log('学生:', isStudent.value)`
    }
  },

  'update-state': {
    title: '更新状态',
    api: 'ref.value',
    difficulty: 'easy',
    description: `响应式状态通过 <code>.value</code> 属性来更新。每次赋值都会触发依赖该状态的视图自动更新。<br><br><strong>常见操作：</strong><br>• 直接赋值：<code>count.value = 10</code><br>• 自增/自减：<code>count.value++</code><br>• 对象属性修改：<code>state.value.name = '新名字'</code>`,
    code: `import { ref } from 'vue'

const count = ref(0)
console.log('初始:', count.value)

// 直接赋值
count.value = 5
console.log('赋值 5 后:', count.value)

// 自增操作
count.value++
count.value++
console.log('自增两次后:', count.value)

// 减法赋值
count.value -= 3
console.log('减去 3 后:', count.value)

// 字符串状态更新
const message = ref('Hello')
message.value += ' Vue 3'
console.log(message.value)`,
    practice: {
      title: '练习：状态更新',
      description: '创建 <code>score</code> 初始值为 <code>60</code>。执行以下操作后输出结果：加 <code>10</code>，乘以 <code>2</code>，减去 <code>50</code>。',
      hint: '通过 .value 进行算术运算并赋值',
      solution: `import { ref } from 'vue'

const score = ref(60)
score.value += 10
score.value *= 2
score.value -= 50
console.log('最终得分:', score.value) // 90`
    }
  },

  'computed': {
    title: '计算属性',
    api: 'computed()',
    difficulty: 'easy',
    description: `<code>computed()</code> 基于响应式状态创建衍生值。计算属性会缓存结果，只有依赖变化时才重新计算。<br><br><strong>与方法的区别：</strong><br>• 计算属性有缓存，依赖不变则不重算<br>• 方法每次访问都会重新执行<br><br><strong>使用场景：</strong>列表过滤、数据格式化、组合多个状态`,
    code: `import { ref, computed } from 'vue'

const firstName = ref('张')
const lastName = ref('三')

// 只读计算属性
const fullName = computed(() => {
  return firstName.value + lastName.value
})
console.log('全名:', fullName.value)

// 基于计算属性的计算属性
const greeting = computed(() => {
  return '你好, ' + fullName.value + '!'
})
console.log(greeting.value)

// 实用场景：列表过滤
const items = ref(['Vue', 'React', 'Angular', 'Svelte'])
const vueItems = computed(() =>
  items.value.filter(i => i.startsWith('V'))
)
console.log('V 开头:', vueItems.value)`,
    practice: {
      title: '练习：价格计算',
      description: '创建 <code>price</code>（<code>100</code>）和 <code>quantity</code>（<code>3</code>），用 <code>computed</code> 计算 <code>total</code>（总价）。再创建 <code>discount</code>（打八折后的价格）。输出总价和折后价。',
      hint: 'computed(() => price.value * quantity.value)',
      solution: `import { ref, computed } from 'vue'

const price = ref(100)
const quantity = ref(3)

const total = computed(() => price.value * quantity.value)
const discount = computed(() => total.value * 0.8)

console.log('总价:', total.value)    // 300
console.log('折后:', discount.value) // 240`
    }
  },

  // ==================== 模板语法 ====================
  'template-syntax': {
    title: '模板语法',
    api: '{{ }} 插值',
    difficulty: 'easy',
    description: `Vue 使用基于 HTML 的模板语法，允许声明式地将 DOM 绑定到组件实例的数据。<br><br><strong>文本插值：</strong><code>{{ message }}</code><br><strong>一次插值：</strong><code v-pre>{{* msg }}</code>（不会更新）<br><strong>原始 HTML：</strong><code>v-html</code> 指令<br><strong>属性绑定：</strong><code>v-bind:id</code> 或简写 <code>:id</code>`,
    code: `import { ref } from 'vue'

// 文本插值 {{ }}
const message = ref('Hello Vue 3!')
// 模板中: <p>{{ message }}</p>
console.log('插值:', message.value)

// JavaScript 表达式
const count = ref(5)
// 模板中可以写: {{ count * 2 }}
console.log('表达式:', count.value * 2)

// 三元运算
const isLoggedIn = ref(true)
const display = isLoggedIn.value ? '欢迎回来' : '请登录'
console.log(display)

// 方法调用
const items = ref([3, 1, 4, 1, 5])
console.log('排序:', [...items.value].sort((a, b) => a - b))`,
    practice: {
      title: '练习：插值表达式',
      description: '创建 <code>price</code>（<code>99.5</code>）和 <code>tax</code>（<code>0.08</code>）。在控制台输出 "含税价格: ¥XX.XX"，其中含税价 = price * (1 + tax)，保留 2 位小数。',
      hint: '使用 toFixed(2) 保留小数位',
      solution: `import { ref } from 'vue'

const price = ref(99.5)
const tax = ref(0.08)

const total = (price.value * (1 + tax.value)).toFixed(2)
console.log('含税价格: ¥' + total)`
    }
  },

  'minimal-template': {
    title: '最简模板',
    api: 'SFC 结构',
    difficulty: 'easy',
    description: `Vue 单文件组件（SFC）由三部分组成：<code>&lt;template&gt;</code>、<code>&lt;script setup&gt;</code>、<code>&lt;style&gt;</code>。<br><br><strong>最小可用模板：</strong><br><code>&lt;script setup&gt;</code> 中的顶层变量自动在模板中可用，无需额外注册。这是 Vue 3 推荐的写法。<br><br><strong>注意：</strong>模板必须有且仅有一个根元素（Vue 3 支持多根节点，但需要显式指定属性传递）。`,
    code: `import { ref } from 'vue'

// <script setup> 中声明
const greeting = ref('你好，Vue 3！')

// 模板中使用:
// <template>
//   <h1>{{ greeting }}</h1>
// </template>

// 等价的非 setup 语法糖写法:
// export default {
//   setup() {
//     const greeting = ref('你好，Vue 3！')
//     return { greeting }
//   }
// }

console.log(greeting.value)

// 最小组件结构示意
console.log('SFC 结构:')
console.log('<template>  ← 视图')
console.log('<script setup>  ← 逻辑')
console.log('<style scoped>  ← 样式')`,
    practice: {
      title: '练习：最小组件',
      description: '用 <code>ref</code> 创建 <code>title</code>（<code>"我的应用"</code>）和 <code>version</code>（<code>"1.0.0"</code>）。输出 "我的应用 v1.0.0"。',
      hint: '模板中用 {{ title }} v{{ version }} 拼接',
      solution: `import { ref } from 'vue'

const title = ref('我的应用')
const version = ref('1.0.0')

console.log(title.value + ' v' + version.value)`
    }
  },

  // ==================== 样式与DOM ====================
  'styles': {
    title: '样式',
    api: '<style scoped>',
    difficulty: 'easy',
    description: `Vue 组件的 <code>&lt;style&gt;</code> 块支持 <code>scoped</code> 属性，使样式仅作用于当前组件。<br><br><strong>关键特性：</strong><br>• <code>scoped</code>：自动添加 data 属性选择器<br>• <code>:deep()</code>：穿透 scoped 影响子组件<br>• <code>v-bind()</code>：在 CSS 中使用 JS 变量<br>• CSS Modules：<code>&lt;style module&gt;</code>`,
    code: `import { ref } from 'vue'

// v-bind 在 CSS 中使用 JS 变量
const themeColor = ref('#42b883')
const fontSize = ref(16)

// 模板中:
// <p class="title">动态样式</p>
//
// <style scoped>
// .title {
//   color: v-bind(themeColor);
//   font-size: v-bind(fontSize + 'px');
// }
// </style>

console.log('主题色:', themeColor.value)
console.log('字号:', fontSize.value + 'px')

// scoped 原理示意
// .title[data-v-f3f8c3b2] { color: #42b883; }

// 深度选择器
// :deep(.child-class) { color: red; }
console.log('scoped: 样式隔离')
console.log(':deep(): 穿透子组件')`,
    practice: {
      title: '练习：动态样式',
      description: '创建 <code>bgColor</code>（<code>"#f0f0f0"</code>）和 <code>textColor</code>（<code>"#333"</code>）。输出一行 "背景色: #f0f0f0, 文字色: #333"。',
      hint: '用 ref 声明颜色值，用字符串拼接输出',
      solution: `import { ref } from 'vue'

const bgColor = ref('#f0f0f0')
const textColor = ref('#333')

console.log('背景色: ' + bgColor.value + ', 文字色: ' + textColor.value)`
    }
  },

  'dom-loop': {
    title: 'DOM循环',
    api: 'v-for',
    difficulty: 'easy',
    description: `<code>v-for</code> 指令基于数组渲染列表。语法：<code>v-for="item in items"</code>。<br><br><strong>最佳实践：</strong><br>• 始终绑定 <code>:key</code>（唯一标识，避免用 index）<br>• 支持对象遍历：<code>v-for="(value, key) in object"</code><br>• 支持范围：<code>v-for="n in 10"</code><br>• 配合 <code>&lt;template&gt;</code> 渲染多个元素`,
    code: `import { ref, reactive } from 'vue'

// 数组循环
const fruits = ref(['苹果', '香蕉', '橙子', '葡萄'])
// v-for="fruit in fruits" :key="fruit"
// {{ fruit }}
fruits.value.forEach((fruit, index) => {
  console.log(index + ': ' + fruit)
})

// 对象循环
const user = reactive({ name: 'Vue', age: 5, type: 'Framework' })
// v-for="(value, key) in user"
for (const key in user) {
  console.log(key + ': ' + user[key])
}

// 带索引的循环
const tasks = ref([
  { id: 1, text: '学习 ref', done: true },
  { id: 2, text: '学习 computed', done: false },
  { id: 3, text: '学习组件', done: false }
])
// v-for="task in tasks" :key="task.id"
tasks.value.forEach(task => {
  const mark = task.done ? '✓' : '○'
  console.log(mark + ' ' + task.text)
})`,
    practice: {
      title: '练习：渲染成绩列表',
      description: '创建一个 <code>scores</code> 数组 <code>[85, 92, 78, 96, 88]</code>。遍历输出 "第N名: XX分"，同时输出最高分和平均分。',
      hint: '使用 Math.max(...scores) 和 reduce 求平均',
      solution: `import { ref, computed } from 'vue'

const scores = ref([85, 92, 78, 96, 88])

scores.value.forEach((s, i) => {
  console.log('第' + (i + 1) + '名: ' + s + '分')
})

const max = Math.max(...scores.value)
const avg = scores.value.reduce((a, b) => a + b, 0) / scores.value.length
console.log('最高分:', max)
console.log('平均分:', avg.toFixed(1))`
    }
  },

  'click-event': {
    title: '点击事件',
    api: '@click / v-on',
    difficulty: 'easy',
    description: `使用 <code>@click</code> 或 <code>v-on:click</code> 绑定事件处理函数。<br><br><strong>语法：</strong><br>• <code>@click="handler"</code> — 调用方法<br>• <code>@click="handler(arg)"</code> — 传参<br>• <code>@click.prevent</code> — 阻止默认行为<br>• <code>@click.stop</code> — 阻止冒泡<br>• <code>$event</code> — 访问原生事件对象`,
    code: `import { ref } from 'vue'

const count = ref(0)

// 基本点击处理
function increment() {
  count.value++
}
increment()
increment()
console.log('点击两次后:', count.value)

// 带参数的事件处理
function add(amount) {
  count.value += amount
}
add(10)
console.log('加 10 后:', count.value)

// 事件修饰符概念
console.log('@click.prevent  → 阻止默认')
console.log('@click.stop     → 阻止冒泡')
console.log('@click.once     → 只触发一次')
console.log('@click.self     → 仅自身触发')

// 实际场景：切换开关
const isOn = ref(false)
function toggle() {
  isOn.value = !isOn.value
}
toggle()
console.log('切换后:', isOn.value ? '开' : '关')`,
    practice: {
      title: '练习：计数器按钮',
      description: '创建 <code>num</code> 初始为 <code>0</code>。模拟三个操作：加 1（5次）、减 1（2次）、重置。每次操作后输出当前值。',
      hint: '封装 add、subtract、reset 函数',
      solution: `import { ref } from 'vue'

const num = ref(0)
function add() { num.value++ }
function subtract() { num.value-- }
function reset() { num.value = 0 }

add(); add(); add(); add(); add()
console.log('加5次:', num.value)  // 5
subtract(); subtract()
console.log('减2次:', num.value)  // 3
reset()
console.log('重置:', num.value)   // 0`
    }
  },

  'dom-ref': {
    title: 'DOM引用',
    api: 'ref 模板引用',
    difficulty: 'medium',
    description: `使用 <code>ref</code> 获取 DOM 元素或子组件的引用。<br><br><strong>用法：</strong><br>1. 声明同名 ref：<code>const inputRef = ref(null)</code><br>2. 模板中绑定：<code>&lt;input ref="inputRef" /&gt;</br><br>3. 在 <code>onMounted</code> 后访问<br><br><strong>场景：</strong>聚焦输入框、测量元素尺寸、集成第三方库`,
    code: `import { ref, onMounted } from 'vue'

// 声明 ref（名称与模板中 ref="xxx" 一致）
const boxRef = ref(null)

// 模拟 DOM 元素
const mockElement = {
  tagName: 'DIV',
  clientWidth: 200,
  clientHeight: 100,
  focus() { console.log('元素获得焦点') },
  scrollIntoView() { console.log('滚动到可见区域') }
}
boxRef.value = mockElement

onMounted(() => {
  // 在组件挂载后可以安全访问 DOM
  console.log('元素:', boxRef.value.tagName)
  console.log('宽度:', boxRef.value.clientWidth + 'px')
  console.log('高度:', boxRef.value.clientHeight + 'px')

  // 常见操作
  boxRef.value.focus()
  boxRef.value.scrollIntoView()
})

// ref 也可以用于子组件，调用子组件暴露的方法
// <ChildComponent ref="childRef" />
// childRef.value.someMethod()`,
    practice: {
      title: '练习：DOM 操作',
      description: '创建一个 mock 的 <code>inputRef</code>，模拟一个输入框元素（有 <code>value</code> 属性和 <code>focus</code> 方法）。设置值为 <code>"Hello"</code>，然后调用 <code>focus</code>。',
      hint: 'inputRef.value = { value: "", focus() { ... } }',
      solution: `import { ref } from 'vue'

const inputRef = ref(null)

// 模拟输入框 DOM
inputRef.value = {
  value: '',
  focus() { console.log('聚焦到输入框') }
}

inputRef.value.value = 'Hello'
console.log('输入值:', inputRef.value.value)
inputRef.value.focus()`
    }
  },

  'conditional-render': {
    title: '条件渲染',
    api: 'v-if / v-show',
    difficulty: 'easy',
    description: `<code>v-if</code> 和 <code>v-show</code> 用于条件性渲染元素。<br><br><strong>区别：</strong><br>• <code>v-if</code>：真正的销毁/重建，惰性渲染<br>• <code>v-show</code>：始终渲染，CSS 切换 display<br>• 频繁切换用 <code>v-show</code>，条件很少变用 <code>v-if</code><br><br><strong>v-else-if / v-else：</strong>必须紧跟在 v-if 或 v-else-if 后面`,
    code: `import { ref } from 'vue'

const score = ref(85)

// v-if / v-else-if / v-else
let grade
if (score.value >= 90) {
  grade = 'A'
} else if (score.value >= 80) {
  grade = 'B'
} else if (score.value >= 60) {
  grade = 'C'
} else {
  grade = 'D'
}
console.log('分数:', score.value, '→ 等级:', grade)

// v-show vs v-if
const isVisible = ref(true)
// v-show: <div v-show="isVisible">始终在 DOM 中</div>
// v-if:   <div v-if="isVisible">条件为 false 时从 DOM 移除</div>

console.log('v-show: 始终在 DOM，CSS 控制显示')
console.log('v-if: 条件为假时从 DOM 移除')

// 切换场景
const isLoggedIn = ref(false)
console.log(isLoggedIn.value ? '显示用户信息' : '显示登录按钮')
isLoggedIn.value = true
console.log(isLoggedIn.value ? '显示用户信息' : '显示登录按钮')`,
    practice: {
      title: '练习：成绩判断',
      description: '创建 <code>age</code> 变量，分别测试 <code>12</code>、<code>18</code>、<code>25</code>、<code>65</code>。根据年龄输出对应阶段：儿童（&lt;14）、青少年（14-17）、成人（18-64）、老年（≥65）。',
      hint: '用 if/else if/else 链实现条件分支',
      solution: `import { ref } from 'vue'

function getStage(age) {
  if (age < 14) return '儿童'
  else if (age < 18) return '青少年'
  else if (age < 65) return '成人'
  else return '老年'
}

;[12, 18, 25, 65].forEach(age => {
  console.log(age + '岁 → ' + getStage(age))
})`
    }
  },

  // ==================== 生命周期 ====================
  'component-lifecycle': {
    title: '组件生命周期',
    api: '生命周期概览',
    difficulty: 'easy',
    description: `Vue 组件从创建到销毁经历一系列生命周期阶段。<br><br><strong>完整周期：</strong><br>1. <code>onBeforeMount</code> — 挂载前<br>2. <code>onMounted</code> — 挂载后（可访问 DOM）<br>3. <code>onBeforeUpdate</code> — 更新前<br>4. <code>onUpdated</code> — 更新后<br>5. <code>onBeforeUnmount</code> — 卸载前<br>6. <code>onUnmounted</code> — 卸载后（清理定时器等）`,
    code: `import { ref, onMounted, onUpdated, onUnmounted,
  onBeforeMount, onBeforeUpdate, onBeforeUnmount } from 'vue'

// 生命周期按顺序执行
console.log('=== 组件生命周期 ===')

onBeforeMount(() => {
  console.log('1. onBeforeMount - DOM 还未挂载')
})

onMounted(() => {
  console.log('2. onMounted - DOM 已挂载，可操作 DOM')
})

onBeforeUpdate(() => {
  console.log('3. onBeforeUpdate - 数据已变，DOM 未更新')
})

onUpdated(() => {
  console.log('4. onUpdated - DOM 已更新')
})

onBeforeUnmount(() => {
  console.log('5. onBeforeUnmount - 即将销毁')
})

onUnmounted(() => {
  console.log('6. onUnmounted - 已销毁，清理资源')
})

const count = ref(0)
count.value = 1 // 触发更新`,
    practice: {
      title: '练习：生命周期追踪',
      description: '在 <code>onMounted</code> 中设置一个 <code>timer</code> 变量为 "已启动"，在 <code>onUnmounted</code> 中将其设为 "已清理"。模拟定时器的创建和清理过程。',
      hint: 'onMounted 设置状态，onUnmounted 清理状态',
      solution: `import { ref, onMounted, onUnmounted } from 'vue'

const timer = ref('未启动')

onMounted(() => {
  timer.value = '已启动'
  console.log('定时器:', timer.value)
})

onUnmounted(() => {
  timer.value = '已清理'
  console.log('定时器:', timer.value)
})

console.log('当前状态:', timer.value)`
    }
  },

  'on-mount': {
    title: '组件加载时',
    api: 'onMounted()',
    difficulty: 'easy',
    description: `<code>onMounted()</code> 在组件挂载完成后调用。此时 DOM 已经渲染完成，可以安全地访问和操作 DOM 元素。<br><br><strong>典型用途：</strong><br>• 获取 DOM 元素尺寸/位置<br>• 初始化第三方库（如图表、编辑器）<br>• 发起网络请求获取初始数据<br>• 添加事件监听器`,
    code: `import { ref, onMounted } from 'vue'

const data = ref(null)
const isLoading = ref(true)

onMounted(() => {
  console.log('组件已挂载，DOM 就绪')

  // 模拟异步数据加载
  setTimeout(() => {
    data.value = { users: ['Alice', 'Bob', 'Charlie'] }
    isLoading.value = false
    console.log('数据加载完成:', data.value)
  }, 100)

  // 典型用法：
  // 1. 获取 DOM
  // const el = document.querySelector('.container')
  // console.log('容器高度:', el.clientHeight)

  // 2. 初始化第三方库
  // const chart = new Chart(canvasRef.value, config)

  // 3. 添加事件监听
  // window.addEventListener('resize', handleResize)
})

console.log('加载中:', isLoading.value)`,
    practice: {
      title: '练习：模拟数据加载',
      description: '在 <code>onMounted</code> 中用 <code>setTimeout</code> 模拟 200ms 延迟后加载数据。将 <code>items</code> 从空数组更新为 <code>[Vue, React, Angular]</code>，输出加载状态。',
      hint: 'setTimeout 内更新 ref 的值',
      solution: `import { ref, onMounted } from 'vue'

const items = ref([])
const loaded = ref(false)

onMounted(() => {
  setTimeout(() => {
    items.value = ['Vue', 'React', 'Angular']
    loaded.value = true
    console.log('已加载:', items.value)
    console.log('数量:', items.value.length)
  }, 200)
})

console.log('初始状态:', loaded.value ? '已加载' : '加载中')`
    }
  },

  'on-unmount': {
    title: '组件卸载时',
    api: 'onUnmounted()',
    difficulty: 'easy',
    description: `<code>onUnmounted()</code> 在组件实例卸载后调用。用于清理副作用，防止内存泄漏。<br><br><strong>需要清理的资源：</strong><br>• <code>setInterval</code> / <code>setTimeout</code><br>• 事件监听器 <code>addEventListener</code><br>• WebSocket 连接<br>• 第三方库实例的销毁`,
    code: `import { ref, onMounted, onUnmounted } from 'vue'

const seconds = ref(0)
let timerId = null

onMounted(() => {
  // 启动定时器
  timerId = setInterval(() => {
    seconds.value++
    console.log('计时:', seconds.value + '秒')
  }, 1000)

  console.log('定时器已启动, ID:', timerId)
})

onUnmounted(() => {
  // 清理定时器，防止内存泄漏
  if (timerId) {
    clearInterval(timerId)
    timerId = null
    console.log('定时器已清理')
  }

  // 其他清理工作
  // window.removeEventListener('resize', onResize)
  // websocket.close()
})

// 模拟组件生命周期
console.log('组件创建')
// ... 组件运行 ...
console.log('组件销毁 → onUnmounted 执行')`,
    practice: {
      title: '练习：资源清理',
      description: '模拟一个需要清理的 WebSocket 连接。创建 <code>wsStatus</code> 为 <code>"未连接"</code>，在 <code>onMounted</code> 中设为 <code>"已连接"</code>，在 <code>onUnmounted</code> 中设为 <code>"已断开"</code>。',
      hint: '模拟 onMounted 和 onUnmounted 的执行',
      solution: `import { onMounted, onUnmounted } from 'vue'

const wsStatus = { value: '未连接' }

onMounted(() => {
  wsStatus.value = '已连接'
  console.log('WebSocket:', wsStatus.value)
})

onUnmounted(() => {
  wsStatus.value = '已断开'
  console.log('WebSocket:', wsStatus.value)
})

console.log('初始状态:', wsStatus.value)`
    }
  },

  // ==================== 组件通信 ====================
  'component-compose': {
    title: '组件组合',
    api: '组合式 API',
    difficulty: 'medium',
    description: `组件组合是 Vue 的核心思想之一：将 UI 拆分为独立、可复用的组件树。<br><br><strong>组合方式：</strong><br>• 父组件导入子组件<br>• Props 向下传递数据<br>• Events 向上通信<br>• Slots 分发内容<br>• Provide/Inject 跨层级传递<br><br><strong>原则：</strong>单一职责、低耦合、高内聚`,
    code: `import { ref, computed } from 'vue'

// 模拟组件组合的逻辑层面

// 子组件：计数器按钮
// <CounterButton label="+" @click="increment" />
function createCounterButton(label) {
  return {
    label,
    render() { return '<button>' + label + '</button>' }
  }
}

// 父组件：组合使用
const count = ref(0)
const increment = () => count.value++
const decrement = () => count.value--

const plusBtn = createCounterButton('+')
const minusBtn = createCounterButton('-')

console.log('子组件:', plusBtn.label, minusBtn.label)
increment(); increment(); increment()
decrement()
console.log('组合后 count:', count.value)

// Composables — 逻辑复用
function useCounter(initial = 0) {
  const count = ref(initial)
  const doubled = computed(() => count.value * 2)
  const increment = () => count.value++
  const reset = () => { count.value = initial }
  return { count, doubled, increment, reset }
}

const { count: c, doubled, increment: inc } = useCounter(5)
inc(); inc()
console.log('composable count:', c.value, 'doubled:', doubled.value)`,
    practice: {
      title: '练习：提取 Composable',
      description: '创建一个 <code>useToggle</code> 函数，返回 <code>value</code>（ref）、<code>toggle</code>、<code>setTrue</code>、<code>setFalse</code> 方法。测试 toggle 两次的最终值。',
      hint: 'function useToggle(initial = false) { ... return { value, toggle, setTrue, setFalse } }',
      solution: `import { ref } from 'vue'

function useToggle(initial = false) {
  const value = ref(initial)
  const toggle = () => { value.value = !value.value }
  const setTrue = () => { value.value = true }
  const setFalse = () => { value.value = false }
  return { value, toggle, setTrue, setFalse }
}

const { value, toggle } = useToggle(false)
console.log('初始:', value.value)
toggle()
toggle()
console.log('toggle 两次:', value.value)`
    }
  },

  'props': {
    title: '组件Props传参',
    api: 'defineProps',
    difficulty: 'easy',
    description: `<code>defineProps</code> 在 <code>&lt;script setup&gt;</code> 中声明组件接收的 props。<br><br><strong>用法：</strong><br>• 数组形式：<code>defineProps(['title', 'count'])</code><br>• 对象形式（带类型）：<code>defineProps({ title: String, count: { type: Number, default: 0 } })</code><br><br><strong>注意：</strong>Props 是只读的，不要直接修改！子组件应通过 emit 通知父组件修改。`,
    code: `import { ref } from 'vue'

// defineProps 仅在 <script setup> 中使用，无需导入
// 编译器宏，不需要 import

// 数组形式
// const props = defineProps(['title', 'count'])

// 对象形式（推荐）
// const props = defineProps({
//   title: { type: String, required: true },
//   count: { type: Number, default: 0 },
//   items: { type: Array, default: () => [] },
//   status: {
//     type: String,
//     validator: (v) => ['active', 'inactive'].includes(v)
//   }
// })

// 模拟 props 的使用
const props = {
  title: '我的标题',
  count: 42,
  items: ['a', 'b', 'c']
}

console.log('title:', props.title)
console.log('count:', props.count)
console.log('items:', props.items)

// 模板中使用:
// <ChildComponent title="标题" :count="42" :items="list" />

// 只读！不能修改 props
// props.title = '新标题' // 会报警告`,
    practice: {
      title: '练习：定义 Props',
      description: '模拟定义一个 "UserCard" 组件的 props：<code>name</code>（字符串，必填）、<code>age</code>（数字，默认 <code>0</code>）、<code>avatar</code>（字符串，默认 <code>"default.png"</code>）。创建一个实例并输出所有 prop 值。',
      hint: '用对象描述 defineProps 的参数',
      solution: `const UserCardProps = {
  name: { type: String, required: true },
  age: { type: Number, default: 0 },
  avatar: { type: String, default: 'default.png' }
}

// 模拟传入的 props
const instance = {
  name: '张三',
  age: 28,
  avatar: 'default.png'
}

console.log('姓名:', instance.name)
console.log('年龄:', instance.age)
console.log('头像:', instance.avatar)`
    }
  },

  'emit-event': {
    title: '向父组件emit事件',
    api: 'defineEmits',
    difficulty: 'easy',
    description: `<code>defineEmits</code> 声明组件可以触发的事件，父组件通过 <code>@event-name</code> 监听。<br><br><strong>用法：</strong><br>• 声明：<code>const emit = defineEmits(['update', 'submit'])</code><br>• 触发：<code>emit('update', newValue)</code><br>• 验证：<code>defineEmits({ update: (val) => val > 0 })</code><br><br><strong>模式：</strong>配合 <code>v-model</code> 实现双向绑定`,
    code: `import { ref } from 'vue'

// defineEmits 也是编译器宏
// const emit = defineEmits(['change', 'submit', 'update:modelValue'])

// 模拟 emit 函数
function createEmit() {
  const listeners = {}
  const emit = (event, ...args) => {
    console.log('触发事件:', event, '参数:', args)
    if (listeners[event]) listeners[event](...args)
  }
  emit.on = (event, fn) => { listeners[event] = fn }
  return emit
}

const emit = createEmit()

// 父组件监听
emit.on('change', (val) => {
  console.log('父组件收到 change:', val)
})
emit.on('submit', (data) => {
  console.log('父组件收到 submit:', data)
})

// 子组件触发
emit('change', 'new value')
emit('submit', { name: 'Vue', version: 3 })

// v-model 模式
// 子组件: emit('update:modelValue', newVal)
// 父组件: <Child v-model="someRef" />
// 等价:  <Child :modelValue="someRef" @update:modelValue="someRef = $event" />`,
    practice: {
      title: '练习：自定义事件',
      description: `模拟一个 "计数器子组件"，内部维护 <code>count</code>，每次变化通过 <code>emit('change', count)</code> 通知父组件。模拟点击 3 次，输出父组件收到的每次变化。`,
      hint: '子组件内部 count++ 后调用 emit 通知',
      solution: `import { ref } from 'vue'

const count = ref(0)

function childClick() {
  count.value++
  console.log('子组件 emit change:', count.value)
  parentOnChange(count.value)
}

function parentOnChange(val) {
  console.log('父组件收到: count =', val)
}

// 模拟点击 3 次
childClick()
childClick()
childClick()
console.log('最终值:', count.value)`
    }
  },

  'slot': {
    title: 'slot插槽',
    api: '<slot>',
    difficulty: 'medium',
    description: `<code>&lt;slot&gt;</code> 允许父组件向子组件传递模板内容。<br><br><strong>类型：</strong><br>• 默认插槽：<code>&lt;slot /&gt;</code> — 子组件中的占位符<br>• 具名插槽：<code>&lt;slot name="header" /&gt;</code><br>• 作用域插槽：<code>&lt;slot :data="item" /&gt;</code><br><br><strong>使用场景：</strong>弹窗内容、列表项模板、布局组件`,
    code: `import { ref } from 'vue'

// 插槽概念演示

// 子组件模板:
// <div class="card">
//   <div class="card-header">
//     <slot name="header">默认标题</slot>
//   </div>
//   <div class="card-body">
//     <slot>默认内容</slot>    ← 默认插槽
//   </div>
// </div>

// 父组件使用:
// <Card>
//   <template #header>自定义标题</template>
//   <p>这是卡片内容</p>
// </Card>

// 模拟插槽机制
function renderComponent(slots) {
  let output = '<div class="card">\\n'
  output += '  <div class="header">'
  output += slots.header ? slots.header() : '默认标题'
  output += '</div>\\n'
  output += '  <div class="body">'
  output += slots.default ? slots.default() : '默认内容'
  output += '</div>\\n'
  output += '</div>'
  return output
}

const result = renderComponent({
  header: () => '用户信息',
  default: () => '<p>姓名: 张三</p>'
})
console.log(result)`,
    practice: {
      title: '练习：模拟插槽',
      description: '创建一个 <code>renderBox</code> 函数，接受 <code>title</code> 和 <code>content</code> 两个插槽函数。输出带标题和内容的 "盒子"。如果没传插槽则显示默认值。',
      hint: 'function renderBox(slots) { return slots.title?.() || "默认标题" }',
      solution: `function renderBox(slots = {}) {
  const title = slots.title ? slots.title() : '默认标题'
  const content = slots.content ? slots.content() : '默认内容'
  return '[ ' + title + ' ]\\n' + content
}

console.log(renderBox())
console.log('---')
console.log(renderBox({
  title: () => '通知',
  content: () => '您有3条新消息'
}))`
    }
  },

  'slot-content': {
    title: 'slot插槽内容',
    api: '具名插槽 & 作用域插槽',
    difficulty: 'medium',
    description: `<strong>具名插槽：</strong>通过 <code>name</code> 属性区分多个插槽位置。父组件用 <code>v-slot:name</code> 或 <code>#name</code> 指定。<br><br><strong>作用域插槽：</strong>子组件向插槽传递数据，父组件通过 <code>v-slot="slotProps"</code> 接收。<br><br><strong>场景：</strong>列表组件让父组件自定义每一项的渲染方式`,
    code: `import { ref } from 'vue'

// 具名插槽
// 子组件:
// <header><slot name="header" /></header>
// <main><slot /></main>
// <footer><slot name="footer" /></footer>

// 父组件:
// <Layout>
//   <template #header>头部</template>
//   <template #default>主体</template>
//   <template #footer>底部</template>
// </Layout>

// 作用域插槽 — 子组件传递数据给插槽
// 子组件 List:
// <ul>
//   <li v-for="item in items">
//     <slot :item="item" :index="index">
//       {{ item.name }}  ← 默认渲染
//     </slot>
//   </li>
// </ul>

// 父组件自定义渲染:
// <List :items="users">
//   <template #default="{ item, index }">
//     <span>#{{ index + 1 }}</span>
//     <strong>{{ item.name }}</strong>
//   </template>
// </List>

// 模拟作用域插槽
function renderList(items, slotFn) {
  return items.map((item, index) => {
    return slotFn ? slotFn({ item, index }) : item.name
  }).join('\\n')
}

const users = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 }
]

console.log('默认渲染:')
console.log(renderList(users))
console.log('\\n自定义渲染:')
console.log(renderList(users, ({ item, index }) =>
  '#' + (index + 1) + ' ' + item.name + ' (' + item.age + '岁)'
))`,
    practice: {
      title: '练习：作用域插槽',
      description: '创建一个 <code>renderTable</code> 函数，接受数据数组和一个 <code>renderCell</code> 插槽函数。数据为 <code>[{name: "价格", value: 99}]</code>，用自定义插槽渲染为 "价格: ¥99"。',
      hint: 'renderTable(data, renderCell) 遍历 data 并调用 renderCell({ row, index })',
      solution: `function renderTable(data, renderCell) {
  return data.map((row, i) =>
    renderCell ? renderCell({ row, index: i }) : row.name + ': ' + row.value
  ).join('\\n')
}

const data = [
  { name: '价格', value: 99 },
  { name: '库存', value: 200 }
]

console.log(renderTable(data, ({ row }) =>
  row.name + ': ¥' + row.value
))`
    }
  },

  'context': {
    title: '上下文',
    api: 'provide / inject',
    difficulty: 'medium',
    description: `<code>provide</code> 和 <code>inject</code> 实现跨层级组件数据传递，无需逐层传递 props。<br><br><strong>用法：</strong><br>• 祖先组件：<code>provide('key', value)</code><br>• 任意后代：<code>const val = inject('key', defaultValue)</code><br><br><strong>场景：</strong>主题配置、用户信息、全局状态<br><br><strong>注意：</strong>provide 的值默认不是响应式的，需要传入 ref/reactive`,
    code: `import { ref, provide, inject, readonly } from 'vue'

// provide 和 inject 模拟

// 祖先组件
const theme = ref('dark')
const user = { name: 'Admin', role: 'admin' }

// provide('theme', theme)           // 响应式
// provide('user', readonly(user))   // 只读防修改

// 孙子组件（任意深层）
// const theme = inject('theme', ref('light'))  // 默认值 'light'

// 模拟 inject
function mockInject(key, defaultVal) {
  const store = {
    theme: theme,
    user: user,
    locale: 'zh-CN'
  }
  return store[key] ?? defaultVal
}

const injectedTheme = mockInject('theme', ref('light'))
const injectedUser = mockInject('user', {})
const injectedLang = mockInject('locale', 'en')

console.log('主题:', injectedTheme.value)
console.log('用户:', injectedUser.name)
console.log('语言:', injectedLang)

// 模式对比
console.log('\\nProps 逐层传递 vs provide/inject 跨层传递')`,
    practice: {
      title: '练习：全局配置',
      description: '模拟 provide/inject 实现全局配置。<code>provide</code> 一个 <code>config</code> 对象 <code>{ apiBase: "https://api.example.com", timeout: 5000 }</code>。在深层组件中 <code>inject</code> 获取并输出。',
      hint: '用普通对象模拟 provide/inject 的读取过程',
      solution: `import { ref } from 'vue'

// 模拟 provide
const globalConfig = {
  apiBase: 'https://api.example.com',
  timeout: 5000
}

// 模拟 inject（深层组件获取）
const config = globalConfig

console.log('API 地址:', config.apiBase)
console.log('超时时间:', config.timeout + 'ms')

// 构造请求 URL
const url = config.apiBase + '/users'
console.log('请求地址:', url)`
    }
  },

  // ==================== 表单与Web ====================
  'form-input': {
    title: '表单输入',
    api: 'v-model 概览',
    difficulty: 'easy',
    description: `<code>v-model</code> 在表单元素上创建双向数据绑定。<br><br><strong>各元素的默认绑定属性和事件：</strong><br>• 文本框：<code>:value</code> + <code>@input</code><br>• 复选框：<code>:checked</code> + <code>@change</code><br>• 单选框：<code>:checked</code> + <code>@change</code><br>• 下拉框：<code>:value</code> + <code>@change</code><br><br><strong>修饰符：</strong><code>.lazy</code>（change 时更新）、<code>.number</code>、<code>.trim</code>`,
    code: `import { ref } from 'vue'

// v-model 的本质是语法糖
// <input v-model="text" />
// 等价于:
// <input :value="text" @input="text = $event.target.value" />

const text = ref('')

// 模拟用户输入
function simulateInput(val) {
  text.value = val
  console.log('输入:', text.value)
}

simulateInput('Hello')
simulateInput('Hello Vue')

// .lazy 修饰符 — 在 change 事件时更新（失焦/回车）
// <input v-model.lazy="text" />
// 等价: @change 而不是 @input

// .number — 自动转为数字
const age = ref(0)
age.value = Number('25')
console.log('age:', age.value, typeof age.value)

// .trim — 自动去除首尾空格
const name = ref('')
name.value = '  Vue 3  '.trim()
console.log('trim 后:', '"' + name.value + '"')`,
    practice: {
      title: '练习：表单数据收集',
      description: '模拟一个表单，包含 <code>username</code>、<code>email</code>、<code>age</code> 三个字段。模拟填写后输出 JSON 格式的表单数据。',
      hint: '用 ref 声明各字段，赋值模拟输入',
      solution: `import { ref } from 'vue'

const username = ref('')
const email = ref('')
const age = ref(0)

// 模拟表单输入
username.value = 'zhangsan'
email.value = 'zhangsan@example.com'
age.value = 28

const formData = {
  username: username.value,
  email: email.value,
  age: age.value
}
console.log(JSON.stringify(formData, null, 2))`
    }
  },

  'input-text': {
    title: '输入框',
    api: 'v-model + input',
    difficulty: 'easy',
    description: `<code>&lt;input&gt;</code> 和 <code>&lt;textarea&gt;</code> 使用 <code>v-model</code> 绑定文本值。<br><br><strong>特性：</strong><br>• 实时同步：每次按键更新<br>• <code>.lazy</code>：失焦或回车时更新<br>• <code>.trim</code>：自动去除空格<br>• <code>.number</code>：自动转数字<br><br><strong>场景：</strong>搜索框、表单输入、实时预览`,
    code: `import { ref, computed } from 'vue'

const search = ref('')

// 模拟搜索输入
function typeSearch(text) {
  search.value = text
  console.log('搜索:', search.value)
}

typeSearch('v')
typeSearch('vu')
typeSearch('vue')
typeSearch('vue 3')

// 实时字符统计
const message = ref('')
function typeMessage(text) {
  message.value = text
}
typeMessage('Hello Vue 3!')
const charCount = message.value.length
console.log('字符数:', charCount)

// 实时搜索过滤
const allItems = ref(['Vue', 'React', 'Angular', 'Svelte', 'Vite'])
function searchFilter(keyword) {
  const result = allItems.value.filter(item =>
    item.toLowerCase().includes(keyword.toLowerCase())
  )
  console.log('搜索 "' + keyword + '":', result)
}

searchFilter('v')
searchFilter('re')`,
    practice: {
      title: '练习：实时搜索',
      description: '创建城市列表 <code>["北京", "上海", "广州", "深圳", "杭州"]</code>，模拟输入搜索关键字 <code>"上"</code> 和 <code>"州"</code>，输出匹配结果。',
      hint: 'filter 城市名包含关键字',
      solution: `import { ref } from 'vue'

const cities = ref(['北京', '上海', '广州', '深圳', '杭州'])

function search(keyword) {
  return cities.value.filter(c => c.includes(keyword))
}

console.log('搜索 "上":', search('上'))
console.log('搜索 "州":', search('州'))`
    }
  },

  'checkbox': {
    title: '复选框',
    api: 'v-model + checkbox',
    difficulty: 'easy',
    description: `复选框的 <code>v-model</code> 绑定方式取决于单个还是多个。<br><br><strong>单个复选框：</strong>绑定到 boolean<br><code>&lt;input type="checkbox" v-model="agreed" /&gt;</code><br><br><strong>多个复选框：</strong>绑定到数组<br><code>&lt;input type="checkbox" value="Vue" v-model="frameworks" /&gt;</code><br><code>&lt;input type="checkbox" value="React" v-model="frameworks" /&gt;</code>`,
    code: `import { ref } from 'vue'

// 单个复选框 — 绑定 boolean
const agreed = ref(false)
console.log('初始:', agreed.value)
agreed.value = true
console.log('勾选后:', agreed.value)

// 多个复选框 — 绑定数组
const frameworks = ref([])

function toggleFramework(name) {
  const idx = frameworks.value.indexOf(name)
  if (idx === -1) {
    frameworks.value.push(name)
  } else {
    frameworks.value.splice(idx, 1)
  }
}

toggleFramework('Vue')
console.log('选了 Vue:', frameworks.value)

toggleFramework('React')
console.log('选了 React:', frameworks.value)

toggleFramework('Vue')
console.log('取消 Vue:', frameworks.value)

// 全选/取消全选
const allOptions = ['Vue', 'React', 'Angular', 'Svelte']
const selected = ref([])

function selectAll() { selected.value = [...allOptions] }
function clearAll() { selected.value = [] }

selectAll()
console.log('全选:', selected.value)
clearAll()
console.log('清空:', selected.value)`,
    practice: {
      title: '练习：爱好选择',
      description: '创建 <code>hobbies</code> 数组。依次选择 "阅读"、"编程"、"音乐"，然后取消 "音乐"，添加 "运动"。输出最终爱好列表。',
      hint: '用 push 添加，splice 删除',
      solution: `import { ref } from 'vue'

const hobbies = ref([])

hobbies.value.push('阅读')
hobbies.value.push('编程')
hobbies.value.push('音乐')
console.log('添加后:', hobbies.value)

const idx = hobbies.value.indexOf('音乐')
hobbies.value.splice(idx, 1)
hobbies.value.push('运动')
console.log('调整后:', hobbies.value)`
    }
  },

  'radio': {
    title: '单选框',
    api: 'v-model + radio',
    difficulty: 'easy',
    description: `单选框使用 <code>v-model</code> 绑定到同一变量，值为选中项的 <code>value</code>。<br><br><strong>用法：</strong><br><code>&lt;input type="radio" value="A" v-model="picked" /&gt;</code><br><code>&lt;input type="radio" value="B" v-model="picked" /&gt;</code><br><br><strong>场景：</strong>性别选择、支付方式、难度选择等互斥选项`,
    code: `import { ref } from 'vue'

// 单选框 — 同一 v-model，不同 value
const gender = ref('')
console.log('初始:', gender.value || '(未选)')

gender.value = 'male'
console.log('选择后:', gender.value)

gender.value = 'female'
console.log('更改后:', gender.value)

// 实际场景：难度选择
const difficulty = ref('easy')

function setDifficulty(level) {
  difficulty.value = level
}

setDifficulty('medium')
console.log('当前难度:', difficulty.value)

// 单选配合对象
const payment = ref('alipay')
const methods = [
  { value: 'alipay', label: '支付宝' },
  { value: 'wechat', label: '微信支付' },
  { value: 'card', label: '银行卡' }
]

function selectPayment(val) {
  payment.value = val
  const method = methods.find(m => m.value === val)
  console.log('支付方式:', method.label)
}

selectPayment('wechat')`,
    practice: {
      title: '练习：问卷选择',
      description: '模拟一个问卷：<code>q1</code>（满意度 "very-satisfied"）、<code>q2</code>（推荐意愿 "yes"）。输出每题的选择结果。',
      hint: '用 ref 存储每道题的选择值',
      solution: `import { ref } from 'vue'

const q1 = ref('very-satisfied')
const q2 = ref('yes')

const labels = {
  'very-satisfied': '非常满意',
  'satisfied': '满意',
  'unsatisfied': '不满意',
  'yes': '愿意',
  'no': '不愿意'
}

console.log('Q1 满意度:', labels[q1.value])
console.log('Q2 推荐:', labels[q2.value])`
    }
  },

  'select': {
    title: '选择器',
    api: 'v-model + select',
    difficulty: 'easy',
    description: `<code>&lt;select&gt;</code> 使用 <code>v-model</code> 绑定选中值。<br><br><strong>单选：</strong>绑定字符串<br><code>&lt;select v-model="lang"&gt;&lt;option value="js"&gt;JavaScript&lt;/option&gt;...&lt;/select&gt;</code><br><br><strong>多选：</strong>绑定数组 + <code>multiple</code> 属性<br><code>&lt;select v-model="langs" multiple&gt;...&lt;/select&gt;</code><br><br><strong>动态选项：</strong>用 <code>v-for</code> 渲染 <code>&lt;option&gt;</code>`,
    code: `import { ref } from 'vue'

// 单选下拉框
const lang = ref('js')
console.log('选择的语言:', lang.value)

lang.value = 'ts'
console.log('切换后:', lang.value)

// 动态选项列表
const options = ref([
  { value: 'vue', label: 'Vue.js' },
  { value: 'react', label: 'React' },
  { value: 'angular', label: 'Angular' }
])

const framework = ref('vue')

function selectFramework(val) {
  framework.value = val
  const opt = options.value.find(o => o.value === val)
  console.log('选中:', opt.label)
}

selectFramework('react')

// 多选
const skills = ref(['js'])
function toggleSkill(skill) {
  const idx = skills.value.indexOf(skill)
  if (idx === -1) skills.value.push(skill)
  else skills.value.splice(idx, 1)
}

toggleSkill('vue')
toggleSkill('ts')
console.log('技能:', skills.value)

// 联动选择
const province = ref('guangdong')
const cityMap = {
  guangdong: ['广州', '深圳', '东莞'],
  zhejiang: ['杭州', '宁波', '温州']
}
const city = ref('')
function selectProvince(p) {
  province.value = p
  city.value = ''
  console.log('省:', p, '可选城市:', cityMap[p])
}
selectProvince('zhejiang')`,
    practice: {
      title: '练习：课程选择器',
      description: '有课程列表 <code>[{id: 1, name: "Vue 3 入门"}, {id: 2, name: "React 实战"}, {id: 3, name: "Node.js 后端"}]</code>。选择 id 为 <code>2</code> 的课程，输出 "已选择: React 实战"。',
      hint: 'find 课程后更新 ref',
      solution: `import { ref } from 'vue'

const courses = [
  { id: 1, name: 'Vue 3 入门' },
  { id: 2, name: 'React 实战' },
  { id: 3, name: 'Node.js 后端' }
]

const selectedId = ref(1)
selectedId.value = 2

const course = courses.find(c => c.id === selectedId.value)
console.log('已选择:', course.name)`
    }
  },

  'render-app': {
    title: '渲染应用',
    api: 'createApp()',
    difficulty: 'easy',
    description: `<code>createApp()</code> 创建 Vue 应用实例，是应用的入口。<br><br><strong>基本流程：</strong><br>1. <code>const app = createApp(App)</code><br>2. <code>app.use(router)</code> — 安装插件<br>3. <code>app.mount('#app')</code> — 挂载到 DOM<br><br><strong>全局配置：</strong><br>• <code>app.config.globalProperties</code><br>• <code>app.component()</code> — 全局组件<br>• <code>app.directive()</code> — 全局指令`,
    code: `import { ref, createApp } from 'vue'

// createApp 的使用流程
console.log('=== Vue 应用启动流程 ===')

// 1. 创建应用
// const app = createApp(App)

// 2. 安装插件
// app.use(router)
// app.use(pinia)
// app.use(ElementPlus)

// 3. 注册全局组件
// app.component('MyIcon', MyIcon)

// 4. 挂载
// app.mount('#app')

console.log('1. createApp(App)      → 创建实例')
console.log('2. app.use(plugin)      → 安装插件')
console.log('3. app.mount("#app")    → 挂载 DOM')

// main.js 完整示例
const mainJs = \`
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(router)
app.mount('#app')
\`
console.log('\\n标准 main.js:')
console.log(mainJs)

// 应用配置
// app.config.errorHandler = (err) => {
//   console.error('全局错误:', err)
// }
console.log('\\n全局错误处理: app.config.errorHandler')`,
    practice: {
      title: '练习：应用配置',
      description: '模拟创建一个 Vue 应用的配置对象，包含：<code>name</code>、<code>version</code>、<code>plugins</code>（数组）、<code>globalComponents</code>（数组）。添加 router 插件和一个 AppHeader 全局组件，输出配置摘要。',
      hint: '用对象模拟 app 的配置过程',
      solution: `const app = {
  name: 'MyApp',
  version: '1.0.0',
  plugins: [],
  globalComponents: {},
  use(plugin) { this.plugins.push(plugin) },
  component(name, comp) { this.globalComponents[name] = comp }
}

app.use('vue-router')
app.use('pinia')
app.component('AppHeader', { template: '<header />' })

console.log('应用:', app.name + ' v' + app.version)
console.log('插件:', app.plugins)
console.log('全局组件:', Object.keys(app.globalComponents))`
    }
  },

  'fetch-data': {
    title: 'fetch获取数据',
    api: 'fetch + ref',
    difficulty: 'medium',
    description: `在 <code>onMounted</code> 中使用 <code>fetch</code> 获取数据，配合 <code>ref</code> 管理加载状态。<br><br><strong>模式：</strong><br>• <code>isLoading</code> — 加载状态<br>• <code>data</code> — 响应数据<br>• <code>error</code> — 错误信息<br><br><strong>最佳实践：</strong><br>• 使用 <code>async/await</code><br>• 处理错误 <code>try/catch</code><br>• 组件卸载时取消请求（AbortController）`,
    code: `import { ref, onMounted } from 'vue'

const users = ref([])
const isLoading = ref(false)
const error = ref(null)

// 模拟 fetch 请求
async function fetchUsers() {
  isLoading.value = true
  error.value = null

  try {
    // 实际代码:
    // const res = await fetch('https://api.example.com/users')
    // users.value = await res.json()

    // 模拟异步请求
    await new Promise(resolve => setTimeout(resolve, 500))

    users.value = [
      { id: 1, name: 'Alice', email: 'alice@example.com' },
      { id: 2, name: 'Bob', email: 'bob@example.com' },
      { id: 3, name: 'Charlie', email: 'charlie@example.com' }
    ]
    console.log('获取成功:', users.value.length + ' 条数据')
  } catch (e) {
    error.value = e.message
    console.error('请求失败:', e.message)
  } finally {
    isLoading.value = false
  }
}

// 模拟 onMounted 中调用
fetchUsers()

// 完整的 composable 模式
function useFetch(url) {
  const data = ref(null)
  const loading = ref(true)
  const err = ref(null)

  async function fetchData() {
    loading.value = true
    try {
      // const res = await fetch(url)
      // data.value = await res.json()
      await new Promise(r => setTimeout(r, 300))
      data.value = { status: 'ok', url }
    } catch (e) {
      err.value = e.message
    } finally {
      loading.value = false
    }
  }

  return { data, loading, error: err, refetch: fetchData }
}

const { data, loading } = useFetch('/api/data')
console.log('composable loading:', loading.value)`,
    practice: {
      title: '练习：模拟 API 请求',
      description: '用 <code>ref</code> 管理 <code>products</code>、<code>loading</code>、<code>error</code>。模拟请求 300ms 后返回商品列表 <code>[{name: "手机", price: 4999}, {name: "电脑", price: 8999}]</code>，输出加载过程和结果。',
      hint: '用 setTimeout 模拟异步，先设 loading=true，返回后设 loading=false',
      solution: `import { ref } from 'vue'

const products = ref([])
const loading = ref(false)
const error = ref(null)

function fetchProducts() {
  loading.value = true
  console.log('加载中...')

  setTimeout(() => {
    products.value = [
      { name: '手机', price: 4999 },
      { name: '电脑', price: 8999 }
    ]
    loading.value = false
    console.log('加载完成!')
    products.value.forEach(p => {
      console.log(p.name + ': ¥' + p.price)
    })
  }, 300)
}

fetchProducts()`
    }
  }
}
