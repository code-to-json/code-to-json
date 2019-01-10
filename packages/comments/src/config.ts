import { Standardization, TSDocConfiguration, TSDocTagSyntaxKind } from '@microsoft/tsdoc';

const config = new TSDocConfiguration();

config.addTagDefinition({
  tagName: '@author',
  tagNameWithUpperCase: '@AUTHOR',
  syntaxKind: TSDocTagSyntaxKind.BlockTag,
  standardization: Standardization.Extended,
  allowMultiple: false,
});

export default config;
