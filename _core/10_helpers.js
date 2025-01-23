// sleep
function sleep(ms){return new Promise(resolve=>setTimeout(resolve, ms))}
// redirect
function redirect(newUrl) {
  console.log('redirect: "'+newUrl+'"');
  window.location.href = newUrl; // Выполняем редирект
}
function redirect(newUrl, force=false) {
  console.log('redirect: "' + newUrl + '"');
  if (force || window.location.href !== newUrl) {
    window.location.href = newUrl; // Выполняем редирект
  } else {
    console.log('redirect: already on the target URL.');
  }
}
async function fakeRedirect(newUrl, delay=2000) {
  console.log('fakeRedirect(delay='+delay+'): "'+newUrl+'"');
  window.location.href = newUrl; // Выполняем редирект
  await sleep(delay);
}
// DOM-manipulations
function getEl(selector) {
  let e;
  if (/^#[a-zA-Z0-9\-_]+$/.test(selector)) {
    // Если это ID, используем getElementById
    e = document.getElementById(selector.slice(1));
    if (!e) {
      abort(`getEl "${selector}": not found.`);
    }
  } else {
    // Используем querySelectorAll для произвольного селектора
    const els = document.querySelectorAll(selector);
    if (els.length === 0) {
      abort(`getEl "${selector}": not found.`);
    } else if (els.length === 1) {
      e = els[0];
    } else {
      abort(`getEl "${selector}": multiple els found.`);
    }
  }
  console.log(`getEl "${selector}":`, e);
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
  console.log('updValEl: "' + oldVal + '" -> "' + newVal + '"', e);
  // Создаем и вызываем событие change
  const event = new Event('change', { bubbles: true });
  e.dispatchEvent(event);
  await sleep(delay);
}
