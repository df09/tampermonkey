// ==UserScript==
// @name     bravura-crm.com/prod
// @icon     https://www.google.com/s2/favicons?domain=www.glasscompanyny.com&sz=64
// @match    http://bravura-crm.com/*
// @require  https://raw.githubusercontent.com/df09/tampermonkey/refs/heads/main/_core/00_css.js
// @require  https://raw.githubusercontent.com/df09/tampermonkey/refs/heads/main/_core/00_html.js
// @require  https://raw.githubusercontent.com/df09/tampermonkey/refs/heads/main/_core/10_helpers.js
// @require  https://raw.githubusercontent.com/df09/tampermonkey/refs/heads/main/_core/20_tmStorage.js
// @require  https://raw.githubusercontent.com/df09/tampermonkey/refs/heads/main/_core/30_tmMenu.js
// @require  https://raw.githubusercontent.com/df09/tampermonkey/refs/heads/main/_core/40_tmModal.js
// @require  https://raw.githubusercontent.com/df09/tampermonkey/refs/heads/main/_core/50_tmUi.js
// @require  https://raw.githubusercontent.com/df09/tampermonkey/refs/heads/main/bravura-crm.com/createBarcodes/start.js
// @require  https://raw.githubusercontent.com/df09/tampermonkey/refs/heads/main/bravura-crm.com/createBarcodes/createFo.js
// @require  https://raw.githubusercontent.com/df09/tampermonkey/refs/heads/main/bravura-crm.com/createBarcodes/checkExistingRooms.js
// @require  https://raw.githubusercontent.com/df09/tampermonkey/refs/heads/main/bravura-crm.com/createBarcodes/newProduct.js
// @require  https://raw.githubusercontent.com/df09/tampermonkey/refs/heads/main/bravura-crm.com/createBarcodes/sizeSetup.js
// @require  https://raw.githubusercontent.com/df09/tampermonkey/refs/heads/main/bravura-crm.com/createBarcodes/sectionsDetail.js
// @require  https://raw.githubusercontent.com/df09/tampermonkey/refs/heads/main/bravura-crm.com/redirectToJob/start.js
// @require  https://raw.githubusercontent.com/df09/tampermonkey/refs/heads/main/bravura-crm.com/searchActiveJobs/start.js
// @require  https://raw.githubusercontent.com/df09/tampermonkey/refs/heads/main/bravura-crm.com/main.js
// @run-at   document-end
// ==/UserScript==
(()=>{'use strict';window.addEventListener('load',()=>{console.log('/_prod.user.js: loaded')})})();
