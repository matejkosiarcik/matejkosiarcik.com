import { ready } from './utils';

ready(() => {
    const html = document.head.parentElement;
    if (html) {
        html.className = 'js';
    }
});
