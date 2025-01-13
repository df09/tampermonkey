// abort
class AbortExecution extends Error{constructor(message){super(message);this.name="AbortExecution";}}
function abort(...args) {
  console.log('abort: init..')
  tmsDeleteAll(); // clean storage
  // Formulate message
  const showAlert = typeof args[0] === 'boolean' ? args.shift() : true;
  const msg = 'AbortExecution';
  const joinedArgs=args.map(arg=>typeof arg==='object'?JSON.stringify(arg,null,2):String(arg)).join(' ');
  if(showAlert){alert(joinedArgs?`${msg}: ${joinedArgs}`:msg);} // Show alert
  console.log('abort: done.'); throw new AbortExecution(joinedArgs); // Throw exception
}
// inject
function injectCSS(css) {
  if (!css||typeof css!=='string'){abort('injectCSS: Invalid content provided.')}
  const styleElement = document.createElement('style');
  styleElement.type = 'text/css';
  styleElement.textContent = css;
  document.head.appendChild(styleElement);
}
function injectHTML(html) {
  if (!html || typeof html !== 'string') { abort('injectHTML: Invalid content provided.'); }
  const container = document.createElement('div'); container.innerHTML = html;
  document.body.append(container); // Всегда добавляет в конец body
  console.log('injectHTML: done.');
}
function addHint(e, id, content) {
  addStyles(`${id}{position:'absolute';top:'-10px';right:'-10px';padding:'5px';fontSize:'12px';border:'1px solid black';borderRadius:'3px';}`);
  const hintContainer = document.createElement('div');
  hintContainer.id = id;
  hintContainer.innerText = content;
  e.parentElement.style.position = 'relative';
  e.parentElement.appendChild(hintContainer);
}
// sleep
function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
// redirect
function redirect(newUrl) {
  console.log('redirect: "'+newUrl+'"');
  window.location.href = newUrl; // Выполняем редирект
}
async function fakeRedirect(newUrl, delay=3000) {
  console.log('fakeRedirect(delay='+delay+'): "'+newUrl+'"');
  window.location.href = newUrl; // Выполняем редирект
  await sleep(delay);
}
// DOM-manipulations
function getEl(selector) {
  const elements = document.querySelectorAll(selector);
  if (elements.length === 0) {abort('getEl "'+selector+'": not found.')}
  if (elements.length > 1)   {abort('getEl "'+selector+'": multiple elements found.')}}
  const e = elements[0];
  console.log('getEl "'+selector+'"):', e);
  return e;
}
function getEls(selector) {
  const els = document.querySelectorAll(selector);
  if (elements.length === 0) {abort('getEl: "'+selector+'" not found.')}
  console.log('getEls "'+selector+'":', els);
  return els;
}
async function clickEl(e, delay=100) {
  e.click();
  console.log('clickEl:', e);
  await sleep(delay);
}
async function updValEl(e, newVal, delay=100) {
  const oldVal = e.value;
  e.value = newVal;
  console.log('updValEl: "' + oldVal + '" -> "' + newVal + '"', e);
  // Создаем и вызываем событие change
  const event = new Event('change', { bubbles: true });
  e.dispatchEvent(event);
  await sleep(delay);
}
