import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          includeDependenciesRecursively: false,
          groups: [
            { name: 'three-core', test: /three[\\/]build[\\/]three\.core\.js/ },
            { name: 'three-renderer', test: /three[\\/]build[\\/]three\.module\.js/ },
          ],
        },
      },
    },
  },
})
