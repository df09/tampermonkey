// ==UserScript==
// @name         bravura-crm.com/prod
// @icon         https://www.google.com/s2/favicons?domain=www.glasscompanyny.com&sz=64
// @match        http://bravura-crm.com/*
// @require      https://raw.githubusercontent.com/df09/tampermonkey/refs/heads/main/_helpers/common.js
// @require      https://raw.githubusercontent.com/df09/tampermonkey/refs/heads/main/_helpers/css/main.js
// @require      https://raw.githubusercontent.com/df09/tampermonkey/refs/heads/main/_helpers/html/main.js
// @require      https://raw.githubusercontent.com/df09/tampermonkey/refs/heads/main/_helpers/storage.js
// @require      https://raw.githubusercontent.com/df09/tampermonkey/refs/heads/main/_helpers/ui.js
// @require      https://raw.githubusercontent.com/df09/tampermonkey/refs/heads/main/bravura-crm.com/createBarcodes/start.js
// @require      https://raw.githubusercontent.com/df09/tampermonkey/refs/heads/main/bravura-crm.com/createBarcodes/newProduct.js
// @require      https://raw.githubusercontent.com/df09/tampermonkey/refs/heads/main/bravura-crm.com/createBarcodes/sizeSetup.js
// @require      https://raw.githubusercontent.com/df09/tampermonkey/refs/heads/main/bravura-crm.com/createBarcodes/sectionsDetail.js
// @require      https://raw.githubusercontent.com/df09/tampermonkey/refs/heads/main/bravura-crm.com/redirectToJob/start.js
// @require      https://raw.githubusercontent.com/df09/tampermonkey/refs/heads/main/bravura-crm.com/main.js
// @run-at       document-end
// ==/UserScript==
(()=>{'use strict';
  window.tmENV = 'prod';
  window.tmDIR = 'bravura-crm.com';
  window.tmHOST = 'https://raw.githubusercontent.com/df09/tampermonkey/refs/heads/main';
  window.addEventListener('load',async ()=>console.log(tmDIR+'/'+tmENV+': loaded'))
})();
