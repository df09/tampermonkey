function tmCopy(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text);
  } else {
    // fallback с document.execCommand
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      console.log('Fallback copy success');
    } catch (err) {
      return Promise.reject(err);
    }
    document.body.removeChild(textarea);
    return Promise.resolve();
  }
}
function camelCase(input){return input.split('/').map((w, i)=>i===0?w:w.charAt(0).toUpperCase()+w.slice(1)).join('');}
function tmHide(...els){els.forEach(e=>e.classList.add('tm-dnone'))};
function tmShow(...els){els.forEach(e=>e.classList.remove('tm-dnone'))};
// async
function sleep(ms, tickInterval = 1000) {
  return new Promise(resolve => {
    const start = Date.now();
    if (tickInterval !== false) console.log(`delay: 0ms / ${ms}ms`);
    function tick() {
      const elapsed = Date.now() - start;
      if (elapsed >= ms) {
        resolve();
      } else {
        if (tickInterval !== false) console.log(`delay: ${elapsed}ms / ${ms}ms`);
        setTimeout(tick, Math.min(tickInterval, ms - elapsed));
      }
    }
    if (tickInterval !== false) setTimeout(tick, tickInterval);
    setTimeout(resolve, ms);
  });
}
function waitFor(selector, condition) {
  console.log('waitFor: start..', selector);
  return new Promise(resolve => {
    const observer = new MutationObserver(() => {
      const e = document.querySelector(selector);
      if (e && condition(e)) {
        observer.disconnect();
        console.log('waitFor: done.', selector);
        resolve(e);
      }
    });
    // Проверяем сразу, если элемент уже в DOM и условие выполнено
    const eInitial = document.querySelector(selector);
    if (eInitial && condition(eInitial)) {
      console.log('waitFor: done.', selector);
      resolve(eInitial);
      return;
    }
    // Следим за изменениями в DOM
    observer.observe(document.body, { childList: true, subtree: true });
  });
}
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
async function redirect(newUrl) {
  window.location.href=newUrl;
}
async function fakeRedirect(newUrl, delay) {
  console.log('fakeRedirect(delay='+delay+'): "'+newUrl+'"');
  window.location.href = newUrl;
  await sleep(delay);
}
// DOM-manipulations
function addCls(e, ...cls){cls.forEach(c=>{if(!e.classList.contains(c)){e.classList.add(c)}})}
function remCls(e, ...cls){cls.forEach(c=>{if(e.classList.contains(c)){e.classList.remove(c)}})}
function remClsRegex(e, ...patterns) {
  const classesToRemove = [...e.classList].filter(cls =>
    patterns.some(pattern => new RegExp(pattern).test(cls))
  );
  classesToRemove.forEach(cls => e.classList.remove(cls));
}

function getEl(selector, pass=false) {
  // get by id
  if (/^#[a-zA-Z0-9\-_\.]+$/.test(selector)) {
    const e = document.getElementById(selector.slice(1));
    if (!e) {
      if (pass) {return false}
      tmUi.abort({
        title: 'helpers.getEl:',
        msg: '"'+selector+'" not found.'
      })
    }
    return e;
  }
  // get by any selector
  const els = document.querySelectorAll(selector);
  if (els.length === 0) {
    if (pass) {return false}
    tmUi.abort({
      title: 'helpers.getEl:',
      msg: '"'+selector+'" not found.'
    })
  }
  if (els.length > 1) {
    tmUi.abort({
      title: 'helpers.getEl:',
      msg: '"'+selector+'" multiple found.'
    })
  }
  e = els[0];
  console.log(selector, e);
  return e;
}
function getEls(selector, pass=false) {
  const els = document.querySelectorAll(selector);
  if (els.length === 0) {
    if (pass) { return false; }
    tmUi.abort({
      title: 'helpers.getEls:',
      msg: '"' + selector + '" not found.'
    });
  }
  console.log('getEls "' + selector + '":', els);
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
