// ==UserScript==
// @name         bc/prod
// @description  bc/prod
// @namespace    bc/prod
// @version      1
// @match        http://bravura-crm.com/*
// @require      https://raw.githubusercontent.com/df09/tampermonkey/refs/heads/main/bravura/01_tms.js
// @require      https://raw.githubusercontent.com/df09/tampermonkey/refs/heads/main/bravura/02_helpers.js
// @require      https://raw.githubusercontent.com/df09/tampermonkey/refs/heads/main/bravura/03_menu.js
// @require      https://raw.githubusercontent.com/df09/tampermonkey/refs/heads/main/bravura/11_jobPage.js
// @run-at       document-end
// @icon         https://www.google.com/s2/favicons?sz=64&domain=glasscompanyny.com
// @grant        none
// @author       anon
// ==/UserScript==
(function() { 'use strict'; window.addEventListener('load', async () => { console.log('bc/prod: loaded'); }); })();
