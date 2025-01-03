(function() {
  'use strict';

  // abort
  window.AbortExecution = class AbortExecution extends Error {
    constructor(message) {
      super(message);
      this.name = "AbortExecution";
    }
  }
  window.abort = function(...args) {
    console.log('abort: init..')
    tmsDeleteAll(); // clean storage
    // Formulate message
    const showAlert = typeof args[0] === 'boolean' ? args.shift() : true;
    const msg = 'AbortExecution';
    const joinedArgs = args.map(arg =>
      typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
    ).join(' ');
    // Show alert
    if (showAlert) {
      alert(joinedArgs ? `${msg}: ${joinedArgs}` : msg);
    }
    // Throw exception
    console.log('abort: done.')
    throw new AbortExecution(joinedArgs);
  }
  // sleep
  window.sleep = function(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  // redirect
  window.redirect = function(newUrl) {
    console.log('redirect: "'+newUrl+'"');
    window.location.href = newUrl; // Выполняем редирект
  }
  window.fakeRedirect = async function(newUrl, delay=3000) {
    console.log('fakeRedirect(delay='+delay+'): "'+newUrl+'"');
    window.location.href = newUrl; // Выполняем редирект
    await sleep(delay);
  };
  // DOM-manipulations
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
    const oldVal = el.value;
    el.value = newVal;
    console.log('updValEl: "' + oldVal + '" -> "' + newVal + '"', el);
    // Создаем и вызываем событие change
    const event = new Event('change', { bubbles: true });
    el.dispatchEvent(event);
    await sleep(delay);
  }
  // styles
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
})();
