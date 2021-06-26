// Must load this file first
// 1. it guards against execution from the same file twice (in module and nomodule versions)
// 2. it changes html root to signify js availability to css

if ((window as any).EXECUTED) {
  throw new Error('Script already executed. Stopping further processing of this script.');
}
(window as any).EXECUTED = true;

const html = document.head.parentElement;
if (html) {
  html.className = 'js';
}
