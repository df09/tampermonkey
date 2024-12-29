// ==UserScript==
// @name         bc/dev
// @description  bc/dev
// @namespace    bc/dev
// @version      1
// @match        http://bravura-crm.com/*
// @run-at       document-end
// @icon         https://www.google.com/s2/favicons?sz=64&domain=glasscompanyny.com
// @grant        none
// @author       anon
// ==/UserScript==
(function(){'use strict';
  const host = 'http://localhost:9876';
  const files = [
    '/bc/01_tms.js',
    '/bc/02_helpers.js',
    '/bc/03_menu.js',
    '/bc/11_job.js'
  ];
  async function loadScripts() { for (const file of files) { await new Promise((resolve, reject) => {
    const script = document.createElement('script'); script.src = host + file;
    script.async = false; // Гарантирует последовательное выполнение
    script.onload = () => { resolve(); };
    script.onerror = () => reject(new Error(`loadScripts: ${file}`));
    document.body.appendChild(script);
  });}}
  window.addEventListener('load', async () => {
    try { await loadScripts(); } catch (error) { console.error(error); }
    console.log('bc/dev: loaded');
  });
})();
