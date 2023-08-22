import dev from './config.dev';
import prod from './config.prod';
import test from './config.test';

const { UMI_ENV } = process.env;
let config = dev;

if (UMI_ENV === 'prod' || UMI_ENV === 'production') {
  config = prod;
}
if (UMI_ENV === 'test') {
  config = test;
}
console.log(config);
export default config;
