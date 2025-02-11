// ==UserScript==
// @name         crlaurence.com/dev
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.crlaurence.com
// @match        https://www.crlaurence.com/*
// @run-at       document-end
// ==/UserScript==
(function(){'use strict';
  const dir = 'crlaurence.com';
  const filesJs = [
    '/_core/00_css.js',
    '/_core/00_html.js',
    '/_core/10_helpers.js',
    '/_core/20_tmStorage.js',
    '/_core/30_tmMenu.js',
    '/_core/40_tmModal.js',
    '/_core/50_tmUi.js',
    '/'+dir+'/f/autoLogin.js',
    '/'+dir+'/orderHw/checkIsCartEmpty.js',
    '/'+dir+'/orderHw/start.js',
    '/'+dir+'/orderHw/addToCart.js',
    '/'+dir+'/orderHw/checkout.js',
    '/'+dir+'/main.js',
  ];
  const host = 'http://localhost:9876';
  async function tmLoad(fs){for(const f of fs){await new Promise((r,j)=>{
    const e=document.createElement('script');e.async=false; // Гарантирует последовательное выполнение
    e.src=host+f;e.onload=()=>{console.log('tmLoad: '+e.src);r();};e.onerror=()=>j(new Error('tmLoad: '+e.src));
    document.body.appendChild(e);
  })}}
  window.addEventListener('load',async()=>{try{await tmLoad(filesJs);console.log(dir+'/dev: loaded')}catch(e){throw new Error(e.message)}});
})();
