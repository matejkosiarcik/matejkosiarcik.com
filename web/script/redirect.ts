import { ready } from './utils';

// redirect from matejkosiarcik.netlify.app -> matejkosiarcik.com
ready(() => {
  if (window.location.hostname.includes('netlify')) {
    window.location.assign(`https://matejkosiarcik.com${window.location.pathname}`);
  }
});
