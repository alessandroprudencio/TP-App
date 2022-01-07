const ENV = 'dev';

export const URL_API =
  ENV === 'dev'
    ? 'http://192.168.100.2:3003/api/v1/'
    : 'http://tp-load-balancer-1809039677.us-east-1.elb.amazonaws.com';
