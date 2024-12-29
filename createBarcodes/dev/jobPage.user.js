// ==UserScript==
// @name         /createBarcodes/dev/jobPage
// @description  /createBarcodes/dev/jobPage
// @namespace    /createBarcodes/dev/jobPage
// @match        http://bravura-crm.com/job/*
// @run-at       document-end
// @version      1
// @icon         https://www.google.com/s2/favicons?sz=64&domain=glasscompanyny.com
// @grant        none
// @author       anon
// ==/UserScript==
(function(){'use strict';
  const host = 'http://localhost:9876';
  const files = [
    '/createBarcodes/_helpers/01_tms.js',
    '/createBarcodes/_helpers/02_common.js',
    '/createBarcodes/_helpers/03_menu.js',
    '/createBarcodes/jobPage.js'
  ];
  async function loadScripts() { for (const file of files) { await new Promise((resolve, reject) => {
    const script = document.createElement('script'); script.src = host + file;
    script.async = false; // Гарантирует последовательное выполнение
    script.onload = () => { console.log('loadScripts: '+file); resolve(); };
    script.onerror = () => reject(new Error('loadScripts: '+file));
    document.body.appendChild(script);
  });}}
  window.addEventListener('load', async () => {
    try { await loadScripts(); } catch (error) { console.error(error); }
    console.log('/createBarcodes/dev/jobPage - loaded');
  });
})();
