// ==UserScript==
// @name         bc
// @description  bc
// @namespace    bc
// @version      20
// @author       anon
// @match        http://bravura-crm.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=glasscompanyny.com
// @grant        none
// @run-at       document-end
// @require      https://raw.githubusercontent.com/df09/tempermonkey/refs/heads/main/bravura/01_tms.js?v=20
// @require      https://raw.githubusercontent.com/df09/tempermonkey/refs/heads/main/bravura/02_helpers.js?v=20
// @require      https://raw.githubusercontent.com/df09/tempermonkey/refs/heads/main/bravura/03_menu.js?v=20
// @require      https://raw.githubusercontent.com/df09/tempermonkey/refs/heads/main/bravura/11_jobPage.js?v=20
// ==/UserScript==

(function() {
  'use strict';

  // ==== load ============================================
  window.addEventListener('load', async () => {
    console.log('20 bc: loaded.');
  });
})();
