module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', 'airbnb-base'],
  parserOptions: {
    ecmaVersion: 9,
    sourceType: 'module',
    project: 'tsconfig.json',
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
    'lines-between-class-members': 'off',
    'no-dupe-class-members': 'off',
    'max-classes-per-file': ['error', 1],
    'implicit-arrow-linebreak': 'off',
    'function-paren-newline': 'off',
    'arrow-parens': 'off',
    indent: 'off',
    complexity: 'off',
    'no-empty-function': 'off',
  },
  overrides: [
    {
      files: ['**/test/**/*.ts'],

      env: {
        node: true,
      },
      rules: {
        'class-methods-use-this': 'off',
        'max-classes-per-file': 'off',
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
