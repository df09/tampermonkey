// ==UserScript==
// @name         bravura-crm.com/prod
// @icon         https://www.google.com/s2/favicons?domain=www.glasscompanyny.com&sz=64
// @match        http://bravura-crm.com/*
// @require      https://raw.githubusercontent.com/df09/tampermonkey/refs/heads/main/_helpers/01_common.js
// @require      https://raw.githubusercontent.com/df09/tampermonkey/refs/heads/main/_helpers/02_storage.js
// @require      https://raw.githubusercontent.com/df09/tampermonkey/refs/heads/main/_helpers/03_ui.js
// @require      https://raw.githubusercontent.com/df09/tampermonkey/refs/heads/main/bravura-crm.com/createBarcodes/job.js
// @require      https://raw.githubusercontent.com/df09/tampermonkey/refs/heads/main/bravura-crm.com/createBarcodes/newProduct.js
// @require      https://raw.githubusercontent.com/df09/tampermonkey/refs/heads/main/bravura-crm.com/createBarcodes/sizeSetup.js
// @require      https://raw.githubusercontent.com/df09/tampermonkey/refs/heads/main/bravura-crm.com/createBarcodes/sectionsDetail.js
// @require      https://raw.githubusercontent.com/df09/tampermonkey/refs/heads/main/bravura-crm.com/go2jobByjobId/start.js
// @require      https://raw.githubusercontent.com/df09/tampermonkey/refs/heads/main/bravura-crm.com/main.js
// @run-at       document-end
// ==/UserScript==
(()=>{'use strict';const i='bravura-crm.com/prod';window.addEventListener('load',async ()=>console.log(i+': loaded'));})();
