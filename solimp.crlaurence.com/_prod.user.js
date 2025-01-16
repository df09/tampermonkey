// ==UserScript==
// @name         solimp.crlaurence.com/prod
// @icon         https://www.google.com/s2/favicons?domain=solimp.crlaurence.com&sz=64
// @match        https://solimp.crlaurence.com/SOL_API/ShowerApp/
// @require      https://raw.githubusercontent.com/df09/tampermonkey/refs/heads/main/_helpers/common.js
// @require      https://raw.githubusercontent.com/df09/tampermonkey/refs/heads/main/_helpers/css/main.js
// @require      https://raw.githubusercontent.com/df09/tampermonkey/refs/heads/main/_helpers/html/main.js
// @require      https://raw.githubusercontent.com/df09/tampermonkey/refs/heads/main/_helpers/storage.js
// @require      https://raw.githubusercontent.com/df09/tampermonkey/refs/heads/main/_helpers/ui.js
// @require      https://raw.githubusercontent.com/df09/tampermonkey/refs/heads/main/solimp.crlaurence.com/generateTwins/start.js
// @require      https://raw.githubusercontent.com/df09/tampermonkey/refs/heads/main/solimp.crlaurence.com/main.js
// @run-at       document-end
// ==/UserScript==
(()=>{'use strict';const i='solimp.crlaurence.com/prod';window.addEventListener('load',async ()=>console.log(i+': loaded'));})();
