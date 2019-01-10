import { TSDocParser } from '@microsoft/tsdoc';
import config from './config';

const parser = new TSDocParser(config);
export default parser;
