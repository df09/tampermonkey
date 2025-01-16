// ==UserScript==
// @name         solimp.crlaurence.com/dev
// @icon         https://www.google.com/s2/favicons?domain=solimp.crlaurence.com&sz=64
// @match        https://solimp.crlaurence.com/SOL_API/ShowerApp/
// @run-at       document-end
// ==/UserScript==
(function(){'use strict';
  // >>> data >>>>>>>>>>>
  const host = 'http://localhost:9876';
  const entrypoint = 'solimp.crlaurence.com/dev';
  const filesJs = [
    '/_helpers/common.js',
    '/_helpers/css/main.js',
    '/_helpers/html/main.js',
    '/_helpers/storage.js',
    '/_helpers/ui.js',
    '/solimp.crlaurence.com/generateTwins/start.js',
    '/solimp.crlaurence.com/main.js',
  ];
  // === loader =========
  async function tmLoad(fs){for(const f of fs){await new Promise((r,j)=>{
    const e=document.createElement('script');e.async=false; // Гарантирует последовательное выполнение
    e.src=host+f;e.onload=()=>{console.log('tmLoad: '+e.src);r();};e.onerror=()=>j(new Error('tmLoad: '+e.src));
    document.body.appendChild(e);
  });}}
  window.addEventListener('load',async()=>{try{await tmLoad(filesJs);console.log(entrypoint+'.js: loaded');}catch(e){console.error(e);}});
})();
