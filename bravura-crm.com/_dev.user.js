// ==UserScript==
// @name    bravura-crm.com/dev
// @icon    https://www.google.com/s2/favicons?domain=www.glasscompanyny.com&sz=64
// @match   http://bravura-crm.com/*
// @run-at  document-end
// ==/UserScript==
(function(){'use strict';
  const dir = 'bravura-crm.com';
  const host = 'http://localhost:9876';
  const filesJs = [
    '/_core/00_css.js',
    '/_core/00_html.js',
    '/_core/10_helpers.js',
    '/_core/20_tmStorage.js',
    '/_core/30_tmMenu.js',
    '/_core/40_tmModal.js',
    '/_core/50_tmUi.js',
    '/'+dir+'/createBarcodes/start.js',
    '/'+dir+'/createBarcodes/createFo.js',
    '/'+dir+'/createBarcodes/checkExistingRooms.js',
    '/'+dir+'/createBarcodes/newProduct.js',
    '/'+dir+'/createBarcodes/sizeSetup.js',
    '/'+dir+'/createBarcodes/sectionsDetail.js',
    '/'+dir+'/redirectToJob/start.js',
    '/'+dir+'/searchActiveJob/start.js',
    '/'+dir+'/main.js',
  ];
  async function tmLoad(fs){for(const f of fs){await new Promise((r,j)=>{
    const e=document.createElement('script');e.async=false; // Гарантирует последовательное выполнение
    e.src=host+f;e.onload=()=>{console.log('tmLoad: '+e.src);r();};e.onerror=()=>j(new Error('tmLoad: '+e.src));
    document.body.appendChild(e);
  })}}
  window.addEventListener('load',async()=>{try{await tmLoad(filesJs);console.log(dir+'/dev: loaded')}catch(e){throw new Error(e.message)}});
})();
