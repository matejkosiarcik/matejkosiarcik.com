export function ready(callback: () => void): void {
  // check if running outside browser, like nodeJS
  // if (typeof document === 'undefined') {
  //     throw new Error('not a browser')
  // }

  const state = document.readyState;
  if (state === 'complete' || state === 'interactive') {
    setTimeout(callback, 0);
  }

  if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', callback);
  } else {
    function onReadyStateChange() {
      if (document.readyState === 'complete') {
        (document as any).detachEvent('onreadystatechange', onReadyStateChange);
        callback();
      }
    }
    (document as any).attachEvent('onreadystatechange', onReadyStateChange);
  }
}

export function listen(element: HTMLElement, eventName: string, callback: (event: Event) => void): void {
  if (element.addEventListener) {
    element.addEventListener(eventName, callback);
  } else {
    (element as any).attachEvent(`on${eventName}`, callback);
  }
}
