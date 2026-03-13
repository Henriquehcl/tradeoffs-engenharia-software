import pluginVue from 'eslint-plugin-vue'

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,vue}'],
  },
  ...pluginVue.configs['flat/essential'],
]
