exports.plugins = [
  'remark-preset-lint-recommended',
  'remark-preset-lint-markdown-style-guide',
  ['remark-lint-no-dead-urls', [2]],
  ['remark-validate-links', { repository: 'code-to-json/code-to-json' }],
  ['remark-lint-list-item-indent', false]
];
