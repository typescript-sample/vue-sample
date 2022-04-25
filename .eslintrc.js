module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-irregular-whitespace':'off',
    'no-empty':'off',
    'no-useless-escape':'off',
    'no-constant-condition':'off',
    '@typescript-eslint/no-this-alias':'off',
    '@typescript-eslint/no-empty-function':'off',
    '@typescript-eslint/no-empty-interface':'off'
  }
}
