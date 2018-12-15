exports.plugins = [
  'remark-preset-lint-recommended',
  'remark-preset-lint-markdown-style-guide',
  [
    'remark-lint-no-dead-urls',
    [
      'error',
      {
        skipOffline: true
      }
    ]
  ],
  ['remark-validate-links', { repository: 'code-to-json/code-to-json' }],
  ['remark-lint-list-item-indent', false],
  ['remark-lint-no-consecutive-blank-lines', false],
  ['remark-lint-no-multiple-toplevel-headings', false],
  ['remark-lint-maximum-line-length', false],
  ['remark-lint-unordered-list-marker-style', false],
  ['remark-lint-no-duplicate-headings', false],
  ['remark-lint-heading-increment', false]
];
