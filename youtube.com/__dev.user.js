// ==UserScript==
// @name         youtube.com/dev
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.youtube.com
// @match        https://www.youtube.com/*
// @run-at       document-end
// ==/UserScript==
(function(){'use strict';
  const domain = 'youtube.com';
  const host = 'http://localhost:9876';
  const files = [
    '/_helpers/01_storage.js',
    '/_helpers/02_common.js',
    '/_helpers/03_menu.js',
    '/youtube.com/actions/parseComments.js'
    '/youtube.com/main.js'
  ];
  async function tmLoader(){for(const file of files){await new Promise((resolve,reject)=>{
    const s = document.createElement('script'); s.async = false; // Гарантирует последовательное выполнение
    s.src=host+file;s.onload=()=>{console.log('tmLoader: '+s.src);resolve();};s.onerror=()=>reject(new Error('tmLoader: '+s.src));
    document.body.appendChild(s);
  });}}
  window.addEventListener('load',async()=>{try{await tmLoader();}catch(e){console.error(e);}console.log(domain+'/dev: loaded');});
})();
