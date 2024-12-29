// ==UserScript==
// @name         bc
// @description  bc
// @namespace    bc
// @version      23
// @author       anon
// @match        http://bravura-crm.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=glasscompanyny.com
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
  'use strict';

  // ==== helpers ============================================
  // abort
  window.AbortExecution = class AbortExecution extends Error {
    constructor(message) {
      super(message);
      this.name = "AbortExecution";
    }
  }
  window.abort = function(...args) {
    console.log('abort: init..')
    const showAlert = typeof args[0] === 'boolean' ? args.shift() : true;
    // Formulate message
    const msg = 'AbortExecution';
    const joinedArgs = args.map(arg =>
      typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
    ).join(' ');
    getEl(tmMenuStartSelector).style.display = 'none';
    getEl(tmMenuContinueSelector).style.display = 'none';
    getEl(tmMenuAbortSelector).style.display = 'none';
    // Show alert
    if (showAlert) {
      alert(joinedArgs ? `${msg}: ${joinedArgs}` : msg);
    }
    // Throw exception
    console.log('abort: done.')
    throw new AbortExecution(joinedArgs);
  }
  // helpers.sleep
  window.sleep = function(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  // helpers.redirect
  window.redirect = function(newUrl) {
    console.log('redirect("'+newUrl+'")');
    window.location.href = newUrl; // Выполняем редирект
  }
  // helpers.storage
  window.tmCleanStorage = function() {
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith("tm_")) { sessionStorage.removeItem(key); }
    });
  }
  // helpers.DOM-manipulations
  window.getEl = function(selector) {
    const el = document.querySelector(selector);
    if (!el) { abort('getEl("'+selector+'"): not found'); }
    console.log('getEl("'+selector+'"):', el);
    return el;
  }
  window.getElAll = function(selector) {
    const els = document.querySelectorAll(selector);
    if (!els) { abort('getElAll("'+selector+'"): not found'); }
    console.log('getElAll("'+selector+'"):', els);
    return els;
  }
  window.clickEl = async function(el, delay=100) {
    el.click();
    console.log('clickEl:', el);
    await sleep(delay);
  }
  window.updValEl = async function(el, newVal, delay=100) {
    const oldVal = el.value; el.value = newVal;
    console.log('updValEl: "'+oldVal+'" ->" '+newVal+'"', el);
    await sleep(delay);
  }
  // helpers.styles
  window.addStyles = function(styles) {
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
  }
  window.addHint = function(el, id, content) {
    addStyles(`${id}{position:'absolute';top:'-10px';right:'-10px';padding:'5px';fontSize:'12px';border:'1px solid black';borderRadius:'3px';}`);
    const hintContainer = document.createElement('div');
    hintContainer.id = id;
    hintContainer.innerText = content;
    el.parentElement.style.position = 'relative';
    el.parentElement.appendChild(hintContainer);
  }
  // ==== load ============================================
  window.bc_02_helpers = true;
  console.log('bc/02_helpers: loaded.');
})();
