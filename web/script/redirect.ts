import { ready } from "./utils";

// redirect from matejkosiarcik.netlify.app -> matejkosiarcik.com
ready(() => {
  if (location.hostname.includes('netlify')) {
    location.assign(`https://matejkosiarcik.com${location.pathname}`);
  }
});
