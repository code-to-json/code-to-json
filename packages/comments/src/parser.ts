import { TSDocConfiguration, TSDocParser } from '@microsoft/tsdoc';

const config = new TSDocConfiguration();

const parser = new TSDocParser(config);
export default parser;
