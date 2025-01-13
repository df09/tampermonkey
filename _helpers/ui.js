function tmUiGetDisplay(...els){return els.map(e=>{return e.style.display})}
function tmUiBlock(...els){els.forEach(e=>{const e.style.display='block'})}
function tmUiFlex(...els){els.forEach(e=>{const e.style.display='flex'})}
function tmUiHide(...els){els.forEach(e=>{const e.style.display='none'})}
function tmUiToggleBlock(...els){els.forEach(e=>{const e.style.display=(e.style.display==='none')?'block':'none'}})}
function tmUiToggleFlex(...els){els.forEach(e=>{const e.style.display=(e.style.display==='none')?'flex':'none'}})}
function tmUiShowMain(){tmUiHide(getEl('#tm-prep'),getEl('#tm-execution'));tmUiFlex(getEl('#tm-minimize'),getEl('#tm-main'))}
function tmUiShowPrep(){tmUiHide(getEl('#tm-main'),getEl('#tm-execution'));tmUiFlex(getEl('#tm-minimize'),getEl('#tm-prep'))}
function tmUiShowExecution(){tmUiHide(getEl('#tm-minimize'),getEl('#tm-main'),getEl('#tm-prep'));tmUiFlex(getEl('#tm-execution'))}
function tmUiInitContainer() {
  // restore last size
  c.style.width = tmsGet('tm_keep_uiTextareaWidth') || c.style.width;
  c.style.height = tmsGet('tm_keep_uiTextareaHeight') || c.style.height;
  // resize
  let isResizing = false;
  let startX, startY, startWidth, startHeight;
  c.addEventListener("mousedown", (e) => {
    if (e.button !== 2) return; // Только правая кнопка мыши
    isResizing = true; startX = e.clientX; startY = e.clientY;
    startWidth = c.offsetWidth; startHeight = c.offsetHeight;
    document.body.style.userSelect = "none"; // Убираем выделение текста
  });
  document.addEventListener("mousemove", (e) => {
    if (!isResizing) return;
    const newWidth = startWidth - (e.clientX - startX);
    const newHeight = startHeight - (e.clientY - startY);
    c.style.width = `${Math.max(newWidth, 50)}px`; // Минимальная ширина
    c.style.height = `${Math.max(newHeight, 50)}px`; // Минимальная высота
  });
  document.addEventListener("mouseup", () => {
    if (isResizing) {
      isResizing = false;
      document.body.style.userSelect = "";
      tmsSet('tm_keep_uiTextareaWidth', c.style.width);
      tmsSet('tm_keep_uiTextareaHeight', c.style.height);
    }
  });
}
function tmUiInitOperation(operation) {
  // operation
  const e = getEl('#tm-operation');
  const txt = operation || 'None';
  const cls = txt === 'None'?'tm-green':'tm-red';
  let span = e.querySelector('span');
  span.textContent = txt;
  span.className = cls;
  // abort
  const abortSelector = '#tm-abort';
  const abortEl = getEl(abortSelector);
  abortEl.addEventListener('click',()=>{
    tmsDeleteAll();
    tmUiShowMain();
    abort('Execution aborted by user. All data was deleted from storage.');
  }
  if (operation) {tmUiFlex(getEl(abortSelector))}
}
function tmUiInitMinimize() {
  e = getEl('#tm-minimize');
  e.addEventListener('click',()=>{
    if (e.textContent='X') {
      const minimized = tmUiGetDisplay(getEl('#tm-main'))==='flex'?'#tm-main':'#tm-prep');
      tmsSet('tm_keep_minimized', minimized);
      tmUiHide(getEl(minimized));
    } else {
      const minimized = tmsGet('tm_keep_minimized');
      tmUiFlex(getEl(minimized));
      tmsDelete('tm_keep_minimized');
    }
    e.textContent='X'?'^':'X';
  }
}

function tmUiInitToggler(){
  // TODO
}
function tmUiInitBtnPrep(){
  // TODO
  e.addEventListener('click',()=>{tmUiShowPrep()})
}

function tmUiInitBtnExec(title, id, action, loc) {
    if (loc!=='main'&&loc!=='prep'){abort('tmUiInitBtnExec: invalid loc ("'+loc+'").')}
    const c = getEl(loc === 'main' ? '#tm-main-buttons' : '#tm-prep-body');
    const html = `<button id="${id.replace('#', '')}" class="tm-btn-r">${title}</button>`;
    // Заменяем существующую кнопку или добавляем новую
    const btn = c.querySelector(id);
    if(btn){btn.outerHTML=html}else{c.innerHTML+=html}
    // Добавляем обработчик событий к новой кнопке
    getEl(id).addEventListener('click', action);
}
function tmUiInitStorage() {
  // view
  getEl('#tm-storage-view').view.addEventListener('click',()=>{
    // populate the modal content
    const data = tmsGetAll();
    const contentEl = getEl('#modal-storage-view-content');
    contentEl.innerHTML = ''; // Clear any existing content
    data.forEach(key => {
      const value = localStorage.getItem(key);
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><button class="tm-storage-copy-row tm-btn-g" data-key="${key}">Copy</button></td>
        <td>${key}</td>
        <td>${value}</td>
      `;
      contentEl.appendChild(row);
    });
    // view-modal-copy-row
    contentEl.querySelectorAll('.tm-storage-copy-row').forEach(button => {
      button.addEventListener('click', (event) => {
        const key = event.target.getAttribute('data-key');
        const value = localStorage.getItem(key);
        navigator.clipboard.writeText(`${key}: ${value}`).then(() => {
          console.log(`Copied key-value pair: ${key}: ${value}`);
        }).catch(err => {
          console.error(`Failed to copy key-value pair: ${err}`);
        });
      });
    });
    // show
    tmUiBlock(getEl('#modal-storage-view'));
  });
  // view-modal-close
  getEl('#storage-close').addEventListener('click',()=>{tmUiHide(getEl('#modal-storage-view'))});
  // view-modal-copy-all
  getEl('#storage-copy-all').addEventListener('click',()=>{
    const allData = tmsGetAll().map(key => {
      const value = localStorage.getItem(key);
      return `${key}: ${value}`;
    }).join('\n');
    navigator.clipboard.writeText(allData).then(() => {
      console.log('Copied all key-value pairs to clipboard');
    }).catch(err => {
      console.error(`Failed to copy all key-value pairs: ${err}`);
    });
  });
  // reset
  getEl('#tm-storage-reset').addEventListener('click',()=>{
    tmsReset();alert('Storage.Reset: all non-premanent data was removed from storage.')
  });
  // clean
  getEl('#tm-storage-clean').addEventListener('click',()=>{
    tmsDeleteAll();alert('Storage.CLEAN: all data was deleted from storage.')
  });
}

function tmUiInitAction(){
  // TODO
}

function tmUiInitBack(){getEl('#tm-prep-back').addEventListener('click',()=>{tmUiShowMain()})}
function tmUiInitTextarea() {
  const e = getEl('#tm-prep-textarea');
  e.value = tmsGet('tm_keep_uiTextareaValue', '');
  e.addEventListener('input',()=>{tmsSet('tm_keep_uiTextareaValue',e.value)});
}
function tmUiInitCancelBtn() {
  getEl('#tm-execution-cancel').addEventListener('click',()=>{
    tmsReset();
    tmUiShowMain();
    alert('Execution canceled by user.');
  });
}

// TODO: notifications
function tmUiInit(inputs) {
  const operation = tmsGetOperation();
  // >>> container
  tmUiInitContainer();
  // >>> header
  tmUiInitOperation();
  tmUiInitMinimize();
  // >>> main
  // tmUiInitReadme(readme); TODO
  // for toggler in togglers: TODO
  //   tmUiInitToggler(toggler); TODO
  // for btnPrep in btnsPrep: TODO
    tmUiInitBtnPrep(title, id, 'main');
    tmUiInitBtnExec(title, id, action, 'prep');
  // for btnExec in btnsExec: TODO
    tmUiInitBtnExec(title, id, action, 'main');
  tmUiInitStorage();
  // >>> prep
    // action TODO
  tmUiInitBack();
  tmUiInitTextarea();
  // >>> execution
  tmUiInitCancelBtn();
  if (operation) {tmUiShowExecution()} else {tmUiShowMain()} // show menu
  console.log('tmUiInit: done.');
}

// pause
async function tmPause(msg) {
  const e = getEl('#tm-execution-continue');
  tmUiBlock(e);
  await sleep(100);
  alert('tmPause: '+msg);
  await new Promise(resolve => {
    e.onclick = resolve;
  });
  tmUiHide(e);
}
