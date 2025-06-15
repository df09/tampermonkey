// ==UserScript==
// @name    PPLM
// @match   https://www.pornhub.com/*
// @run-at  document-end
// ==/UserScript==
(function(){'use strict';
  const dir = 'pplm.com';
  const filesJs = [
    '/_core/10_helpers.js',
    '/_core/20_tmStorage.js',
    '/'+dir+'/1_css.js',
    '/'+dir+'/2_html.js',
    '/'+dir+'/3_main.js',
  ];
  const host = 'http://localhost:9876';
  async function tmLoad(fs){for(const f of fs){await new Promise((r,j)=>{
    const e=document.createElement('script');e.async=false; // Гарантирует последовательное выполнение
    e.src=host+f;e.onload=()=>{console.log('tmLoad: '+e.src);r();};e.onerror=()=>j(new Error('tmLoad: '+e.src));
    document.body.appendChild(e);
  })}}
  window.addEventListener('load',async()=>{try{await tmLoad(filesJs);console.log(dir+'/dev: loaded')}catch(e){throw new Error(e.message)}});
})();
