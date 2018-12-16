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
    node: false,
  },
  rules: {
    camelcase: 'off',
    'no-unused-vars': 'off',
    'import/no-unresolved': 'off',
    'import/export': 'off',
    'import/first': 'off',
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': 'off',
    'no-underscore-dangle': 'off',
    'no-plusplus': 'off',
    'no-restricted-syntax': 'off',
  },
  overrides: [
    {
      files: ['test/**/*.test.ts'],
      env: {
        node: true,
      },
      rules: {
        'class-methods-use-this': 'off',
      },
    },
  ],
};
