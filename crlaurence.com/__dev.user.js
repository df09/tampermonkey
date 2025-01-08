// ==UserScript==
// @name         crlaurence.com/dev
// @description  crlaurence.com/dev
// @namespace    crlaurence.com/dev
// @match        https://www.crlaurence.com
// @run-at       document-end
// @version      1
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.crlaurence.com
// @grant        none
// @author       anon
// ==/UserScript==
(function(){'use strict';
  const host = 'http://localhost:9876';
  const entrypoint = 'crlaurence.com/dev';
  const files = [
    '/_helpers/01_storage.js',
    '/_helpers/02_common.js',
    '/_helpers/03_menu.js',
    '/crlaurence.com/actions/login.js'
    '/crlaurence.com/main.js'
  ];
  async function tmLoader(){for(const file of files){await new Promise((resolve,reject)=>{
    const s = document.createElement('script'); s.async = false; // Гарантирует последовательное выполнение
    s.src=host+file;s.onload=()=>{console.log('tmLoader: '+s.src);resolve();};s.onerror=()=>reject(new Error('tmLoader: '+s.src));
    document.body.appendChild(s);
  });}}
  window.addEventListener('load',async()=>{try{await tmLoader();}catch(e){console.error(e);}console.log(entrypoint+': loaded');});
})();
