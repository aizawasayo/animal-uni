import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
// https://vitejs.dev/config/
export default defineConfig({
  // base: 'https://static-xxxx.bspapp.com/', // uniCloud 前端网页托管资源地址（主要是应用编译后的js，图片等静态资源，可以配置为二级目录）
  plugins: [
    uni(),
  ],
  server: {
    port: 3344,
    proxy: {
      '/api': {
        target: 'http://106.54.168.208:3003', // 腾讯云 animal_server
        // target: 'http://localhost:3003', // animal_server
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
})
