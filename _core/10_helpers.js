function camelCase(input){return input.split('_').map((w, i)=>i===0?w:w.charAt(0).toUpperCase()+w.slice(1)).join('');}
function tmHide(...els){els.forEach(e=>e.classList.add('tm-dnone'))};
function tmShow(...els){els.forEach(e=>e.classList.remove('tm-dnone'))};
function sleep(ms){return new Promise(resolve=>setTimeout(resolve, ms))}
function mustache(template,vars){return template.replace(/{{(\w+)}}/g,(_,key)=>{return vars[key]||''})}
function getKey(event, keys, n) {
  const k = keys.split('+')[n];
  if (!k) return false;
  if (k === 'Shift') return event.shiftKey;
  if (k === 'Ctrl') return event.ctrlKey;
  if (k === 'Alt') return event.altKey;
  if (k === 'Meta') return event.metaKey;
  return event.key === k;
}
// redirect
function redirect(newUrl, force=false) {
  console.log('redirect: "'+newUrl+'"');
  if (force||window.location.href!==newUrl){window.location.href=newUrl}
  console.log('redirect: already on the target URL.');
}
async function fakeRedirect(newUrl, delay=2000) {
  console.log('fakeRedirect(delay='+delay+'): "'+newUrl+'"');
  window.location.href = newUrl;
  await sleep(delay);
}
// DOM-manipulations
function addCls(e, ...cls){cls.forEach(c=>{if(!e.classList.contains(c)){e.classList.add(c)}})}
function remCls(e, ...cls){cls.forEach(c=>{if(e.classList.contains(c)){e.classList.remove(c)}})}
function getEl(selector, pass=false) {
  const pfx = 'getEl "'+selector+'": ';
  // get by id
  if (/^#[a-zA-Z0-9\-_]+$/.test(selector)) {
    const e = document.getElementById(selector.slice(1));
    if (!e) {
      if (pass) {return false}
      abort(pfx+'not found.');
    }
    return e;
  }
  // get by any selector
  const els = document.querySelectorAll(selector);
  if (els.length === 0) {
    if (pass) {return false}
    abort(pfx+'not found.')
  }
  if (els.length > 1) {abort(pfx+'multiple els found.')}
  e = els[0];
  console.log(pfx, e);
  return e;
}
function getEls(selector) {
  const els = document.querySelectorAll(selector);
  if (els.length === 0) {abort('getEl: "'+selector+'" not found.')}
  console.log('getEls "'+selector+'":', els);
  return els;
}
async function clickEl(e, delay=300) {
  e.click();
  console.log('clickEl:', e);
  await sleep(delay);
}
async function updValEl(e, newVal, delay=300) {
  const oldVal = e.value;
  e.value = newVal;
  console.log('updValEl: "'+oldVal+'" -> "'+newVal+'"', e);
  // Создаем и вызываем событие change
  const event = new Event('change', {bubbles: true});
  e.dispatchEvent(event);
  await sleep(delay);
}
