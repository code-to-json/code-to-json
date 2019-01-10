import { Standardization, TSDocConfiguration, TSDocTagSyntaxKind } from '@microsoft/tsdoc';

const config = new TSDocConfiguration();

config.addTagDefinition({
  tagName: '@disclaimer',
  tagNameWithUpperCase: '@DISCLAIMER',
  syntaxKind: TSDocTagSyntaxKind.BlockTag,
  standardization: Standardization.Extended,
  allowMultiple: true,
});
export default config;
