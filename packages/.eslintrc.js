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
    'shared-node-browser': true,
    node: false,
  },
  rules: {
    camelcase: 'off',
    'no-unused-vars': 'off',
    'import/no-unresolved': 'off',
    'import/export': 'off',
    'import/first': 'off',
    'import/no-extraneous-dependencies': 'off',
    'no-underscore-dangle': 'off',
    'no-plusplus': 'off',
    'no-useless-constructor': 'off',
    'import/prefer-default-export': 'off',
    'no-use-before-define': 'off',
    'no-bitwise': 'off',
    'no-restricted-syntax': 'off',
    'no-console': 'off',
    complexity: 'off',
  },
  overrides: [
    {
      files: ['**/test/**/*.ts'],
      env: {
        node: true,
      },
      rules: {
        'class-methods-use-this': 'off',
      },
    },
    {
      files: ['**/__snapshots__/**/*'],
      env: {
        node: true,
      },
    },
  ],
};
