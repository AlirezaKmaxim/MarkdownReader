import { resolve } from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      $lib: resolve('src/renderer/src/lib')
    }
  },
  test: {
    environment: 'happy-dom',
    include: ['src/**/*.test.ts']
  }
})
