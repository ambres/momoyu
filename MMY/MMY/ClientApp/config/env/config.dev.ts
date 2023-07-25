const { UMI_ENV } = process.env;

export default {
  'process.env.BASIC_CONFIG': {
    env: UMI_ENV,
    hostApiAddress: 'http://localhost:10000',
    cdnAddress: 'http://cdn.hourxu.com',
    rtcAddress: 'http://localhost:10000',
  },
};
