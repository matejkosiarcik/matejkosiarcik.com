export function ready(callback: () => void): void {
    if (typeof document === 'undefined') {
        throw new Error('not a browser')
    }

    const state = document.readyState
    if (state === 'complete' || state === 'interactive') {
        setTimeout(callback, 0)
    }

    if (document.addEventListener) {
        document.addEventListener('DOMContentLoaded', callback)
    } else {
        (document as any).attachEvent('onreadystatechange', function () {
            if (document.readyState === 'complete') {
                (document as any).detachEvent('onreadystatechange', arguments.callee) // arguments.callee is allegedly not supported in strict mode
                callback()
            }
        })
    }
}

export function listen(element: HTMLElement, event: string, callback: (event: Event) => void): void {
    if (element.addEventListener) {
        element.addEventListener(event, callback)
    } else {
        (element as any).attachEvent(`on${event}`, callback)
    }
}
