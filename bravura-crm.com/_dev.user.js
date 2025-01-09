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
  const files = [
    '/_helpers/01_common.js',
    '/_helpers/02_storage.js',
    '/_helpers/03_ui.js',
    '/bravura-crm.com/createBarcodes/job.js'
    '/bravura-crm.com/createBarcodes/newProduct.js'
    '/bravura-crm.com/createBarcodes/sizeSetup.js'
    '/bravura-crm.com/createBarcodes/sectionsDetail.js'
    '/bravura-crm.com/go2jobByjobId/start.js'
    '/bravura-crm.com/main.js'
  ];
  // === loader =========
  async function tmLoader(){for(const file of files){await new Promise((r,j)=>{
    const s=document.createElement('script');s.async=false; // Гарантирует последовательное выполнение
    s.src=host+file;s.onload=()=>{console.log('tmLoader: '+s.src);r();};s.onerror=()=>j(new Error('tmLoader: '+s.src));
    document.body.appendChild(s);
  });}}
  window.addEventListener('load',async()=>{try{await tmLoader();}catch(e){console.error(e);}console.log(entrypoint+': loaded');});
})();
