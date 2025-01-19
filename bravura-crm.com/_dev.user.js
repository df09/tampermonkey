// ==UserScript==
// @name         bravura-crm.com/dev
// @icon         https://www.google.com/s2/favicons?domain=www.glasscompanyny.com&sz=64
// @match        http://bravura-crm.com/*
// @run-at       document-end
// ==/UserScript==
(function(){'use strict';
  // >>> data >>>>>>>>>>>
  window.tmENV = 'dev';
  window.tmDIR = 'bravura-crm.com';
  window.tmHOST = 'http://localhost:9876';
  const filesJs = [
    '/_helpers/common.js',
    '/_helpers/css/main.js',
    '/_helpers/html/main.js',
    '/_helpers/storage.js',
    '/_helpers/ui.js',
    '/'+tmDIR+'/createBarcodes/start.js',
    '/'+tmDIR+'/createBarcodes/newProduct.js',
    '/'+tmDIR+'/createBarcodes/sizeSetup.js',
    '/'+tmDIR+'/createBarcodes/sectionsDetail.js',
    '/'+tmDIR+'/redirectToJob/start.js',
    '/'+tmDIR+'/searchActiveJob/start.js',
    '/'+tmDIR+'/testExec1/start.js',
    '/'+tmDIR+'/testExec2/start.js',
    '/'+tmDIR+'/testPrep1/start.js',
    '/'+tmDIR+'/testPrep2/start.js',
    '/'+tmDIR+'/main.js',
  ];
  // === loader =========
  async function tmLoad(fs){for(const f of fs){await new Promise((r,j)=>{
    const e=document.createElement('script');e.async=false; // Гарантирует последовательное выполнение
    e.src=tmHOST+f;e.onload=()=>{console.log('tmLoad: '+e.src);r();};e.onerror=()=>j(new Error('tmLoad: '+e.src));
    document.body.appendChild(e);
  })}}
  window.addEventListener('load',async()=>{try{await tmLoad(filesJs);console.log(tmDIR+'/'+tmENV+': loaded');}catch(e){console.error(e);}});
})();
