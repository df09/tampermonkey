// ==UserScript==
// @name         /createBarcodes/dev/sectionsDetail
// @description  /createBarcodes/dev/sectionsDetail
// @namespace    /createBarcodes/dev/sectionsDetail
// @match        http://bravura-crm.com/dashboard/sections_detail?job_id=*&status=N%2FA
// @run-at       document-end
// @version      1
// @icon         https://www.google.com/s2/favicons?sz=64&domain=glasscompanyny.com
// @grant        none
// @author       anon
// ==/UserScript==
(function(){'use strict';
  const host = 'http://localhost:9876';
  const files = [
    '/_helpers/01_storage.js',
    '/_helpers/02_common.js',
    '/_helpers/03_menu.js',
    '/createBarcodes/sectionsDetail.js'
  ];
  async function loadScripts() { for (const file of files) { await new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.async = false; // Гарантирует последовательное выполнение
    script.src = host + file;
    script.onload = () => { console.log('loadScripts: '+script.src);resolve();};
    script.onerror = () => reject(new Error('loadScripts: '+script.src));
    document.body.appendChild(script);
  });}}
  window.addEventListener('load', async () => {
    try { await loadScripts(); } catch (error) { console.error(error); }
    console.log('/createBarcodes/dev/sectionsDetail: loaded');
  });
})();
