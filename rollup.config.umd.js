import config from './rollup.config';

config.format = 'umd';
config.dest = 'dist/Thing.umd.js';
config.moduleName = 'Thing';

export default config;
