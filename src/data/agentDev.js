export const agentCategories = [
  { id: 'basics', name: 'Agent 基础', topics: ['agent-intro', 'agent-loop', 'prompt-engineering', 'agent-arch'] },
  { id: 'tool-use', name: '工具调用', topics: ['tool-intro', 'tool-call', 'tool-result', 'tool-advanced'] },
  { id: 'conversation', name: '多轮对话与记忆', topics: ['chat-history', 'context-window', 'memory', 'streaming'] },
  { id: 'rag', name: 'RAG 检索增强', topics: ['rag-intro', 'rag-embed', 'rag-retrieve', 'rag-practice'] },
  { id: 'framework', name: '框架实战', topics: ['langchain-intro', 'agent-structured', 'agent-error'] },
  { id: 'project', name: '综合项目', topics: ['agent-chatbot', 'agent-automation'] }
]

export const agentTopics = {
  'agent-intro': {
    title: '什么是 AI Agent',
    api: '概念介绍',
    difficulty: 'easy',
    description: `<p>AI Agent 是能够 <strong>自主感知环境、做出决策并执行动作</strong> 的智能系统。它与传统 ChatBot 的本质区别在于：</p>
<p><strong>ChatBot：</strong>用户提问 → LLM 回答（被动响应）<br/>
<strong>Agent：</strong>用户提问 → 理解意图 → 制定计划 → 调用工具 → 观察结果 → 反思调整 → 输出答案（主动执行）</p>
<p><strong>Agent 四大核心要素：</strong></p>
<p>• <strong>LLM（大语言模型）</strong>— 推理引擎，负责理解、规划、决策。常用：Claude、GPT-4、Gemini、DeepSeek<br/>
• <strong>Tools（工具）</strong>— 外部能力扩展，如搜索、计算、数据库查询、代码执行、API 调用<br/>
• <strong>Memory（记忆）</strong>— 短期记忆（对话上下文）+ 长期记忆（向量数据库持久化）<br/>
• <strong>Planning（规划）</strong>— 将复杂任务分解为子任务，逐步执行并整合结果</p>
<p><strong>典型 Agent 应用场景：</strong></p>
<p>• 代码助手：Cursor、Claude Code、GitHub Copilot<br/>
• 数据分析 Agent：自动查询数据库、生成图表和报告<br/>
• 客服 Agent：基于知识库回答用户问题，自动转人工<br/>
• 自动化工作流：自动处理邮件、整理文件、生成文档</p>`,
    code: `// Agent 架构全景\nconst agent = {\n  brain: 'Claude / GPT-4 / DeepSeek',  // 推理引擎\n  tools: ['搜索', '计算', '数据库', '代码执行'],\n  memory: {\n    shortTerm: '当前对话上下文',\n    longTerm: '向量数据库 (Pinecone / ChromaDB)'\n  },\n  planning: '任务分解 → 逐步执行 → 结果整合 → 反思调整'\n}\n\n// ChatBot vs Agent 对比\nconsole.log('=== ChatBot ===')\nconsole.log('用户: 北京明天天气怎么样?')\nconsole.log('Bot: 我无法获取实时天气信息')\n\nconsole.log('\\n=== Agent ===')\nconsole.log('用户: 北京明天天气怎么样?')\nconsole.log('Agent 思考: 需要查询实时天气')\nconsole.log('Agent 行动: 调用 get_weather("北京", "明天")')\nconsole.log('Agent 观察: { temp: "22°C", weather: "晴" }')\nconsole.log('Agent 回答: 北京明天晴，气温22°C，适合出行')`,
    practice: {
      title: '练习：Agent 四要素',
      description: '用一个对象描述一个"旅行规划 Agent"的四要素（LLM、工具、记忆、规划），每个要素给出具体实现方式。',
      hint: 'brain + tools 数组 + memory 对象 + planning 字符串',
      solution: `const travelAgent = {\n  brain: 'Claude 3.5 Sonnet',\n  tools: ['查航班', '查酒店', '查景点', '查天气', '生成行程单'],\n  memory: {\n    short: '用户偏好: 喜欢海边, 预算5000',\n    long: '上次去过三亚, 不喜欢登山'\n  },\n  planning: '确认目的地 → 查天气 → 查航班 → 查酒店 → 生成行程 → 用户确认'\n}\nObject.entries(travelAgent).forEach(([k, v]) => {\n  console.log(k + ':', typeof v === 'object' ? JSON.stringify(v) : v)\n})`
    }
  },

  'agent-loop': {
    title: 'Agent 循环（ReAct）',
    api: 'ReAct Loop',
    difficulty: 'medium',
    description: `<p>Agent 的核心运行机制是 <strong>ReAct（Reasoning + Acting）循环</strong>，即"思考-行动"循环。</p>
<p><strong>循环步骤：</strong></p>
<p>1. <strong>思考（Thought）</strong>— LLM 分析当前状态，决定下一步该做什么<br/>
2. <strong>行动（Action）</strong>— 调用工具或直接生成内容<br/>
3. <strong>观察（Observation）</strong>— 获取行动结果并反馈给 LLM<br/>
4. <strong>重复</strong> 直到任务完成或达到最大步数</p>
<p><strong>关键设计要点：</strong></p>
<p>• 设置 <strong>最大步数限制</strong>（防止无限循环），通常 5-10 步<br/>
• 每步都把工具结果追加到消息历史，LLM 基于完整上下文决策<br/>
• LLM 返回 <code>tool_calls</code> 表示需要调用工具，返回纯文本表示任务完成<br/>
• 需要处理工具调用失败的情况，让 LLM 能够调整策略</p>
<p><strong>与普通对话的区别：</strong>普通对话是一问一答，Agent 循环可以在一个用户请求内执行多次工具调用。</p>`,
    code: `// ReAct 循环完整实现\nasync function agentLoop(userQuery, tools, llm) {\n  const messages = [\n    { role: 'system', content: '你是一个助手，可以使用工具完成任务。' },\n    { role: 'user', content: userQuery }\n  ]\n  const maxSteps = 5\n\n  for (let step = 0; step < maxSteps; step++) {\n    console.log(\`--- 第 \${step + 1} 步 ---\`)\n\n    // 1. 调用 LLM\n    const response = await llm(messages)\n\n    // 2. 检查是否需要调用工具\n    if (response.tool_calls && response.tool_calls.length > 0) {\n      // 记录 LLM 的思考过程\n      messages.push({\n        role: 'assistant',\n        content: response.content,\n        tool_calls: response.tool_calls\n      })\n\n      // 3. 执行每个工具调用\n      for (const call of response.tool_calls) {\n        console.log(\`调用工具: \${call.name}(\${call.arguments})\`)\n        const result = await tools[call.name](JSON.parse(call.arguments))\n        console.log(\`结果: \${JSON.stringify(result)}\`)\n\n        // 4. 将结果返回给 LLM\n        messages.push({\n          role: 'tool',\n          tool_call_id: call.id,\n          content: JSON.stringify(result)\n        })\n      }\n    } else {\n      // 5. LLM 直接返回最终答案\n      console.log('任务完成')\n      return response.content\n    }\n  }\n  return '达到最大步数限制，任务未完成'\n}\n\nconsole.log('循环流程: Thought → Action → Observation → (repeat)')`,
    practice: {
      title: '练习：简化 ReAct',
      description: '实现一个简化版循环：给定数学表达式 "3+4*2"，自动选择加法/乘法工具分步计算。',
      hint: 'while 循环 + 条件判断 + 工具调用',
      solution: `const tools = {\n  add: ({ a, b }) => a + b,\n  mul: ({ a, b }) => a * b\n}\n\nfunction simpleAgent(expression) {\n  const steps = []\n  // 模拟: 先算乘法\n  if (expression.includes('*')) {\n    const r = tools.mul({ a: 4, b: 2 })\n    steps.push('Thought: 先算乘法 4*2')\n    steps.push('Action: mul(4,2) = ' + r)\n    steps.push('Thought: 再算加法 3+' + r)\n    steps.push('Action: add(3,' + r + ') = ' + tools.add({ a: 3, b: r }))\n  }\n  return steps.join('\\n')\n}\nconsole.log(simpleAgent('3+4*2'))`
    }
  },

  'prompt-engineering': {
    title: '提示词工程',
    api: 'System Prompt 设计',
    difficulty: 'medium',
    description: `<p>System Prompt 是 Agent 的"灵魂"，定义了它的角色、能力和行为规范。一个好的 System Prompt 直接决定了 Agent 的表现。</p>
<p><strong>System Prompt 设计模板：</strong></p>
<p>• <strong>角色定位</strong> — 明确 Agent 是谁，擅长什么<br/>
• <strong>可用工具</strong> — 列出工具名称、参数和使用场景<br/>
• <strong>工作流程</strong> — 描述 Agent 应该如何思考和行动<br/>
• <strong>输出格式</strong> — 规定回答的结构（如 Markdown、JSON）<br/>
• <strong>边界规则</strong> — 定义什么不能做（安全限制）<br/>
• <strong>Few-shot 示例</strong> — 提供 1-2 个输入输出示例</p>
<p><strong>常见问题：</strong></p>
<p>• Prompt 太短 → Agent 行为不可控，经常偏离任务<br/>
• Prompt 太长 → 占用 token，且 LLM 可能忽略部分内容<br/>
• 没有示例 → LLM 不理解期望的输出格式<br/>
• 没有边界 → Agent 可能执行危险操作</p>`,
    code: `// 完整的 System Prompt 设计\nconst systemPrompt = \`你是一个专业的数据分析助手。\n\n## 角色\n帮助用户分析数据、发现趋势并生成可视化报告。\n你精通 SQL、Python 数据分析和图表生成。\n\n## 可用工具\n1. query_database(sql: string)\n   - 执行 SQL 查询，返回结果集\n   - 支持 SELECT 查询，不支持 DELETE/UPDATE\n   - 示例: query_database("SELECT * FROM sales WHERE date > '2024-01-01'")\n\n2. generate_chart(data: array, type: string)\n   - 生成图表，type 可选: line, bar, pie, scatter\n   - 示例: generate_chart(salesData, "line")\n\n3. export_report(format: string)\n   - 导出报告，format 可选: pdf, xlsx, csv\n\n## 工作流程\n1. 理解用户的数据分析需求\n2. 编写 SQL 查询数据\n3. 分析数据趋势和异常\n4. 生成可视化图表\n5. 用 Markdown 格式输出分析报告\n\n## 输出格式\n- 使用 Markdown\n- 包含数据摘要、趋势分析、建议三个部分\n- 数字使用千分位格式\n\n## 限制\n- 不执行 DELETE/UPDATE 操作\n- 敏感数据（手机号、身份证）需脱敏\n- 单次查询最多返回 10000 行\n\`\n\nconsole.log('Prompt 长度:', systemPrompt.length, '字符')\nconsole.log('预估 token:', Math.ceil(systemPrompt.length / 2))`,
    practice: {
      title: '练习：设计 Prompt',
      description: '为一个"代码审查 Agent"设计完整的 System Prompt，包含角色、审查维度、输出格式和限制。',
      hint: '角色 → 审查维度(安全/性能/规范) → 输出表格 → 限制',
      solution: `const prompt = \`你是代码审查专家，帮助团队提升代码质量。\n\n## 审查维度\n1. 代码规范: 命名、格式、注释\n2. 安全性: XSS、SQL注入、硬编码密钥\n3. 性能: N+1查询、内存泄漏、过度渲染\n4. 可维护性: 职责单一、耦合度、代码重复\n\n## 输出格式\n用 Markdown 表格:\n| 严重性 | 文件:行号 | 问题描述 | 改进建议 |\n| error | app.js:42 | SQL注入风险 | 使用参数化查询 |\n\n## 限制\n- 只给建议，不直接修改代码\n- 每次最多 10 条问题\n- 不审查第三方依赖代码\n\`\nconsole.log('审查 Agent Prompt 已设计')\nconsole.log(prompt.split('\\n').length, '行')`
    }
  },

  'agent-arch': {
    title: 'Agent 架构模式',
    api: 'Architecture',
    difficulty: 'medium',
    description: `<p>根据复杂度不同，Agent 有多种架构模式：</p>
<p><strong>1. 单 Agent 模式</strong>— 一个 LLM + 一组工具，适合简单任务<br/>
<strong>2. 路由 Agent 模式</strong>— 一个调度 Agent 负责分发给多个专业 Agent<br/>
<strong>3. 层级 Agent 模式</strong>— 管理者 Agent 分解任务，Worker Agent 执行<br/>
<strong>4. 多 Agent 协作</strong>— 多个 Agent 平等协作，通过消息传递通信</p>
<p><strong>选型建议：</strong></p>
<p>• 简单问答/工具调用 → 单 Agent<br/>
• 多领域专业能力 → 路由 Agent<br/>
• 复杂任务分解 → 层级 Agent<br/>
• 需要辩论/审核/协作 → 多 Agent</p>`,
    code: `// 1. 单 Agent — 最简单\nconst singleAgent = {\n  llm: 'Claude',\n  tools: ['search', 'calculate', 'write'],\n  loop: '思考 → 行动 → 观察'\n}\n\n// 2. 路由 Agent — 分发任务\nconst routerAgent = {\n  routes: {\n    '代码问题': 'CodeAgent',\n    '数据分析': 'DataAgent',\n    '文档写作': 'WriteAgent'\n  },\n  dispatch(query) {\n    // LLM 判断意图，路由到对应 Agent\n    for (const [pattern, agent] of Object.entries(this.routes)) {\n      if (query.includes(pattern)) return agent\n    }\n    return 'GeneralAgent'\n  }\n}\n\n// 3. 层级 Agent — 任务分解\nconst hierarchicalAgent = {\n  manager: '接收需求 → 分解子任务 → 分配给 Worker',\n  workers: ['ResearchWorker', 'CodeWorker', 'TestWorker'],\n  workflow: '计划 → 并行执行 → 整合结果 → 审核'\n}\n\nconsole.log('单Agent:', JSON.stringify(singleAgent))\nconsole.log('路由分发:', routerAgent.dispatch('帮我写代码'))\nconsole.log('层级:', hierarchicalAgent.manager)`,
    practice: {
      title: '练习：路由实现',
      description: '实现一个简单的路由 Agent：根据用户输入关键词，将请求分发到不同的处理函数。',
      hint: 'routes 对象 + 关键词匹配',
      solution: `const router = {\n  handlers: {\n    '天气': (q) => '查询天气: ' + q,\n    '翻译': (q) => '翻译结果: ' + q,\n    '计算': (q) => '计算结果: ' + eval(q.replace(/[^0-9+\\-*/]/g, ''))\n  },\n  handle(query) {\n    for (const [key, handler] of Object.entries(this.handlers)) {\n      if (query.includes(key)) return handler(query)\n    }\n    return '通用回答: ' + query\n  }\n}\nconsole.log(router.handle('北京天气'))\nconsole.log(router.handle('翻译hello'))\nconsole.log(router.handle('你好'))`
    }
  },

  'tool-intro': {
    title: '工具调用基础',
    api: 'Function Calling',
    difficulty: 'easy',
    description: `<p>工具调用（Function Calling）是 Agent 与外部世界交互的核心机制。LLM 本身不能执行代码或访问网络，但可以通过"工具"来扩展能力。</p>
<p><strong>工具定义三要素：</strong></p>
<p>• <strong>name</strong> — 工具名称，LLM 用它来选择工具<br/>
• <strong>description</strong> — 工具描述，告诉 LLM 什么时候该用这个工具<br/>
• <strong>parameters</strong> — 参数定义（JSON Schema），指定输入格式</p>
<p><strong>调用流程：</strong></p>
<p>1. 定义工具列表 → 2. 发送请求给 LLM → 3. LLM 返回 tool_calls → 4. 执行对应函数 → 5. 将结果返回给 LLM</p>
<p><strong>常用工具类型：</strong></p>
<p>• 数据查询：数据库查询、API 调用<br/>
• 计算工具：数学运算、数据分析<br/>
• 内容生成：写文件、生成图片<br/>
• 外部交互：发邮件、发消息、控制设备</p>`,
    code: `// 完整的工具定义示例\nconst tools = [\n  {\n    type: 'function',\n    function: {\n      name: 'get_weather',\n      description: '获取指定城市当前的天气信息，包括温度、天气状况、湿度等',\n      parameters: {\n        type: 'object',\n        properties: {\n          city: {\n            type: 'string',\n            description: '城市名称，如"北京"、"上海"'\n          },\n          unit: {\n            type: 'string',\n            enum: ['celsius', 'fahrenheit'],\n            description: '温度单位'\n          }\n        },\n        required: ['city']\n      }\n    }\n  },\n  {\n    type: 'function',\n    function: {\n      name: 'search_web',\n      description: '搜索互联网获取最新信息',\n      parameters: {\n        type: 'object',\n        properties: {\n          query: { type: 'string', description: '搜索关键词' },\n          max_results: { type: 'number', description: '最大结果数，默认5' }\n        },\n        required: ['query']\n      }\n    }\n  }\n]\n\nconsole.log('已定义', tools.length, '个工具')\ntools.forEach(t => {\n  const fn = t.function\n  console.log(\`- \${fn.name}: \${fn.description.slice(0, 30)}...\`)\n})`,
    practice: {
      title: '练习：定义工具',
      description: '定义一个 <code>calculator</code> 工具的完整 JSON Schema，支持加减乘除四则运算。',
      hint: 'name + description + parameters.properties(a, b, op)',
      solution: `const calcTool = {\n  type: 'function',\n  function: {\n    name: 'calculator',\n    description: '执行基本数学运算（加减乘除）',\n    parameters: {\n      type: 'object',\n      properties: {\n        a: { type: 'number', description: '第一个操作数' },\n        b: { type: 'number', description: '第二个操作数' },\n        op: {\n          type: 'string',\n          enum: ['+', '-', '*', '/'],\n          description: '运算符'\n        }\n      },\n      required: ['a', 'b', 'op']\n    }\n  }\n}\nconsole.log(JSON.stringify(calcTool, null, 2))`
    }
  },

  'tool-call': {
    title: '执行工具调用',
    api: 'Tool Execution',
    difficulty: 'medium',
    description: `<p>当 LLM 返回 <code>tool_calls</code> 时，需要一个可靠的工具执行器来处理调用。</p>
<p><strong>执行器核心职责：</strong></p>
<p>• <strong>注册工具</strong> — 将函数名和实现关联<br/>
• <strong>参数解析</strong> — 将 JSON 字符串解析为对象<br/>
• <strong>执行调用</strong> — 安全地调用对应函数<br/>
• <strong>错误处理</strong> — 捕获异常并返回友好错误信息<br/>
• <strong>结果格式化</strong> — 将结果转为 LLM 可理解的格式</p>
<p><strong>安全注意事项：</strong></p>
<p>• 验证参数类型和范围，防止注入攻击<br/>
• 设置超时机制，防止工具执行卡死<br/>
• 限制工具权限，遵循最小权限原则<br/>
• 记录所有工具调用日志</p>`,
    code: `// 生产级工具执行器\nclass ToolExecutor {\n  constructor() {\n    this.tools = new Map()\n    this.callLog = []\n  }\n\n  // 注册工具\n  register(name, fn, metadata = {}) {\n    this.tools.set(name, {\n      fn,\n      description: metadata.description || '',\n      timeout: metadata.timeout || 10000\n    })\n  }\n\n  // 执行工具调用\n  async execute(toolCall) {\n    const { name, arguments: argsStr, id } = toolCall\n    const tool = this.tools.get(name)\n\n    if (!tool) {\n      return {\n        tool_call_id: id,\n        content: JSON.stringify({ error: \`未知工具: \${name}\` })\n      }\n    }\n\n    try {\n      const args = JSON.parse(argsStr)\n      const startTime = Date.now()\n\n      // 带超时的执行\n      const result = await Promise.race([\n        tool.fn(args),\n        new Promise((_, reject) =>\n          setTimeout(() => reject(new Error('超时')), tool.timeout)\n        )\n      ])\n\n      // 记录日志\n      this.callLog.push({ name, args, duration: Date.now() - startTime })\n\n      return {\n        tool_call_id: id,\n        content: JSON.stringify(result)\n      }\n    } catch (e) {\n      return {\n        tool_call_id: id,\n        content: JSON.stringify({ error: e.message })\n      }\n    }\n  }\n\n  getLog() { return this.callLog }\n}\n\nconst executor = new ToolExecutor()\nexecutor.register('add', ({ a, b }) => a + b, { description: '加法' })\nexecutor.register('search', ({ q }) => '结果: ' + q, { description: '搜索' })\n\nexecutor.execute({ name: 'add', arguments: '{"a":3,"b":4}', id: 'c1' })\n  .then(r => console.log('结果:', r.content))`,
    practice: {
      title: '练习：工具注册与执行',
      description: '创建 ToolExecutor，注册 <code>greet</code>（问候语）和 <code>time</code>（当前时间），然后执行并输出结果。',
      hint: 'register + execute 返回 { tool_call_id, content }',
      solution: `class ToolExecutor {\n  constructor() { this.tools = new Map() }\n  register(name, fn) { this.tools.set(name, fn) }\n  execute({ name, arguments: args, id }) {\n    const fn = this.tools.get(name)\n    if (!fn) return { tool_call_id: id, content: '工具不存在' }\n    const result = fn(JSON.parse(args || '{}'))\n    return { tool_call_id: id, content: JSON.stringify(result) }\n  }\n}\n\nconst ex = new ToolExecutor()\nex.register('greet', ({ name }) => '你好, ' + name + '!')\nex.register('time', () => new Date().toLocaleTimeString())\n\nconsole.log(ex.execute({ name: 'greet', arguments: '{"name":"Vue"}', id: '1' }))\nconsole.log(ex.execute({ name: 'time', id: '2' }))`
    }
  },

  'tool-result': {
    title: '处理工具结果',
    api: 'Result Handling',
    difficulty: 'medium',
    description: `<p>工具执行后，结果需要返回给 LLM 继续推理。结果的质量直接影响 LLM 的后续决策。</p>
<p><strong>结果处理策略：</strong></p>
<p>• <strong>成功</strong> — 返回格式化的数据（优先 JSON，便于 LLM 解析）<br/>
• <strong>失败</strong> — 返回清晰的错误信息 + 建议，让 LLM 能调整重试<br/>
• <strong>大数据</strong> — 截断或摘要，避免超出上下文窗口<br/>
• <strong>非结构化</strong> — 转为结构化格式再返回</p>
<p><strong>消息格式：</strong></p>
<p>工具结果以 <code>{ role: 'tool', tool_call_id, content }</code> 的形式追加到消息列表。tool_call_id 必须与 LLM 返回的 id 一一对应。</p>`,
    code: `// 结果处理函数\nfunction formatToolResult(toolCallId, result, maxLen = 3000) {\n  let content\n\n  if (result.error) {\n    // 失败情况：提供错误信息和建议\n    content = JSON.stringify({\n      success: false,\n      error: result.error,\n      suggestion: '请检查参数是否正确后重试'\n    })\n  } else if (typeof result.data === 'object') {\n    // 对象：格式化 JSON\n    content = JSON.stringify(result.data, null, 2)\n  } else {\n    content = String(result.data ?? result)\n  }\n\n  // 截断过长内容\n  if (content.length > maxLen) {\n    content = content.slice(0, maxLen) +\n      \`\\n...(已截断，共\${content.length}字符)\`\n  }\n\n  return {\n    role: 'tool',\n    tool_call_id: toolCallId,\n    content\n  }\n}\n\n// 使用示例\nconst messages = [\n  { role: 'user', content: '查一下北京天气' },\n  {\n    role: 'assistant',\n    content: null,\n    tool_calls: [{ id: 'call_1', name: 'get_weather', arguments: '{"city":"北京"}' }]\n  }\n]\n\n// 添加工具结果\nconst toolResult = formatToolResult('call_1', {\n  data: { city: '北京', temp: 22, weather: '晴', humidity: 45 }\n})\nmessages.push(toolResult)\n\nconsole.log('消息数:', messages.length)\nconsole.log('工具结果:', toolResult.content)`,
    practice: {
      title: '练习：结果格式化',
      description: '编写 <code>formatResult</code> 函数，分别处理：成功对象、错误信息、超长文本三种情况。',
      hint: '判断 error → 判断类型 → 判断长度',
      solution: `function formatResult(id, result) {\n  let content\n  if (result.error) {\n    content = JSON.stringify({ ok: false, msg: result.error })\n  } else if (typeof result.data === 'object') {\n    content = JSON.stringify(result.data, null, 2)\n  } else {\n    content = String(result.data)\n    if (content.length > 100) content = content.slice(0, 100) + '...'\n  }\n  return { role: 'tool', tool_call_id: id, content }\n}\n\nconsole.log(formatResult('1', { data: { users: 100 } }))\nconsole.log(formatResult('2', { error: '超时' }))\nconsole.log(formatResult('3', { data: 'A'.repeat(200) }).content.length)`
    }
  },

  'tool-advanced': {
    title: '高级工具模式',
    api: 'Advanced Tools',
    difficulty: 'hard',
    description: `<p>在生产环境中，工具调用需要更复杂的模式：</p>
<p><strong>1. 并行工具调用</strong> — LLM 一次返回多个 tool_calls，可以并行执行以提升速度</p>
<p><strong>2. 工具链</strong> — 前一个工具的结果作为后一个工具的输入</p>
<p><strong>3. 动态工具注册</strong> — 根据用户权限或上下文动态加载可用工具</p>
<p><strong>4. 工具结果缓存</strong> — 相同参数的调用直接返回缓存结果</p>`,
    code: `// 1. 并行工具调用\nasync function executeParallel(toolCalls, executor) {\n  const promises = toolCalls.map(call => executor.execute(call))\n  return Promise.all(promises)\n}\n\n// 2. 工具链 — 前一个结果传给下一个\nasync function executeChain(calls, executor) {\n  const results = []\n  for (const call of calls) {\n    // 支持引用上一步结果\n    const args = call.arguments.replace\\\n      /\\{\\{prev\\}\\}/g,\n      JSON.stringify(results[results.length - 1])\n    const result = await executor.execute({ ...call, arguments: args })\n    results.push(result)\n  }\n  return results\n}\n\n// 3. 动态工具注册\nfunction getToolsForUser(userRole) {\n  const allTools = {\n    admin: ['query_db', 'modify_db', 'send_email', 'view_logs'],\n    user: ['query_db', 'send_email'],\n    guest: ['query_db']\n  }\n  return allTools[userRole] || allTools.guest\n}\n\n// 4. 带缓存的工具执行\nconst cache = new Map()\nfunction cachedExecute(name, args, fn) {\n  const key = name + JSON.stringify(args)\n  if (cache.has(key)) return cache.get(key)\n  const result = fn(args)\n  cache.set(key, result)\n  return result\n}\n\nconsole.log('管理员工具:', getToolsForUser('admin'))\nconsole.log('访客工具:', getToolsForUser('guest'))`,
    practice: {
      title: '练习：并行执行',
      description: '实现一个 <code>parallelExecute</code> 函数，同时执行多个工具调用并返回所有结果。',
      hint: 'Promise.all + map',
      solution: `async function parallelExecute(calls, tools) {\n  const promises = calls.map(async (call) => {\n    const fn = tools[call.name]\n    const args = JSON.parse(call.args || '{}')\n    return { name: call.name, result: await fn(args) }\n  })\n  return Promise.all(promises)\n}\n\nconst tools = {\n  add: ({ a, b }) => a + b,\n  mul: ({ a, b }) => a * b,\n  greet: ({ name }) => 'Hi ' + name\n}\n\nparallelExecute([\n  { name: 'add', args: '{"a":1,"b":2}' },\n  { name: 'mul', args: '{"a":3,"b":4}' },\n  { name: 'greet', args: '{"name":"Vue"}' }\n], tools).then(results => {\n  results.forEach(r => console.log(r.name + ':', r.result))\n})`
    }
  },

  'chat-history': {
    title: '对话历史管理',
    api: 'Message History',
    difficulty: 'easy',
    description: `<p>多轮对话的核心是维护消息历史。每条消息包含 <code>role</code> 和 <code>content</code>。</p>
<p><strong>消息角色类型：</strong></p>
<p>• <code>system</code> — 系统指令，定义 Agent 行为（通常在第一条）<br/>
• <code>user</code> — 用户输入<br/>
• <code>assistant</code> — LLM 回复（可能包含 tool_calls）<br/>
• <code>tool</code> — 工具执行结果（需关联 tool_call_id）</p>
<p><strong>管理要点：</strong></p>
<p>• system prompt 始终保留在最前面<br/>
• user/assistant 必须交替出现（OpenAI 要求）<br/>
• tool 消息必须紧跟对应的 assistant tool_calls<br/>
• 消息越多，token 消耗越大，需要管理窗口</p>`,
    code: `// 对话历史管理器\nclass ChatHistory {\n  constructor(systemPrompt) {\n    this.messages = []\n    if (systemPrompt) {\n      this.messages.push({ role: 'system', content: systemPrompt })\n    }\n    this.tokenEstimate = 0\n  }\n\n  addUser(content) {\n    this.messages.push({ role: 'user', content })\n    this.tokenEstimate += content.length / 2\n  }\n\n  addAssistant(content, toolCalls) {\n    const msg = { role: 'assistant', content: content || '' }\n    if (toolCalls) msg.tool_calls = toolCalls\n    this.messages.push(msg)\n    this.tokenEstimate += (content || '').length / 2\n  }\n\n  addTool(toolCallId, content) {\n    this.messages.push({\n      role: 'tool',\n      tool_call_id: toolCallId,\n      content: typeof content === 'string' ? content : JSON.stringify(content)\n    })\n    this.tokenEstimate += String(content).length / 2\n  }\n\n  getMessages() { return this.messages }\n  get length() { return this.messages.length }\n  get tokens() { return Math.ceil(this.tokenEstimate) }\n\n  // 获取最近 N 轮对话\n  getRecent(turns = 5) {\n    const system = this.messages.filter(m => m.role === 'system')\n    const rest = this.messages.filter(m => m.role !== 'system')\n    return [...system, ...rest.slice(-turns * 2)]\n  }\n}\n\nconst history = new ChatHistory('你是旅行助手')\nhistory.addUser('推荐北京景点')\nhistory.addAssistant('推荐故宫、长城、颐和园...')\nhistory.addUser('故宫门票多少钱')\nhistory.addAssistant('故宫门票60元/人...')\n\nconsole.log('消息数:', history.length)\nconsole.log('预估 token:', history.tokens)`,
    practice: {
      title: '练习：管理对话',
      description: '创建 ChatHistory，模拟一段 3 轮对话（问路 → 追问 → 感谢），输出完整历史。',
      hint: 'addUser + addAssistant 循环交替',
      solution: `class ChatHistory {\n  constructor() { this.msgs = [] }\n  add(role, content) { this.msgs.push({ role, content }) }\n  getAll() { return this.msgs }\n  toString() {\n    return this.msgs.map(m => m.role + ': ' + m.content).join('\\n')\n  }\n}\n\nconst h = new ChatHistory()\nh.add('system', '你是编程助手')\nh.add('user', '什么是 Vue 3?')\nh.add('assistant', 'Vue 3 是渐进式 JS 框架，支持 Composition API')\nh.add('user', 'Composition API 有什么优势?')\nh.add('assistant', '更好的逻辑复用、TypeScript 支持、更灵活的代码组织')\nh.add('user', '谢谢!')\nh.add('assistant', '不客气，有问题随时问!')\nconsole.log(h.toString())`
    }
  },

  'context-window': {
    title: '上下文窗口管理',
    api: 'Token Management',
    difficulty: 'hard',
    description: `<p>每个 LLM 都有 token 上下文限制。超出限制需要智能管理窗口。</p>
<p><strong>各模型上下文窗口：</strong></p>
<p>• Claude 3.5 — 200K tokens<br/>
• GPT-4 Turbo — 128K tokens<br/>
• Gemini 1.5 — 1M tokens<br/>
• DeepSeek — 64K tokens</p>
<p><strong>四种管理策略：</strong></p>
<p>• <strong>截断</strong> — 删除最早的消息（简单粗暴，可能丢失关键信息）<br/>
• <strong>滑动窗口</strong> — 保留 system + 最近 N 轮（平衡效果和成本）<br/>
• <strong>摘要压缩</strong> — 用 LLM 将旧对话压缩为摘要（效果好但额外消耗 token）<br/>
• <strong>向量检索</strong> — 只加载与当前问题相关的历史（最智能但实现复杂）</p>`,
    code: `// 四种窗口管理策略\n\n// 策略1: 简单截断\nfunction truncateOldest(messages, maxCount) {\n  const system = messages.filter(m => m.role === 'system')\n  const rest = messages.filter(m => m.role !== 'system')\n  if (rest.length <= maxCount) return messages\n  return [...system, ...rest.slice(-maxCount)]\n}\n\n// 策略2: 滑动窗口（推荐）\nfunction slidingWindow(messages, maxTurns = 10) {\n  const system = messages.filter(m => m.role === 'system')\n  const rest = messages.filter(m => m.role !== 'system')\n  const recent = rest.slice(-maxTurns * 2)\n  return [...system, ...recent]\n}\n\n// 策略3: Token 级别截断\nfunction truncateByTokens(messages, maxTokens = 4000) {\n  const system = messages.filter(m => m.role === 'system')\n  let tokens = system.reduce((s, m) => s + m.content.length / 2, 0)\n  const kept = []\n  // 从最新消息往回加\n  for (let i = messages.length - 1; i >= 0; i--) {\n    if (messages[i].role === 'system') continue\n    const t = messages[i].content.length / 2\n    if (tokens + t > maxTokens) break\n    tokens += t\n    kept.unshift(messages[i])\n  }\n  return [...system, ...kept]\n}\n\n// 模拟使用\nconst msgs = Array.from({ length: 20 }, (_, i) => ({\n  role: i % 2 === 0 ? 'user' : 'assistant',\n  content: '消息 ' + i\n}))\nmsgs.unshift({ role: 'system', content: '助手' })\n\nconsole.log('原始:', msgs.length, '条')\nconsole.log('滑动窗口:', slidingWindow(msgs, 3).length, '条')\nconsole.log('Token截断:', truncateByTokens(msgs, 100).length, '条')`,
    practice: {
      title: '练习：窗口管理',
      description: '实现滑动窗口函数：保留 system 消息 + 最近 2 轮对话（4 条消息）。',
      hint: 'filter system + slice(-4)',
      solution: `function slidingWindow(msgs, turns = 2) {\n  const sys = msgs.filter(m => m.role === 'system')\n  const rest = msgs.filter(m => m.role !== 'system')\n  return [...sys, ...rest.slice(-turns * 2)]\n}\n\nconst all = [\n  { role: 'system', content: '助手' },\n  { role: 'user', content: '1' },\n  { role: 'assistant', content: '答1' },\n  { role: 'user', content: '2' },\n  { role: 'assistant', content: '答2' },\n  { role: 'user', content: '3' },\n  { role: 'assistant', content: '答3' }\n]\nconst kept = slidingWindow(all, 2)\nconsole.log('保留', kept.length, '条:')\nkept.forEach(m => console.log(m.role, m.content))`
    }
  },

  'memory': {
    title: 'Agent 记忆系统',
    api: 'Memory System',
    difficulty: 'hard',
    description: `<p>Agent 的记忆系统分三层，类似人类记忆：</p>
<p>• <strong>短期记忆（Short-term）</strong>— 当前对话的上下文，会话结束即丢失<br/>
• <strong>工作记忆（Working）</strong>— 当前任务执行中的中间状态和变量<br/>
• <strong>长期记忆（Long-term）</strong>— 跨会话持久化的知识，通常存储在向量数据库</p>
<p><strong>长期记忆实现方式：</strong></p>
<p>• 提取关键信息（用户偏好、重要决策、事实）<br/>
• 生成向量并存储到向量数据库<br/>
• 新对话开始时，检索相关记忆并注入上下文<br/>
• 定期整理和去重</p>`,
    code: `// 三层记忆系统\nclass AgentMemory {\n  constructor() {\n    this.shortTerm = []     // 对话历史\n    this.working = {}       // 当前任务状态\n    this.longTerm = []      // 持久化记忆\n  }\n\n  // 短期记忆\n  addToShortTerm(role, content) {\n    this.shortTerm.push({ role, content, time: Date.now() })\n  }\n\n  // 工作记忆\n  setWorking(key, value) {\n    this.working[key] = value\n  }\n  getWorking(key) {\n    return this.working[key]\n  }\n  clearWorking() {\n    this.working = {}\n  }\n\n  // 长期记忆\n  remember(key, value, tags = []) {\n    this.longTerm.push({\n      key, value, tags,\n      time: new Date().toISOString(),\n      accessCount: 0\n    })\n  }\n\n  recall(query) {\n    return this.longTerm\n      .filter(m =>\n        m.key.includes(query) ||\n        String(m.value).includes(query) ||\n        m.tags.some(t => t.includes(query))\n      )\n      .map(m => {\n        m.accessCount++\n        return m\n      })\n  }\n\n  // 获取最重要的记忆（按访问频率）\n  getImportant(limit = 5) {\n    return [...this.longTerm]\n      .sort((a, b) => b.accessCount - a.accessCount)\n      .slice(0, limit)\n  }\n}\n\nconst mem = new AgentMemory()\nmem.remember('用户姓名', '张三', ['用户信息'])\nmem.remember('偏好语言', 'TypeScript', ['偏好', '编程'])\nmem.remember('项目', 'Vue 3 管理后台', ['项目'])\nmem.setWorking('currentTask', '编写登录功能')\n\nconsole.log('回忆"用户":', mem.recall('用户'))\nconsole.log('工作状态:', mem.getWorking('currentTask'))`,
    practice: {
      title: '练习：记忆 CRUD',
      description: '实现记忆系统：支持 remember（记住）、recall（回忆）、forget（遗忘）、list（列出全部）。',
      hint: '数组 + filter + splice',
      solution: `class Memory {\n  constructor() { this.items = [] }\n  remember(key, value) {\n    this.items.push({ key, value, time: Date.now() })\n  }\n  recall(keyword) {\n    return this.items.filter(m =>\n      m.key.includes(keyword) || String(m.value).includes(keyword)\n    )\n  }\n  forget(key) {\n    this.items = this.items.filter(m => m.key !== key)\n  }\n  list() { return this.items }\n}\n\nconst m = new Memory()\nm.remember('用户', '李四')\nm.remember('项目', 'Vue Agent')\nm.remember('框架', 'Vue 3')\nconsole.log('全部:', m.list().length)\nconsole.log('回忆Vue:', m.recall('Vue').length)\nm.remember('用户', '王五')\nconsole.log('回忆用户:', m.recall('用户').length)`
    }
  },

  'streaming': {
    title: '流式输出',
    api: 'Streaming',
    difficulty: 'medium',
    description: `<p>流式输出（Streaming）让 Agent 的响应逐字显示，而不是等待整个响应完成。这对用户体验至关重要。</p>
<p><strong>为什么需要 Streaming：</strong></p>
<p>• LLM 生成完整响应可能需要 5-15 秒<br/>
• 用户等待时间过长会产生焦虑感<br/>
• 逐字输出让用户感觉 Agent 在"思考"<br/>
• 可以在生成过程中就展示部分内容</p>
<p><strong>实现方式：</strong></p>
<p>• 使用 Server-Sent Events（SSE）从后端推送到前端<br/>
• 使用 ReadableStream 处理 chunk<br/>
• Vue/React 中用 ref 逐步更新显示内容</p>`,
    code: `// 模拟流式输出\nasync function* streamResponse(text, delay = 30) {\n  for (const char of text) {\n    yield char\n    await new Promise(r => setTimeout(r, delay))\n  }\n}\n\n// 消费流\nasync function displayStream(generator) {\n  let result = ''\n  for await (const chunk of generator) {\n    result += chunk\n    process.stdout.write(chunk)\n  }\n  console.log('\\n--- 完成，共', result.length, '字 ---')\n}\n\n// 真实场景：fetch + ReadableStream\nasync function streamFromAPI(url, messages) {\n  const response = await fetch(url, {\n    method: 'POST',\n    headers: { 'Content-Type': 'application/json' },\n    body: JSON.stringify({ messages, stream: true })\n  })\n\n  const reader = response.body.getReader()\n  const decoder = new TextDecoder()\n  let result = ''\n\n  while (true) {\n    const { done, value } = await reader.read()\n    if (done) break\n    const chunk = decoder.decode(value)\n    // 解析 SSE 格式: "data: {...}\\n\\n"\n    for (const line of chunk.split('\\n')) {\n      if (line.startsWith('data: ')) {\n        const data = JSON.parse(line.slice(6))\n        result += data.choices?.[0]?.delta?.content || ''\n      }\n    }\n  }\n  return result\n}\n\nconsole.log('模拟流式输出:')\ndisplayStream(streamResponse('Hello, I am an AI Agent!'))`,
    practice: {
      title: '练习：模拟流式',
      description: '实现一个 <code>streamText</code> 生成器，逐字符 yield 一段文字，然后用 for-of 拼接输出。',
      hint: 'function* + yield char',
      solution: `function* streamText(text) {\n  for (const char of text) {\n    yield char\n  }\n}\n\nlet output = ''\nfor (const char of streamText('AI Agent 正在思考...')) {\n  output += char\n}\nconsole.log('流式结果:', output)\nconsole.log('长度:', output.length)\n\n// 模拟延迟效果\nasync function delayedStream(text) {\n  let result = ''\n  for (const char of streamText(text)) {\n    result += char\n  }\n  return result\n}\ndelayedStream('你好，我是AI助手').then(r => console.log(r))`
    }
  },

  'rag-intro': {
    title: 'RAG 概念',
    api: '检索增强生成',
    difficulty: 'medium',
    description: `<p>RAG（Retrieval-Augmented Generation，检索增强生成）将外部知识库与 LLM 结合，解决两大问题：</p>
<p>• <strong>知识过时</strong> — LLM 的训练数据有截止日期<br/>
• <strong>幻觉</strong> — LLM 可能编造不存在的事实</p>
<p><strong>RAG 完整流程：</strong></p>
<p>1. <strong>索引（Indexing）</strong>— 文档分块 → 生成向量 → 存入向量数据库<br/>
2. <strong>检索（Retrieval）</strong>— 用户问题 → 向量化 → 相似度搜索 → 取 Top-K 文档<br/>
3. <strong>增强（Augmentation）</strong>— 将检索到的文档作为上下文注入 Prompt<br/>
4. <strong>生成（Generation）</strong>— LLM 基于上下文生成有据可依的回答</p>
<p><strong>常用技术栈：</strong></p>
<p>• 向量数据库：Pinecone、ChromaDB、Weaviate、Milvus<br/>
• Embedding：OpenAI text-embedding-3、BGE、Cohere<br/>
• 框架：LangChain、LlamaIndex、Haystack</p>`,
    code: `// RAG 流程示意\nconst ragSteps = [\n  {\n    step: '索引',\n    input: '产品文档.pdf',\n    process: '分块 → Embedding → 存储',\n    output: '向量数据库中的文档块'\n  },\n  {\n    step: '检索',\n    input: '"如何退款?"',\n    process: '问题向量化 → 相似度搜索',\n    output: 'Top-3 相关文档: 退款流程、退款条件、退款时间'\n  },\n  {\n    step: '增强',\n    input: '问题 + 检索结果',\n    process: '组装 Prompt 模板',\n    output: '"基于以下文档回答: [文档1][文档2][文档3]\\n问题: 如何退款?"'\n  },\n  {\n    step: '生成',\n    input: '增强后的 Prompt',\n    process: 'LLM 理解并生成',\n    output: '"根据退款政策，您可以在购买后7天内申请退款..."'\n  }\n]\n\nragSteps.forEach(s => {\n  console.log(\`[\${s.step}] \${s.input}\`)\n  console.log(\`  → \${s.process}\`)\n  console.log(\`  → \${s.output}\\n\`)\n})`,
    practice: {
      title: '练习：理解 RAG',
      description: '画出 RAG 流程：用数组描述 4 个步骤，每步包含输入、处理、输出。',
      hint: 'step + input + process + output',
      solution: `const rag = [\n  { step: '索引', input: '原始文档', process: '分块+向量化', output: '向量库' },\n  { step: '检索', input: '用户问题', process: '相似度搜索', output: 'Top-K文档' },\n  { step: '增强', input: '问题+文档', process: '组装Prompt', output: '增强Prompt' },\n  { step: '生成', input: '增强Prompt', process: 'LLM生成', output: '最终回答' }\n]\nrag.forEach(r => {\n  console.log(\`[\${r.step}] \${r.input} → \${r.output}\`)\n})`
    }
  },

  'rag-embed': {
    title: '文档向量化',
    api: 'Embedding',
    difficulty: 'hard',
    description: `<p>向量化是 RAG 的核心步骤：将文本转为高维向量，使语义相似的文本在向量空间中接近。</p>
<p><strong>常用 Embedding 模型：</strong></p>
<p>• OpenAI <code>text-embedding-3-small</code> — 1536 维，性价比高<br/>
• OpenAI <code>text-embedding-3-large</code> — 3072 维，精度最高<br/>
• Cohere <code>embed-multilingual-v3.0</code> — 多语言支持好<br/>
• 开源 <code>BGE-M3</code> / <code>GTE-large</code> — 免费，可本地部署</p>
<p><strong>文档分块策略：</strong></p>
<p>• 按段落/章节分块（保持语义完整性）<br/>
• 块大小 512-1024 tokens（太小丢失上下文，太大检索不精确）<br/>
• 相邻块保留 50-100 token 重叠（避免边界信息丢失）<br/>
• 保留元数据：标题、来源、页码（方便引用追溯）</p>`,
    code: `// 文档分块函数\nfunction chunkDocument(text, options = {}) {\n  const {\n    chunkSize = 500,\n    overlap = 50,\n    separators = ['\\n\\n', '\\n', '。', '，']\n  } = options\n\n  // 按分隔符尝试分割\n  let parts = [text]\n  for (const sep of separators) {\n    const newParts = []\n    for (const part of parts) {\n      if (part.length > chunkSize) {\n        newParts.push(...part.split(sep))\n      } else {\n        newParts.push(part)\n      }\n    }\n    parts = newParts\n  }\n\n  // 合并过短的块\n  const chunks = []\n  let current = ''\n  for (const part of parts) {\n    if ((current + part).length > chunkSize && current) {\n      chunks.push(current.trim())\n      // 保留重叠\n      current = current.slice(-overlap) + part\n    } else {\n      current += part\n    }\n  }\n  if (current.trim()) chunks.push(current.trim())\n\n  return chunks.map((text, i) => ({\n    id: i,\n    text,\n    length: text.length\n  }))\n}\n\nconst doc = 'Vue 3 是一个用于构建用户界面的 JavaScript 框架。' +\n  '它采用组件化架构，支持响应式数据绑定。' +\n  'Composition API 是 Vue 3 的重要新特性。' +\n  '它提供了更好的代码组织和逻辑复用能力。'\n\nconst chunks = chunkDocument(doc, { chunkSize: 50, overlap: 10 })\nconsole.log('分块数:', chunks.length)\nchunks.forEach(c => console.log(\`块\${c.id} [\${c.length}字]: \${c.text.slice(0, 30)}...\`))`,
    practice: {
      title: '练习：文档分块',
      description: '实现 <code>chunk</code> 函数：将长文本按指定大小分块，带重叠。输入 300 字文本，按 100 字分块，重叠 20 字。',
      hint: 'for 循环 + slice + overlap 步进',
      solution: `function chunk(text, size = 100, overlap = 20) {\n  const chunks = []\n  for (let i = 0; i < text.length; i += size - overlap) {\n    chunks.push({\n      id: chunks.length,\n      text: text.slice(i, i + size)\n    })\n  }\n  return chunks\n}\n\nconst text = 'ABCDEFGHIJ'.repeat(30) // 300字\nconst chunks = chunk(text)\nconsole.log('分块数:', chunks.length)\nchunks.forEach(c => {\n  console.log(\`块\${c.id}: \${c.text.length}字, 前10字=\${c.text.slice(0,10)}\`)\n})`
    }
  },

  'rag-retrieve': {
    title: '检索与生成',
    api: 'Retrieval + Generation',
    difficulty: 'hard',
    description: `<p>检索阶段的核心是 <strong>相似度计算</strong>。最常用的是余弦相似度（Cosine Similarity）。</p>
<p><strong>检索流程：</strong></p>
<p>1. 将用户问题通过 Embedding 模型转为向量<br/>
2. 在向量数据库中搜索最相似的 K 个文档块<br/>
3. 过滤掉相似度低于阈值的结果<br/>
4. 将结果注入 Prompt 模板</p>
<p><strong>关键参数：</strong></p>
<p>• <code>top_k</code> — 检索文档数量（3-10，太多会引入噪音）<br/>
• <code>threshold</code> — 相似度阈值（0.7-0.9，过滤不相关结果）<br/>
• <code>hybrid_search</code> — 向量搜索 + 关键词搜索结合</p>`,
    code: `// 余弦相似度\nfunction cosineSimilarity(a, b) {\n  const dot = a.reduce((sum, v, i) => sum + v * b[i], 0)\n  const magA = Math.sqrt(a.reduce((s, v) => s + v * v, 0))\n  const magB = Math.sqrt(b.reduce((s, v) => s + v * v, 0))\n  return dot / (magA * magB)\n}\n\n// 向量检索\nfunction retrieve(queryVec, documents, topK = 3, threshold = 0.5) {\n  return documents\n    .map(doc => ({\n      ...doc,\n      similarity: cosineSimilarity(queryVec, doc.embedding)\n    }))\n    .filter(doc => doc.similarity >= threshold)\n    .sort((a, b) => b.similarity - a.similarity)\n    .slice(0, topK)\n}\n\n// 组装 RAG Prompt\nfunction buildRAGPrompt(question, docs) {\n  const context = docs\n    .map((d, i) => \`[\${i + 1}] (相似度: \${d.similarity.toFixed(2)})\\n\${d.text}\`)\n    .join('\\n\\n')\n\n  return \`你是一个专业助手。请基于以下参考文档回答问题。\n如果文档中没有相关信息，请如实说明。\n\n## 参考文档\n\${context}\n\n## 用户问题\n\${question}\n\n## 回答:\`\n}\n\n// 模拟\nconst query = [1, 0, 0]\nconst docs = [\n  { text: 'Vue 3 框架', embedding: [1, 0, 0] },\n  { text: 'React 框架', embedding: [0, 1, 0] },\n  { text: 'Vue 组合式API', embedding: [0.9, 0.1, 0] }\n]\n\nconst results = retrieve(query, docs, 2)\nconsole.log(buildRAGPrompt('什么是Vue', results))`,
    practice: {
      title: '练习：余弦相似度',
      description: '实现余弦相似度计算，找出与查询向量 [1,0,0] 最相似的 2 个文档。',
      hint: 'cosineSimilarity + sort + slice(0, 2)',
      solution: `function cosine(a, b) {\n  const dot = a.reduce((s, v, i) => s + v * b[i], 0)\n  const ma = Math.sqrt(a.reduce((s, v) => s + v*v, 0))\n  const mb = Math.sqrt(b.reduce((s, v) => s + v*v, 0))\n  return dot / (ma * mb)\n}\n\nconst query = [1, 0, 0]\nconst docs = [\n  { id: 1, vec: [1, 0, 0], text: '完全匹配' },\n  { id: 2, vec: [0, 1, 0], text: '正交' },\n  { id: 3, vec: [0.9, 0.1, 0], text: '近似匹配' },\n  { id: 4, vec: [-1, 0, 0], text: '相反' }\n]\nconst ranked = docs\n  .map(d => ({ ...d, sim: cosine(query, d.vec) }))\n  .sort((a, b) => b.sim - a.sim)\n  .slice(0, 2)\nranked.forEach(d => console.log(d.text + ':', d.sim.toFixed(4)))`
    }
  },

  'rag-practice': {
    title: 'RAG 完整实战',
    api: 'RAG Pipeline',
    difficulty: 'hard',
    description: `<p>将前面学的 RAG 知识整合，构建一个完整的 RAG Pipeline。</p>
<p><strong>完整 Pipeline 包含：</strong></p>
<p>1. 文档加载和预处理<br/>
2. 分块和向量化<br/>
3. 向量存储和索引<br/>
4. 查询向量化和检索<br/>
5. Prompt 组装和 LLM 调用<br/>
6. 答案后处理和引用</p>`,
    code: `// 完整 RAG Pipeline\nclass RAGPipeline {\n  constructor() {\n    this.documents = []  // 向量化后的文档\n  }\n\n  // 1. 索引文档\n  index(chunks) {\n    this.documents = chunks.map((text, i) => ({\n      id: i,\n      text,\n      embedding: this.fakeEmbed(text)  // 模拟向量化\n    }))\n    console.log(\`索引完成: \${this.documents.length} 个文档块\`)\n  }\n\n  // 模拟 Embedding\n  fakeEmbed(text) {\n    // 真实场景: 调用 OpenAI Embedding API\n    const hash = text.split('').reduce((a, c) => a + c.charCodeAt(0), 0)\n    return [Math.sin(hash), Math.cos(hash), Math.sin(hash * 2)]\n  }\n\n  // 2. 检索\n  retrieve(query, topK = 3) {\n    const queryVec = this.fakeEmbed(query)\n    return this.documents\n      .map(doc => ({\n        ...doc,\n        similarity: this.cosineSim(queryVec, doc.embedding)\n      }))\n      .sort((a, b) => b.similarity - a.similarity)\n      .slice(0, topK)\n  }\n\n  cosineSim(a, b) {\n    const dot = a.reduce((s, v, i) => s + v * b[i], 0)\n    const ma = Math.sqrt(a.reduce((s, v) => s + v*v, 0))\n    const mb = Math.sqrt(b.reduce((s, v) => s + v*v, 0))\n    return dot / (ma * mb)\n  }\n\n  // 3. 生成回答\n  answer(query) {\n    const docs = this.retrieve(query, 2)\n    const context = docs.map((d, i) => \`[\${i+1}] \${d.text}\`).join('\\n')\n    return \`基于以下文档回答 "\${query}":\\n\${context}\`\n  }\n}\n\nconst rag = new RAGPipeline()\nrag.index([\n  'Vue 3 使用 Composition API',\n  'React 使用 Hooks',\n  'Vue 3 的 ref 和 reactive 是响应式核心',\n  'React 的 useState 管理状态'\n])\nconsole.log(rag.answer('Vue 3 响应式'))`,
    practice: {
      title: '练习：构建 Pipeline',
      description: '用 RAGPipeline 类索引 3 段文档，然后查询并输出检索结果和相似度分数。',
      hint: 'index + retrieve + 遍历结果',
      solution: `class RAG {\n  constructor() { this.docs = [] }\n  index(texts) {\n    this.docs = texts.map((t, i) => ({\n      id: i, text: t,\n      vec: [t.length % 3 === 0 ? 1 : 0, t.length % 3 === 1 ? 1 : 0, t.length % 3 === 2 ? 1 : 0]\n    }))\n  }\n  search(query) {\n    const qv = [query.length % 3 === 0 ? 1 : 0, query.length % 3 === 1 ? 1 : 0, query.length % 3 === 2 ? 1 : 0]\n    return this.docs\n      .map(d => ({ ...d, sim: d.vec.reduce((s, v, i) => s + v * qv[i], 0) }))\n      .sort((a, b) => b.sim - a.sim)\n  }\n}\nconst rag = new RAG()\nrag.index(['Vue3响应式', 'React Hooks', 'Angular信号'])\nrag.search('Vue').forEach(d => console.log(d.text, 'score:', d.sim))`
    }
  },

  'langchain-intro': {
    title: 'LangChain 入门',
    api: 'LangChain.js',
    difficulty: 'medium',
    description: `<p>LangChain 是最流行的 Agent 开发框架，提供了 LLM 调用、工具管理、记忆、链式调用等标准化抽象。</p>
<p><strong>核心模块：</strong></p>
<p>• <code>ChatModel</code> — 统一的 LLM 调用接口（支持 OpenAI、Claude、本地模型）<br/>
• <code>PromptTemplate</code> — 模板化的 Prompt 管理<br/>
• <code>Chain</code> — 将多个步骤串联成工作流<br/>
• <code>Agent</code> — 自主决策 + 工具调用<br/>
• <code>Memory</code> — 对话记忆管理<br/>
• <code>Retriever</code> — RAG 检索器</p>
<p><strong>安装：</strong><code>npm install langchain @langchain/openai</code></p>`,
    code: `// LangChain 基础用法（伪代码，展示 API 风格）\n\n// 1. 创建 Chat Model\n// import { ChatOpenAI } from '@langchain/openai'\n// const model = new ChatOpenAI({ modelName: 'gpt-4', temperature: 0 })\n\n// 2. Prompt Template\n// import { ChatPromptTemplate } from '@langchain/core/prompts'\n// const prompt = ChatPromptTemplate.fromMessages([\n//   ['system', '你是一个{role}'],\n//   ['human', '{input}']\n// ])\n\n// 3. Chain: Prompt → Model → Output\n// const chain = prompt.pipe(model).pipe(new StringOutputParser())\n// const result = await chain.invoke({ role: '助手', input: '你好' })\n\n// 4. Agent with Tools\n// import { createReactAgent } from 'langchain/agents'\n// const agent = createReactAgent({ llm: model, tools: [weatherTool, searchTool] })\n// const result = await agent.invoke({ messages: [...] })\n\n// 模拟 LangChain 风格的链式调用\nclass SimpleChain {\n  constructor() { this.steps = [] }\n  pipe(fn) { this.steps.push(fn); return this }\n  async invoke(input) {\n    let result = input\n    for (const step of this.steps) {\n      result = await step(result)\n    }\n    return result\n  }\n}\n\nconst chain = new SimpleChain()\n  .pipe(x => ({ ...x, processed: true }))\n  .pipe(x => '结果: ' + JSON.stringify(x))\n\nchain.invoke({ input: 'hello' }).then(console.log)`,
    practice: {
      title: '练习：链式调用',
      description: '实现 SimpleChain 的 pipe 和 invoke 方法，将多个处理函数串联起来。',
      hint: 'steps 数组 + reduce 或 for 循环',
      solution: `class Chain {\n  constructor() { this.fns = [] }\n  pipe(fn) { this.fns.push(fn); return this }\n  run(input) {\n    return this.fns.reduce((acc, fn) => fn(acc), input)\n  }\n}\n\nconst chain = new Chain()\n  .pipe(x => x.trim())\n  .pipe(x => x.toLowerCase())\n  .pipe(x => x.split(' ').reverse().join(' '))\n\nconsole.log(chain.run('  Hello World Vue  '))\n// 输出: vue world hello`
    }
  },

  'agent-structured': {
    title: '结构化输出',
    api: 'Structured Output',
    difficulty: 'medium',
    description: `<p>让 LLM 返回结构化数据（JSON），而不是自由文本。这对 Agent 至关重要。</p>
<p><strong>为什么需要结构化输出：</strong></p>
<p>• 工具调用需要严格的参数格式<br/>
• 后续代码需要解析 LLM 的决策<br/>
• 避免从自由文本中"提取"信息的脆弱性</p>
<p><strong>实现方式：</strong></p>
<p>• <strong>Prompt 约束</strong> — 在 Prompt 中要求"返回 JSON 格式"<br/>
• <strong>JSON Mode</strong> — OpenAI 的 response_format: json_object<br/>
• <strong>Function Calling</strong> — LLM 自动返回符合 Schema 的参数<br/>
• <strong>Tool Choice</strong> — 强制 LLM 调用特定工具</p>`,
    code: `// 方式1: Prompt 约束\nconst prompt1 = \`分析以下代码的潜在问题，返回 JSON:\n{\n  "issues": [{ "line": 行号, "severity": "error|warning", "message": "描述" }],\n  "summary": "总结"\n}\`\n\n// 方式2: Function Calling 定义输出格式\nconst outputTool = {\n  name: 'report_analysis',\n  description: '报告代码分析结果',\n  parameters: {\n    type: 'object',\n    properties: {\n      issues: {\n        type: 'array',\n        items: {\n          type: 'object',\n          properties: {\n            line: { type: 'number' },\n            severity: { type: 'string', enum: ['error', 'warning', 'info'] },\n            message: { type: 'string' }\n          }\n        }\n      },\n      score: { type: 'number', description: '代码质量评分 0-100' },\n      summary: { type: 'string' }\n    },\n    required: ['issues', 'score', 'summary']\n  }\n}\n\n// 方式3: 解析和验证\nfunction parseStructuredOutput(text) {\n  try {\n    // 尝试提取 JSON\n    const match = text.match(/\\{[\\s\\S]*\\}/)\n    if (!match) throw new Error('未找到 JSON')\n    const data = JSON.parse(match[0])\n    return { success: true, data }\n  } catch (e) {\n    return { success: false, error: e.message, raw: text }\n  }\n}\n\nconsole.log(JSON.stringify(outputTool, null, 2))`,
    practice: {
      title: '练习：输出解析',
      description: '编写 <code>parseJSON</code> 函数，从 LLM 返回的混合文本中安全提取 JSON 对象。',
      hint: '正则匹配 { } + JSON.parse + try/catch',
      solution: `function parseJSON(text) {\n  try {\n    const match = text.match(/\\{[\\s\\S]*\\}/)\n    if (!match) return { ok: false, error: '无JSON' }\n    return { ok: true, data: JSON.parse(match[0]) }\n  } catch (e) {\n    return { ok: false, error: e.message }\n  }\n}\n\nconst llmOutput1 = '分析结果: {"score": 85, "issues": 2} 希望对你有帮助'\nconst llmOutput2 = '这段代码看起来不错'\n\nconsole.log(parseJSON(llmOutput1))\nconsole.log(parseJSON(llmOutput2))`
    }
  },

  'agent-error': {
    title: '错误处理与重试',
    api: 'Error Handling',
    difficulty: 'medium',
    description: `<p>生产环境的 Agent 必须优雅地处理各种错误：</p>
<p><strong>常见错误类型：</strong></p>
<p>• <strong>LLM API 错误</strong> — 超时、限流、服务不可用<br/>
• <strong>工具执行错误</strong> — 参数错误、权限不足、外部服务挂了<br/>
• <strong>解析错误</strong> — LLM 返回格式不符合预期<br/>
• <strong>逻辑错误</strong> — Agent 进入死循环或偏离任务</p>
<p><strong>处理策略：</strong></p>
<p>• <strong>重试 + 指数退避</strong> — 临时性错误自动重试<br/>
• <strong>降级</strong> — 工具失败时用备用方案<br/>
• <strong>自我纠正</strong> — 将错误信息反馈给 LLM 让它调整<br/>
• <strong>Circuit Breaker</strong> — 连续失败后暂停调用</p>`,
    code: `// 带重试的 LLM 调用\nasync function callWithRetry(fn, maxRetries = 3) {\n  for (let i = 0; i < maxRetries; i++) {\n    try {\n      return await fn()\n    } catch (e) {\n      const isLast = i === maxRetries - 1\n      const retryable = e.status === 429 || e.status >= 500\n\n      if (isLast || !retryable) throw e\n\n      // 指数退避: 1s, 2s, 4s\n      const delay = Math.pow(2, i) * 1000\n      console.log(\`重试 \${i + 1}/\${maxRetries}，等待 \${delay}ms\`)\n      await new Promise(r => setTimeout(r, delay))\n    }\n  }\n}\n\n// Agent 错误自纠正\nasync function agentWithErrorHandling(query, tools, llm) {\n  const messages = [{ role: 'user', content: query }]\n  const maxSteps = 5\n\n  for (let step = 0; step < maxSteps; step++) {\n    try {\n      const response = await callWithRetry(() => llm(messages))\n\n      if (response.tool_calls) {\n        messages.push({ role: 'assistant', content: response.content, tool_calls: response.tool_calls })\n        for (const call of response.tool_calls) {\n          try {\n            const result = await tools[call.name](JSON.parse(call.arguments))\n            messages.push({ role: 'tool', tool_call_id: call.id, content: JSON.stringify(result) })\n          } catch (toolError) {\n            // 工具失败 → 反馈给 LLM 让它调整\n            messages.push({\n              role: 'tool',\n              tool_call_id: call.id,\n              content: JSON.stringify({ error: toolError.message, suggestion: '请检查参数后重试' })\n            })\n          }\n        }\n      } else {\n        return response.content\n      }\n    } catch (e) {\n      return '抱歉，服务暂时不可用: ' + e.message\n    }\n  }\n  return '任务超时'\n}\n\nconsole.log('错误处理: 重试 + 自纠正 + 降级')`,
    practice: {
      title: '练习：重试机制',
      description: '实现 <code>retry</code> 函数：失败时重试，最多 3 次，每次间隔翻倍。',
      hint: 'for 循环 + try/catch + setTimeout + 指数退避',
      solution: `async function retry(fn, max = 3) {\n  for (let i = 0; i < max; i++) {\n    try {\n      return await fn()\n    } catch (e) {\n      console.log(\`第\${i+1}次失败: \${e.message}\`)\n      if (i === max - 1) throw e\n      // 指数退避（这里简化为同步）\n    }\n  }\n}\n\nlet attempts = 0\nfunction unreliableApi() {\n  attempts++\n  if (attempts < 3) throw new Error('超时')\n  return '成功!'\n}\n\nretry(unstableApi).then(r => console.log(r))\nconsole.log('尝试次数:', attempts)`
    }
  },

  'agent-chatbot': {
    title: '项目：智能客服 Agent',
    api: '实战：智能客服',
    difficulty: 'medium',
    description: `<p>综合运用 Agent 概念构建一个完整的智能客服系统。</p>
<p><strong>功能需求：</strong></p>
<p>• 多轮对话 + 上下文理解<br/>
• 工具调用：查订单、查物流、转人工<br/>
• RAG：基于产品文档回答常见问题<br/>
• 记忆：记住用户历史问题和偏好<br/>
• 错误处理：工具失败时自动转人工</p>
<p><strong>架构设计：</strong></p>
<p>• System Prompt 定义客服角色和行为规范<br/>
• ToolExecutor 注册客服相关工具<br/>
• ChatHistory 管理多轮对话<br/>
• Agent Loop 驱动整个流程</p>`,
    code: `// 智能客服 Agent 完整实现\nclass CustomerServiceAgent {\n  constructor() {\n    this.history = []\n    this.tools = {\n      checkOrder: ({ orderId }) => ({\n        orderId,\n        status: '已发货',\n        tracking: 'SF1234567890',\n        estimatedDelivery: '2024-01-20'\n      }),\n      checkLogistics: ({ tracking }) => ({\n        tracking,\n        status: '运输中',\n        currentLocation: '北京转运中心',\n        eta: '明天下午'\n      }),\n      queryProduct: ({ name }) => {\n        const db = {\n          'Vue教程': { price: 99, stock: 10, rating: 4.8 },\n          'React教程': { price: 89, stock: 0, rating: 4.6 }\n        }\n        return db[name] || { error: '商品不存在' }\n      },\n      transferHuman: () => ({\n        status: '已转接',\n        queuePosition: 3,\n        estimatedWait: '2分钟'\n      })\n    }\n  }\n\n  async chat(userMessage) {\n    this.history.push({ role: 'user', content: userMessage })\n\n    let response\nn    if (userMessage.includes('订单') || userMessage.includes('物流')) {\n      const order = this.tools.checkOrder({ orderId: '12345' })\n      const logistics = this.tools.checkLogistics({ tracking: order.tracking })\n      response = \`订单 \${order.orderId} 状态: \${order.status}\\n快递: \${logistics.tracking}\\n当前位置: \${logistics.currentLocation}\\n预计送达: \${logistics.eta}\`\n    } else if (userMessage.includes('商品') || userMessage.includes('价格')) {\n      const product = this.tools.queryProduct({ name: 'Vue教程' })\n      response = product.error\n        ? product.error\n        : \`价格: ¥\${product.price}\\n库存: \${product.stock}件\\n评分: \${product.rating}分\`\n    } else if (userMessage.includes('人工') || userMessage.includes('投诉')) {\n      const transfer = this.tools.transferHuman()\n      response = \`已为您转接人工客服，排队位置: \${transfer.queuePosition}，预计等待: \${transfer.estimatedWait}\`\n    } else {\n      response = '您好！我是智能客服助手，可以帮您：\\n• 查询订单和物流\\n• 查询商品信息\\n• 转接人工客服\\n请问有什么可以帮您？'\n    }\n\n    this.history.push({ role: 'assistant', content: response })\n    return response\n  }\n}\n\nconst agent = new CustomerServiceAgent()\nagent.chat('你好').then(r => console.log(r))\nconsole.log('---')\nagent.chat('查一下我的订单').then(r => console.log(r))`,
    practice: {
      title: '练习：扩展客服',
      description: '为客服 Agent 添加 <code>submitComplaint</code> 工具，能记录投诉内容并返回工单号。',
      hint: '在 tools 对象中添加方法',
      solution: `class Agent {\n  constructor() {\n    this.ticketId = 1000\n    this.tools = {\n      submitComplaint: ({ content, userId }) => {\n        this.ticketId++\n        return {\n          ticketId: 'TK' + this.ticketId,\n          status: '已受理',\n          content,\n          userId,\n          createdAt: new Date().toISOString()\n        }\n      }\n    }\n  }\n  chat(msg) {\n    if (msg.includes('投诉')) {\n      return JSON.stringify(this.tools.submitComplaint({\n        content: msg, userId: 'u001'\n      }))\n    }\n    return '请问有什么问题?'\n  }\n}\nconst a = new Agent()\nconsole.log(a.chat('我要投诉，商品质量有问题'))`
    }
  },

  'agent-automation': {
    title: '项目：自动化 Agent',
    api: '实战：任务自动化',
    difficulty: 'hard',
    description: `<p>构建能够自主完成复杂任务的自动化 Agent。</p>
<p><strong>典型自动化场景：</strong></p>
<p>• 代码质量检查 Agent — 自动扫描代码，发现问题并生成报告<br/>
• 数据处理 Agent — 自动清洗数据、生成分析图表<br/>
• 文档生成 Agent — 根据代码自动生成 API 文档<br/>
• 测试生成 Agent — 根据函数签名自动生成测试用例</p>
<p><strong>设计要点：</strong></p>
<p>• 规则引擎 + LLM 推理结合<br/>
• 可配置的检查规则<br/>
• 结果格式化输出<br/>
• 支持批量处理</p>`,
    code: `// 代码质量检查 Agent\nclass CodeReviewAgent {\n  constructor() {\n    this.rules = [\n      {\n        name: 'no-console',\n        severity: 'warning',\n        check: code => !code.includes('console.log'),\n        message: '生产代码应移除 console.log'\n      },\n      {\n        name: 'no-var',\n        severity: 'error',\n        check: code => !/\\bvar\\b/.test(code),\n        message: '使用 let/const 代替 var'\n      },\n      {\n        name: 'no-eval',\n        severity: 'error',\n        check: code => !code.includes('eval('),\n        message: 'eval() 存在安全风险'\n      },\n      {\n        name: 'arrow-fn',\n        severity: 'info',\n        check: code => !/function\\s*\\(/.test(code),\n        message: '考虑使用箭头函数提升可读性'\n      }\n    ]\n  }\n\n  review(code) {\n    const issues = this.rules\n      .filter(rule => !rule.check(code))\n      .map(rule => ({\n        rule: rule.name,\n        severity: rule.severity,\n        message: rule.message\n      }))\n\n    const errors = issues.filter(i => i.severity === 'error').length\n    const warnings = issues.filter(i => i.severity === 'warning').length\n\n    return {\n      passed: errors === 0,\n      score: Math.max(0, 100 - errors * 20 - warnings * 10),\n      issues,\n      summary: issues.length === 0\n        ? '代码质量良好 ✓'\n        : \`发现 \${errors} 个错误, \${warnings} 个警告\`\n    }\n  }\n\n  // 生成报告\n  report(code) {\n    const result = this.review(code)\n    let text = \`代码审查报告\\n分数: \${result.score}/100\\n状态: \${result.summary}\\n\`\n    if (result.issues.length) {\n      text += '\\n问题列表:\\n'\n      result.issues.forEach(i => {\n        text += \`  [\${i.severity}] \${i.message}\\n\`\n      })\n    }\n    return text\n  }\n}\n\nconst agent = new CodeReviewAgent()\nconst badCode = 'var x = 1; console.log(x); eval(userInput)'\nconst goodCode = 'const x = 1; const y = () => x + 1'\n\nconsole.log(agent.report(badCode))\nconsole.log('---')\nconsole.log(agent.report(goodCode))`,
    practice: {
      title: '练习：安全扫描',
      description: '创建 SecurityAgent，检测代码中的安全问题：eval、innerHTML、密码硬编码。输出扫描报告。',
      hint: 'rules 数组 + filter + map 生成报告',
      solution: `class SecurityAgent {\n  constructor() {\n    this.rules = [\n      { id: 'S001', test: c => !c.includes('eval('), msg: '避免 eval() — 可执行任意代码' },\n      { id: 'S002', test: c => !c.includes('innerHTML'), msg: '使用 textContent 防 XSS' },\n      { id: 'S003', test: c => !/password\\s*=\\s*['"]/.test(c), msg: '不要硬编码密码' },\n      { id: 'S004', test: c => !c.includes('localStorage.setItem('), msg: '敏感数据不应存 localStorage' }\n    ]\n  }\n  scan(code) {\n    const issues = this.rules\n      .filter(r => !r.test(code))\n      .map(r => r.id + ': ' + r.msg)\n    return {\n      safe: issues.length === 0,\n      issues,\n      report: issues.length ? issues.join('\\n') : '安全扫描通过 ✓'\n    }\n  }\n}\nconst agent = new SecurityAgent()\nconsole.log(agent.scan('eval(input)').report)\nconsole.log('---')\nconsole.log(agent.scan('const x = 1').report)`
    }
  }
}
