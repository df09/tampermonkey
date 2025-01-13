// ==UserScript==
// @name         bravura-crm.com/dev
// @icon         https://www.google.com/s2/favicons?domain=www.glasscompanyny.com&sz=64
// @match        http://bravura-crm.com/*
// @run-at       document-end
// ==/UserScript==
(function(){'use strict';
  // >>> data >>>>>>>>>>>
  const host = 'http://localhost:9876';
  const entrypoint = 'bravura-crm.com/dev';
  const filesJs = [
    '/_helpers/common.js',
    '/_helpers/css/main.js',
    '/_helpers/html/main.js',
    '/_helpers/storage.js',
    '/_helpers/ui.js',
    '/bravura-crm.com/createBarcodes/job.js',
    '/bravura-crm.com/createBarcodes/newProduct.js',
    '/bravura-crm.com/createBarcodes/sizeSetup.js',
    '/bravura-crm.com/createBarcodes/sectionsDetail.js',
    '/bravura-crm.com/go2jobByjobId/start.js',
    '/bravura-crm.com/main.js',
  ];
  // === loader =========
  async function tmLoad(fs){for(const f of fs){await new Promise((r,j)=>{
    const e=document.createElement('script');e.async=false; // Гарантирует последовательное выполнение
    e.src=host+f;e.onload=()=>{console.log('tmLoad: '+e.src);r();};e.onerror=()=>j(new Error('tmLoad: '+e.src));
    document.body.appendChild(e);
  });}}
  window.addEventListener('load',async()=>{try{await tmLoad(filesJs);console.log(entrypoint+'.js: loaded');}catch(e){console.error(e);}});
})();
