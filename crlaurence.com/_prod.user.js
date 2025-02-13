// ==UserScript==
// @name         crlaurence.com/prod
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.crlaurence.com
// @match        https://www.crlaurence.com
// @require      https://raw.githubusercontent.com/df09/tampermonkey/refs/heads/main/_core/00_css.js
// @require      https://raw.githubusercontent.com/df09/tampermonkey/refs/heads/main/_core/00_html.js
// @require      https://raw.githubusercontent.com/df09/tampermonkey/refs/heads/main/_core/10_helpers.js
// @require      https://raw.githubusercontent.com/df09/tampermonkey/refs/heads/main/_core/20_tmStorage.js
// @require      https://raw.githubusercontent.com/df09/tampermonkey/refs/heads/main/_core/30_tmMenu.js
// @require      https://raw.githubusercontent.com/df09/tampermonkey/refs/heads/main/_core/40_tmModal.js
// @require      https://raw.githubusercontent.com/df09/tampermonkey/refs/heads/main/_core/50_tmUi.js
// @require      https://raw.githubusercontent.com/df09/tampermonkey/refs/heads/main/crlaurence.com/f/autoLogin.js
// @require      https://raw.githubusercontent.com/df09/tampermonkey/refs/heads/main/crlaurence.com/orderHw/checkIsCartEmpty.js
// @require      https://raw.githubusercontent.com/df09/tampermonkey/refs/heads/main/crlaurence.com/orderHw/start.js
// @require      https://raw.githubusercontent.com/df09/tampermonkey/refs/heads/main/crlaurence.com/orderHw/addToCart.js
// @require      https://raw.githubusercontent.com/df09/tampermonkey/refs/heads/main/crlaurence.com/orderHw/checkout.js
// @require      https://raw.githubusercontent.com/df09/tampermonkey/refs/heads/main/crlaurence.com/main.js
// @run-at       document-end
// ==/UserScript==
(()=>{'use strict';window.addEventListener('load',()=>{console.log('/_prod.user.js: loaded')})})();
