// ==UserScript==
// @name         bc
// @description  bc
// @namespace    bc
// @version      2024-12-18
// @author       anon
// @match        http://bravura-crm.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=glasscompanyny.com
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
  'use strict';

  // Функция для загрузки внешнего скрипта
  function loadExternalScript(url) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.type = 'text/javascript';
      script.async = true;
      // Событие успешной загрузки
      script.onload = () => {
        console.log(`Script loaded: ${url}`);
        resolve();
      };
      // Событие ошибки при загрузке
      script.onerror = () => {
        console.error(`Failed to load script: ${url}`);
        reject(new Error(`Failed to load script: ${url}`));
      };
      // Добавляем скрипт в документ
      document.head.appendChild(script);
    });
  }
  // Загрузка скрипта после загрузки страницы
  window.addEventListener('load', async () => {
    const repo = 'https://github.com/df09/tempermonkey/raw/refs/heads/main/'
    const files = [
     'bc_01_tms.user.js',
     'bc_02_helpers.user.js',
     'bc_03_menu.user.js',
     'bc_10_jobPage.user.js',
    ]
    for (const file of files) {
      await loadExternalScript(baseUrl+file);
    }
  });
})();
