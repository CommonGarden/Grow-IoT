import config from './rollup.config';

config.format = 'umd';
config.dest = 'dist/Grow.umd.js';
config.moduleName = 'Grow';

export default config;
