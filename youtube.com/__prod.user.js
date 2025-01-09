// ==UserScript==
// @name         youtube.com/prod
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.youtube.com
// @match        https://www.youtube.com/*
// @require      https://raw.githubusercontent.com/df09/tampermonkey/refs/heads/main/_helpers/01_storage.js
// @require      https://raw.githubusercontent.com/df09/tampermonkey/refs/heads/main/_helpers/02_common.js
// @require      https://raw.githubusercontent.com/df09/tampermonkey/refs/heads/main/_helpers/03_menu.js
// @require      https://raw.githubusercontent.com/df09/tampermonkey/refs/heads/main/youtube.com/parseComments.js
// @require      https://raw.githubusercontent.com/df09/tampermonkey/refs/heads/main/youtube.com/_main.js
// @run-at       document-end
// ==/UserScript==
(()=>{'use strict';const i='youtube.com/prod';window.addEventListener('load',async ()=>console.log(i+': loaded'));})();
