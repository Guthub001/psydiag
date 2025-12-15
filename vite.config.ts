import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Safe process access
  const cwd = typeof process !== 'undefined' && (process as any).cwd ? (process as any).cwd() : '.';
  const env = loadEnv(mode, cwd, '');
  
  return {
    plugins: [react()],
    server: {
      host: true 
    },
    define: {
      // If env.API_KEY is undefined, use an empty string instead of crashing or 'undefined' string
      'process.env.API_KEY': JSON.stringify(env.API_KEY || '')
    }
  }
})