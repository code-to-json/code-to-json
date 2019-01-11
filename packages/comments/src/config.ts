import { Standardization, TSDocConfiguration, TSDocTagSyntaxKind } from '@microsoft/tsdoc';

const config = new TSDocConfiguration();

config.addTagDefinitions([
  {
    tagName: '@author',
    tagNameWithUpperCase: '@AUTHOR',
    syntaxKind: TSDocTagSyntaxKind.BlockTag,
    standardization: Standardization.Extended,
    allowMultiple: false,
  },
  {
    tagName: '@file',
    tagNameWithUpperCase: '@FILE',
    syntaxKind: TSDocTagSyntaxKind.BlockTag,
    standardization: Standardization.Extended,
    allowMultiple: true,
  },
  {
    tagName: '@see',
    tagNameWithUpperCase: '@SEE',
    syntaxKind: TSDocTagSyntaxKind.BlockTag,
    standardization: Standardization.Extended,
    allowMultiple: true,
  },
  {
    tagName: '@since',
    tagNameWithUpperCase: '@SINCE',
    syntaxKind: TSDocTagSyntaxKind.BlockTag,
    standardization: Standardization.Extended,
    allowMultiple: true,
  },
]);
export default config;
