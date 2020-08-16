import { ready } from "./utils"

// redirect from matejkosiarcik.netlify.app -> matejkosiarcik.com
ready(() => {
    if (location.hostname.includes('netlify')) {
        console.log('Redirect to matejkosiarcik.com/...')
        // location.assign(`https://matejkosiarcik.com${location.pathname}`)
    }
})
