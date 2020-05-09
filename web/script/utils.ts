export function ready(callback: () => void) {
    if (typeof document === 'undefined') {
        throw new Error('document-ready only runs in the browser')
    }

    var state = document.readyState
    if (state === 'complete' || state === 'interactive') {
        setTimeout(callback, 0)
    }

    if (document.addEventListener) {
        document.addEventListener('DOMContentLoaded', callback)
    } else {
        (<any>document).attachEvent('onreadystatechange', function () {
            if (document.readyState === 'complete') {
                (<any>document).detachEvent('onreadystatechange', arguments.callee)
                callback()
            }
        })
    }
}

export function listen(element: HTMLElement, event: string, callback: (event: Event) => void) {
    if (element.addEventListener) {
        element.addEventListener(event, callback)
    } else {
        (<any>element).attachEvent(`on${event}`, callback)
    }
}
