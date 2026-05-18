export const viteCategories = [
  { id: 'proxy', name: '跨域代理', topics: ['vite-proxy-basic', 'vite-proxy-multi', 'vite-proxy-websocket'] },
  { id: 'alias', name: '路径别名', topics: ['vite-alias-basic', 'vite-alias-ts'] },
  { id: 'env', name: '环境变量', topics: ['vite-env-basic', 'vite-env-mode'] },
  { id: 'plugin', name: '插件配置', topics: ['vite-plugin-vue', 'vite-plugin-common'] },
  { id: 'build', name: '构建配置', topics: ['vite-build-basic', 'vite-build-lib'] },
  { id: 'dev', name: '开发配置', topics: ['vite-dev-server', 'vite-css'] }
]

export const viteTopics = {
  'vite-proxy-basic': {
    title: '基础跨域代理',
    api: 'server.proxy',
    difficulty: 'easy',
    description: `开发环境下通过 <code>server.proxy</code> 配置 API 代理解决跨域问题。请求 <code>/api</code> 前缀会被代理到目标服务器。<br><br><strong>原理：</strong>浏览器 → Vite dev server → 目标服务器（同源不跨域）。`,
    code: `// vite.config.js\nimport { defineConfig } from 'vite'\n\nexport default defineConfig({\n  server: {\n    proxy: {\n      '/api': {\n        target: 'http://localhost:8080',\n        changeOrigin: true,  // 修改请求头的 Origin\n        // rewrite: (path) => path.replace(/^\\/api/, '')\n      }\n    }\n  }\n})\n\n// 前端请求: fetch('/api/users')\n// 实际请求: http://localhost:8080/api/users`,
    practice: {
      title: '练习：配置代理',
      description: '配置 <code>/api</code> 代理到 <code>http://localhost:3001</code>，<code>/auth</code> 代理到 <code>http://localhost:3002</code>，都开启 <code>changeOrigin</code>。',
      hint: 'proxy 对象可以配置多个路径',
      solution: `// vite.config.js\nexport default {\n  server: {\n    proxy: {\n      '/api': {\n        target: 'http://localhost:3001',\n        changeOrigin: true\n      },\n      '/auth': {\n        target: 'http://localhost:3002',\n        changeOrigin: true\n      }\n    }\n  }\n}\nconsole.log('代理配置完成: /api → 3001, /auth → 3002')`
    }
  },
  'vite-proxy-multi': {
    title: '多路径代理与重写',
    api: 'proxy.rewrite',
    difficulty: 'medium',
    description: `使用 <code>rewrite</code> 函数重写请求路径，实现更灵活的代理。<br><br><strong>场景：</strong><br>• 去掉 <code>/api</code> 前缀<br>• 添加版本号 <code>/v1</code><br>• 路径重映射`,
    code: `// vite.config.js\nexport default {\n  server: {\n    proxy: {\n      // 去掉 /api 前缀\n      '/api': {\n        target: 'http://backend:8080',\n        changeOrigin: true,\n        rewrite: (path) => path.replace(/^\\/api/, '')\n      },\n      // 添加版本号\n      '/v2/api': {\n        target: 'http://api.example.com/v2',\n        changeOrigin: true,\n        rewrite: (path) => path.replace(/^\\/v2\\/api/, '')\n      }\n    }\n  }\n}\n\n// /api/users     → backend:8080/users\n// /v2/api/items  → api.example.com/v2/items`,
    practice: {
      title: '练习：路径重写',
      description: '配置 <code>/backend</code> 代理到 <code>http://server:9000</code>，重写路径去掉 <code>/backend</code> 前缀。',
      hint: 'rewrite: (path) => path.replace(/^\\/backend/, "")',
      solution: `export default {\n  server: {\n    proxy: {\n      '/backend': {\n        target: 'http://server:9000',\n        changeOrigin: true,\n        rewrite: (path) => path.replace(/^\\/backend/, '')\n      }\n    }\n  }\n}\n// /backend/api/users → server:9000/api/users\nconsole.log('路径重写配置完成')`
    }
  },
  'vite-proxy-websocket': {
    title: 'WebSocket 代理',
    api: 'proxy.ws',
    difficulty: 'medium',
    description: `<code>server.proxy</code> 默认支持 WebSocket 代理。可通过 <code>ws: true</code> 显式启用，<code>ws: false</code> 禁用。`,
    code: `// vite.config.js\nexport default {\n  server: {\n    proxy: {\n      '/ws': {\n        target: 'ws://localhost:8080',\n        ws: true,          // 启用 WebSocket 代理\n        changeOrigin: true\n      },\n      '/socket.io': {\n        target: 'http://localhost:3001',\n        ws: true\n      }\n    }\n  }\n}\n\n// 前端: new WebSocket('ws://localhost:5173/ws')\n// 实际: ws://localhost:8080/ws`,
    practice: {
      title: '练习：WS 代理',
      description: '配置 WebSocket 代理 <code>/ws</code> 到 <code>ws://localhost:9090</code>。',
      hint: 'target 用 ws:// 协议，ws: true',
      solution: `export default {\n  server: {\n    proxy: {\n      '/ws': {\n        target: 'ws://localhost:9090',\n        ws: true,\n        changeOrigin: true\n      }\n    }\n  }\n}\nconsole.log('WebSocket 代理: /ws → ws://localhost:9090')`
    }
  },
  'vite-alias-basic': {
    title: '路径别名',
    api: 'resolve.alias',
    difficulty: 'easy',
    description: `通过 <code>resolve.alias</code> 配置路径别名，用 <code>@</code> 代替 <code>src</code> 目录等常用路径。<br><br><strong>注意：</strong>需要配合 <code>path</code> 模块使用 <code>resolve()</code>。`,
    code: `// vite.config.js\nimport { defineConfig } from 'vite'\nimport { resolve } from 'path'\n\nexport default defineConfig({\n  resolve: {\n    alias: {\n      '@': resolve(__dirname, 'src'),\n      '@components': resolve(__dirname, 'src/components'),\n      '@utils': resolve(__dirname, 'src/utils'),\n      '@assets': resolve(__dirname, 'src/assets')\n    }\n  }\n})\n\n// 使用:\n// import App from '@/App.vue'\n// import { helper } from '@utils/helper'\n// import Logo from '@assets/logo.png'`,
    practice: {
      title: '练习：配置别名',
      description: '配置 <code>@</code> 指向 <code>src</code>，<code>@views</code> 指向 <code>src/views</code>。写出完整的 vite.config.js。',
      hint: 'import { resolve } from "path"',
      solution: `import { resolve } from 'path'\n\nexport default {\n  resolve: {\n    alias: {\n      '@': resolve(__dirname, 'src'),\n      '@views': resolve(__dirname, 'src/views')\n    }\n  }\n}\nconsole.log('@ → src/')\nconsole.log('@views → src/views/')`
    }
  },
  'vite-alias-ts': {
    title: 'TypeScript 路径配置',
    api: 'tsconfig paths',
    difficulty: 'medium',
    description: `<code>tsconfig.json</code> 中也需要配置 <code>paths</code> 与 Vite 的 <code>alias</code> 对应，否则 TS 编辑器无法识别。<br><br><strong>两者缺一不可：</strong>Vite alias 解决运行时，tsconfig paths 解决编辑器。`,
    code: `// tsconfig.json\n{\n  "compilerOptions": {\n    "baseUrl": ".",\n    "paths": {\n      "@/*": ["src/*"],\n      "@components/*": ["src/components/*"],\n      "@utils/*": ["src/utils/*"]\n    }\n  }\n}\n\n// vite.config.js 中配置相同的 alias\n// 两者保持一致`,
    practice: {
      title: '练习：TS 路径',
      description: '写出 <code>tsconfig.json</code> 中 <code>@</code> 和 <code>@stores</code> 的 paths 配置。',
      hint: '"@/*": ["src/*"]',
      solution: `// tsconfig.json\nconst config = {\n  compilerOptions: {\n    baseUrl: ".",\n    paths: {\n      "@/*": ["src/*"],\n      "@stores/*": ["src/stores/*"]\n    }\n  }\n}\nconsole.log(JSON.stringify(config, null, 2))`
    }
  },
  'vite-env-basic': {
    title: '环境变量',
    api: 'import.meta.env',
    difficulty: 'easy',
    description: `Vite 使用 <code>.env</code> 文件加载环境变量。只有 <code>VITE_</code> 前缀的变量会暴露给客户端。<br><br><strong>文件优先级：</strong><code>.env</code> &lt; <code>.env.local</code> &lt; <code>.env.[mode]</code> &lt; <code>.env.[mode].local</code>`,
    code: `// .env\nVITE_API_URL=https://api.example.com\nVITE_APP_TITLE=我的应用\nSECRET_KEY=xxx  // 不会暴露给客户端\n\n// .env.production\nVITE_API_URL=https://prod.api.com\n\n// 代码中使用:\nconsole.log(import.meta.env.VITE_API_URL)\nconsole.log(import.meta.env.VITE_APP_TITLE)\nconsole.log(import.meta.env.MODE)\nconsole.log(import.meta.env.DEV)\nconsole.log(import.meta.env.PROD)`,
    practice: {
      title: '练习：环境变量',
      description: '写出 <code>.env.development</code> 和 <code>.env.production</code> 的内容，包含 API 地址和调试开关。',
      hint: 'VITE_ 前缀才能在客户端访问',
      solution: `// .env.development\nconst dev = {\n  VITE_API_URL: 'http://localhost:3001',\n  VITE_DEBUG: 'true'\n}\n\n// .env.production\nconst prod = {\n  VITE_API_URL: 'https://api.myapp.com',\n  VITE_DEBUG: 'false'\n}\n\nconsole.log('开发:', dev)\nconsole.log('生产:', prod)`
    }
  },
  'vite-env-mode': {
    title: '多环境模式',
    api: 'mode 配置',
    difficulty: 'medium',
    description: `Vite 支持通过 <code>--mode</code> 指定运行模式，加载对应的 <code>.env.[mode]</code> 文件。<br><br><strong>内置模式：</strong><br>• <code>development</code> — <code>vite</code> 默认<br>• <code>production</code> — <code>vite build</code> 默认`,
    code: `// package.json\n// "scripts": {\n//   "dev": "vite",\n//   "staging": "vite --mode staging",\n//   "build": "vite build",\n//   "build:staging": "vite build --mode staging"\n// }\n\n// .env.staging\n// VITE_API_URL=https://staging.api.com\n// VITE_ENV=staging\n\nconsole.log('模式:', import.meta.env.MODE)\n// development / production / staging`,
    practice: {
      title: '练习：多模式配置',
      description: '配置三个环境：development、staging、production，每个环境有不同的 API 地址。',
      hint: '创建 .env、.env.staging、.env.production',
      solution: `const envs = {\n  development: { VITE_API: 'http://localhost:3000' },\n  staging: { VITE_API: 'https://staging.api.com' },\n  production: { VITE_API: 'https://api.com' }\n}\nObject.entries(envs).forEach(([mode, config]) => {\n  console.log(mode + ':', config.VITE_API)\n})`
    }
  },
  'vite-plugin-vue': {
    title: 'Vue 插件',
    api: '@vitejs/plugin-vue',
    difficulty: 'easy',
    description: `<code>@vitejs/plugin-vue</code> 是 Vue 3 SFC 的官方编译插件，Vite 项目必备。<br><br><strong>可选配置：</strong><br>• <code>reactivityTransform</code> — 启用 <code>$ref</code> 语法糖<br>• <code>script.lang</code> — 默认脚本语言`,
    code: `// vite.config.js\nimport { defineConfig } from 'vite'\nimport vue from '@vitejs/plugin-vue'\n\nexport default defineConfig({\n  plugins: [\n    vue({\n      // 可选配置:\n      script: {\n        defineModel: true,     // 启用 defineModel\n        propsDestructure: true // 启用 props 解构\n      }\n    })\n  ]\n})`,
    practice: {
      title: '练习：Vue 插件',
      description: '写出一个包含 Vue 插件和 ReactivityTransform 的完整 vite.config.js。',
      hint: 'vue({ reactivityTransform: true })',
      solution: `import { defineConfig } from 'vite'\nimport vue from '@vitejs/plugin-vue'\n\nexport default defineConfig({\n  plugins: [\n    vue({\n      script: {\n        defineModel: true,\n        propsDestructure: true\n      }\n    })\n  ]\n})\nconsole.log('Vue 插件配置完成')`
    }
  },
  'vite-plugin-common': {
    title: '常用插件',
    api: 'plugins 数组',
    difficulty: 'medium',
    description: `常用的 Vite 插件及安装方式：<br><br>• <code>@vitejs/plugin-vue</code> — Vue SFC 支持<br>• <code>@vitejs/plugin-vue-jsx</code> — JSX 支持<br>• <code>vite-plugin-svg-icons</code> — SVG 图标<br>• <code>unplugin-auto-import</code> — 自动导入<br>• <code>unplugin-vue-components</code> — 组件自动注册<br>• <code>vite-plugin-pwa</code> — PWA 支持`,
    code: `// vite.config.js\nimport { defineConfig } from 'vite'\nimport vue from '@vitejs/plugin-vue'\nimport vueJsx from '@vitejs/plugin-vue-jsx'\n// import Components from 'unplugin-vue-components/vite'\n// import AutoImport from 'unplugin-auto-import/vite'\n// import { VitePWA } from 'vite-plugin-pwa'\n\nexport default defineConfig({\n  plugins: [\n    vue(),\n    vueJsx(),\n    // Components({ dts: true }),\n    // AutoImport({ imports: ['vue', 'vue-router'] }),\n    // VitePWA({ registerType: 'autoUpdate' })\n  ]\n})`,
    practice: {
      title: '练习：插件组合',
      description: '写出一个同时使用 Vue、JSX 和自动导入插件的配置。',
      hint: 'plugins 数组中按顺序配置',
      solution: `import vue from '@vitejs/plugin-vue'\nimport vueJsx from '@vitejs/plugin-vue-jsx'\n\nexport default {\n  plugins: [\n    vue(),\n    vueJsx()\n    // AutoImport({ imports: ['vue'] }),\n    // Components({})\n  ]\n}\nconsole.log('插件: vue + vueJsx + auto-import')`
    }
  },
  'vite-build-basic': {
    title: '构建配置',
    api: 'build 选项',
    difficulty: 'medium',
    description: `<code>build</code> 配置控制生产构建行为。<br><br><strong>常用选项：</strong><br>• <code>outDir</code> — 输出目录（默认 dist）<br>• <code>assetsDir</code> — 静态资源目录<br>• <code>sourcemap</code> — 是否生成 source map<br>• <code>minify</code> — 压缩方式（terser/esbuild）<br>• <code>chunkSizeWarningLimit</code> — 大小警告阈值`,
    code: `// vite.config.js\nexport default {\n  build: {\n    outDir: 'dist',\n    assetsDir: 'assets',\n    sourcemap: false,        // 生产环境关闭\n    minify: 'terser',        // 或 'esbuild'\n    terserOptions: {\n      compress: {\n        drop_console: true,  // 移除 console\n        drop_debugger: true  // 移除 debugger\n      }\n    },\n    chunkSizeWarningLimit: 500, // KB\n    rollupOptions: {\n      output: {\n        manualChunks: {\n          vue: ['vue', 'vue-router', 'pinia'],\n          antd: ['ant-design-vue']\n        }\n      }\n    }\n  }\n}`,
    practice: {
      title: '练习：优化构建',
      description: '配置构建：输出到 <code>build</code> 目录，移除 console，将 vue 和第三方库分开打包。',
      hint: 'build.outDir + manualChunks',
      solution: `export default {\n  build: {\n    outDir: 'build',\n    minify: 'terser',\n    terserOptions: {\n      compress: { drop_console: true }\n    },\n    rollupOptions: {\n      output: {\n        manualChunks: {\n          vendor: ['vue', 'vue-router']\n        }\n      }\n    }\n  }\n}\nconsole.log('构建优化配置完成')`
    }
  },
  'vite-build-lib': {
    title: '库模式构建',
    api: 'build.lib',
    difficulty: 'hard',
    description: `使用 <code>build.lib</code> 将项目构建为 npm 库。支持 ESM、CJS、UMD 格式输出。<br><br><strong>配置项：</strong><br>• <code>entry</code> — 入口文件<br>• <code>name</code> — UMD 全局变量名<br>• <code>formats</code> — 输出格式`,
    code: `// vite.config.js (lib 模式)\nimport { resolve } from 'path'\n\nexport default {\n  build: {\n    lib: {\n      entry: resolve(__dirname, 'src/index.js'),\n      name: 'MyLib',\n      fileName: (format) => \`my-lib.\${format}.js\`,\n      formats: ['es', 'umd', 'cjs']\n    },\n    rollupOptions: {\n      external: ['vue'],\n      output: {\n        globals: { vue: 'Vue' }\n      }\n    }\n  }\n}`,
    practice: {
      title: '练习：发布库',
      description: '配置一个 Vue 组件库的构建，入口为 <code>src/index.ts</code>，输出 ESM 和 CJS 格式。',
      hint: 'build.lib.entry + external: ["vue"]',
      solution: `import { resolve } from 'path'\n\nexport default {\n  build: {\n    lib: {\n      entry: resolve(__dirname, 'src/index.ts'),\n      name: 'MyVueLib',\n      fileName: 'my-vue-lib',\n      formats: ['es', 'cjs']\n    },\n    rollupOptions: {\n      external: ['vue'],\n      output: { globals: { vue: 'Vue' } }\n    }\n  }\n}\nconsole.log('库模式: ESM + CJS 输出')`
    }
  },
  'vite-dev-server': {
    title: '开发服务器',
    api: 'server 配置',
    difficulty: 'easy',
    description: `<code>server</code> 配置开发服务器行为。<br><br><strong>常用选项：</strong><br>• <code>port</code> — 端口号<br>• <code>host</code> — 监听地址<br>• <code>open</code> — 自动打开浏览器<br>• <code>https</code> — 启用 HTTPS<br>• <code>cors</code> — 跨域配置`,
    code: `// vite.config.js\nexport default {\n  server: {\n    port: 3000,\n    host: true,        // 监听所有地址\n    open: true,        // 自动打开浏览器\n    cors: true,        // 启用 CORS\n    strictPort: true,  // 端口被占用则报错\n    // https: true,    // 自签名证书\n    // hmr: {          // 热更新配置\n    //   overlay: false\n    // }\n  }\n}\n// npx vite --port 8080 --host\n// npx vite --https`,
    practice: {
      title: '练习：服务器配置',
      description: '配置开发服务器：端口 <code>5173</code>，监听所有地址，自动打开浏览器。',
      hint: 'server.port + host + open',
      solution: `export default {\n  server: {\n    port: 5173,\n    host: true,\n    open: true,\n    cors: true\n  }\n}\nconsole.log('Dev server: http://localhost:5173')`
    }
  },
  'vite-css': {
    title: 'CSS 配置',
    api: 'css 配置',
    difficulty: 'medium',
    description: `<code>css</code> 配置 CSS 预处理器和模块化。<br><br><strong>常用选项：</strong><br>• <code>preprocessorOptions</code> — 预处理器配置（SCSS/Less）<br>• <code>modules</code> — CSS Modules 配置<br>• <code>postcss</code> — PostCSS 配置（或单独的 postcss.config.js）`,
    code: `// vite.config.js\nexport default {\n  css: {\n    // SCSS 全局变量注入\n    preprocessorOptions: {\n      scss: {\n        additionalData: \`\n          @use "@/styles/variables" as *;\n          @use "@/styles/mixins" as *;\n        \`\n      }\n    },\n    // CSS Modules 配置\n    modules: {\n      localsConvention: 'camelCase',\n      generateScopedName: '[name]_[local]_[hash:5]'\n    }\n  }\n}\n\n// CSS Modules 使用:\n// import styles from './App.module.css'\n// <div :class="styles.container">`,
    practice: {
      title: '练习：预处理器',
      description: '配置 SCSS 预处理器，全局注入变量文件 <code>src/styles/variables.scss</code>。',
      hint: 'preprocessorOptions.scss.additionalData',
      solution: `export default {\n  css: {\n    preprocessorOptions: {\n      scss: {\n        additionalData: '@use "@/styles/variables" as *;'\n      }\n    },\n    modules: {\n      localsConvention: 'camelCaseOnly'\n    }\n  }\n}\nconsole.log('SCSS 全局变量注入配置完成')`
    }
  }
}
