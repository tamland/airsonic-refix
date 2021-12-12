module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/recommended',
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
    'vue/no-unused-components': 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/html-closing-bracket-newline': 'off',
    'vue/valid-v-slot': 'off', // Bug: https://github.com/vuejs/eslint-plugin-vue/issues/1229
    'vue/component-tags-order': 'error',
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
