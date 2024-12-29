// ==UserScript==
// @name         bc
// @description  bc
// @namespace    bc
// @version      7
// @author       anon
// @match        http://bravura-crm.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=glasscompanyny.com
// @grant        none
// @run-at       document-end
// @require      https://github.com/df09/tempermonkey/raw/refs/heads/main/bravura/02_helpers.js?v=7
// ==/UserScript==

(function() {
  'use strict';

  // ==== menu ============================================
  window.tmMenuTitle = 'Create barcodes';
  window.tmMenuContainerSelector = '#tmmenu-container';
  window.tmMenuTextareaSelector = '#tmmenu-textarea';
  window.tmMenuStartSelector = '#tmmenu-start';
  window.tmMenuContinueSelector = '#tmmenu-continue';
  window.tmMenuAbortSelector = '#tmmenu-abort';

  // TODO: сделать мои классические стили
  window.tmMenuAddStyles = function() {
    addStyles(`
      ${tmMenuContainerSelector} { z-index: 99999; font-family: monospace; position: fixed; bottom: 10px; right: 10px; background-color: white; border: 1px solid #ccc; padding: 10px; z-index: 1000; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); }
      ${tmMenuTextareaSelector}  { width: 300px; height: 150px; margin-bottom: 10px; }
      ${tmMenuContainerSelector} button { display: block; width: 100%; padding: 5px; }
      ${tmMenuStartSelector}     { background-color: green; color: white; }
      ${tmMenuContinueSelector}  { background-color: yellow; color: black; display: none; }
      ${tmMenuAbortSelector}      { background-color: red; color: white; display: none; }
    `);
  }
  window.tmMenuAdd = function() {
    // vars
    const container = document.createElement('div');
    const textarea = document.createElement('textarea');
    const startButton = document.createElement('button');
    const continueButton = document.createElement('button');
    const abortButton = document.createElement('button');
    tmMenuAddStyles(); // styles
    container.id = tmMenuContainerSelector.replace('#', ''); // container
    textarea.id = tmMenuTextareaSelector.replace('#', ''); // textarea
    // start
    startButton.id = tmMenuStartSelector.replace('#', '');
    startButton.textContent = tmMenuTitle;
    startButton.style.display = 'block';
    startButton.addEventListener('click', () => {
      startButton.style.display = 'none';
      continueButton.style.display = 'none';
      abortButton.style.display = 'block';
    });
    // continue
    continueButton.id = tmMenuContinueSelector.replace('#', '');
    continueButton.textContent = 'Continue';
    continueButton.style.display = 'none';
    continueButton.addEventListener('click', () => {
      startButton.style.display = 'none';
      continueButton.style.display = 'none';
      abortButton.style.display = 'block';
    });
    // abort
    abortButton.id = tmMenuAbortSelector.replace('#', '');
    abortButton.textContent = 'Abort';
    abortButton.style.display = 'none';
    abortButton.addEventListener('click', () => {
      startButton.style.display = 'none';
      continueButton.style.display = 'none';
      abortButton.style.display = 'none';
      abort('tmMenuAbort - Execution abortped by user.');
    });
    // append
    container.appendChild(textarea);
    container.appendChild(startButton);
    container.appendChild(continueButton);
    container.appendChild(abortButton);
    document.body.appendChild(container);
  }
  // pause
  window.tmMenuPause = function(msg) {
    const continueButton = getEl(tmMenuContinueSelector);
    getEl(tmMenuStartSelector).style.display = 'none';
    getEl(tmMenuAbortSelector).style.display = 'none';
    continueButton.style.display = 'block';
    alert('tmMenuPause: '+msg);
    return new Promise(resolve => {
      continueButton.onclick = resolve;
    });
  }

  // ==== load ============================================
  // window.bc_03_menu = true;
  console.log('bc_03_menu: loaded.');
})();
