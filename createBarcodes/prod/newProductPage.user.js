// ==UserScript==
// @name         /createBarcodes/prod/newProductPage
// @description  /createBarcodes/prod/newProductPage
// @namespace    /createBarcodes/prod/newProductPage
// @match        http://bravura-crm.com/fabrication_orders/*/new_product
// @require      https://raw.githubusercontent.com/df09/tampermonkey/refs/heads/main/_helpers/01_tms.js
// @require      https://raw.githubusercontent.com/df09/tampermonkey/refs/heads/main/_helpers/02_common.js
// @require      https://raw.githubusercontent.com/df09/tampermonkey/refs/heads/main/_helpers/03_menu.js
// @require      https://raw.githubusercontent.com/df09/tampermonkey/refs/heads/main/createBarcodes/newProductPage.js
// @run-at       document-end
// @version      1
// @icon         https://www.google.com/s2/favicons?sz=64&domain=glasscompanyny.com
// @grant        none
// @author       anon
// ==/UserScript==
(function(){'use strict';window.addEventListener('load',async()=>{console.log('/createBarcodes/prod/newProductPage: loaded');});})();
