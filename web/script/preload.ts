import { ready } from "./utils"

ready(() => {
    const element = document.createElement('link')
    const preloadSupported = !!(element.relList && element.relList.supports && element.relList.supports('preload'))
    console.log('Preload supported:', preloadSupported)
    if (preloadSupported) {
        return
    }

    document.querySelectorAll('link[rel=preload][as=style]').forEach(link => {
        if (!(link instanceof HTMLLinkElement)) {
            return
        }
        console.log('Replacing preload stylesheet')

        link.removeAttribute('onload')
        link.removeAttribute('as')
        link.rel = 'stylesheet'
    })
})
