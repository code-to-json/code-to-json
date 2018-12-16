module.exports = {
  parser: 'typescript-eslint-parser',
  plugins: ['typescript'],
  extends: ['eslint:recommended', 'airbnb-base', 'prettier'],
  parserOptions: {
    ecmaVersion: 9,
    sourceType: 'module',
  },
  env: {
    es6: true,
    browser: false,
    node: true,
  },
  rules: {
    camelcase: 'off',
    'no-unused-vars': 'off',
    'import/no-unresolved': 'off',
    'import/export': 'off',
    'import/first': 'off',
    'import/no-extraneous-dependencies': 'off',
    'no-underscore-dangle': 'off',
  },
  overrides: [
    {
      files: ['test/**/*.test.ts'],
      rules: {
        'class-methods-use-this': 'off',
      },
    },
  ],
};
