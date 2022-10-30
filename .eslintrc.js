module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    '@vue/standard',
    '@vue/typescript',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'vue/script-indent': ['error', 2, { baseIndent: 1 }],
    'vue/no-unused-components': 'warn',
    'vue/component-tags-order': 'error',
    'vue/valid-v-slot': 'off', // Bug: https://github.com/vuejs/eslint-plugin-vue/issues/1229
    'vue/max-attributes-per-line': 'off',
    'vue/html-closing-bracket-newline': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/first-attribute-linebreak': 'off',
    'no-console': 'off',
    'no-debugger': 'warn',
    'no-empty-pattern': 'off',
    'comma-dangle': 'off',
    'space-before-function-paren': ['error', 'never'],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
  overrides: [
    {
      files: ['*.vue'],
      rules: {
        indent: 'off'
      }
    }
  ]
}
