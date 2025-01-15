// helpers
function tmUiGetDisplay(...els){return els.map(el=>{return el.style.display})}
function tmUiBlock(...els){els.forEach(el=>{const el.style.display='block'})}
function tmUiFlex(...els){els.forEach(el=>{const el.style.display='flex'})}
function tmUiHide(...els){els.forEach(el=>{const el.style.display='none'})}
function tmUiToggleBlock(...els){els.forEach(el=>{const el.style.display=(el.style.display==='none')?'block':'none'}})}
function tmUiToggleFlex(...els){els.forEach(el=>{const el.style.display=(el.style.display==='none')?'flex':'none'}})}
function tmUiShowMain(){tmUiHide(getEl('#tm-prep'),getEl('#tm-execution'));tmUiFlex(getEl('#tm-minimize'),getEl('#tm-main'))}
function tmUiShowPrep(){tmUiHide(getEl('#tm-main'),getEl('#tm-execution'));tmUiFlex(getEl('#tm-minimize'),getEl('#tm-prep'))}
function tmUiShowExecution(){tmUiHide(getEl('#tm-minimize'),getEl('#tm-main'),getEl('#tm-prep'));tmUiFlex(getEl('#tm-execution'))}
// container
function tmUiInitContainer() {
  const c = getEl('#tm-container');
  // restore last size
  c.style.width = tmsGet('tm_keep_uiWidth') || c.style.width;
  c.style.height = tmsGet('tm_keep_uiHeight') || c.style.height;
  // resize
  let isResizing = false;
  let startX, startY, startWidth, startHeight;
  c.addEventListener("mousedown", (el) => {
    if (el.button !== 2) return; // Только правая кнопка мыши
    isResizing = true; startX = el.clientX; startY = el.clientY;
    startWidth = c.offsetWidth; startHeight = c.offsetHeight;
    document.body.style.userSelect = "none"; // Убираем выделение текста
  });
  document.addEventListener("mousemove", (el) => {
    if (!isResizing) return;
    const newWidth = startWidth - (el.clientX - startX);
    const newHeight = startHeight - (el.clientY - startY);
    c.style.width = `${Math.max(newWidth, 50)}px`; // Минимальная ширина
    c.style.height = `${Math.max(newHeight, 50)}px`; // Минимальная высота
  });
  document.addEventListener("mouseup", () => {
    if (isResizing) {
      isResizing = false;
      document.body.style.userSelect = "";
      tmsSet('tm_keep_uiWidth', c.style.width);
      tmsSet('tm_keep_uiHeight', c.style.height);
    }
  });
}
// header
function tmUiInitOperation(operation) {
  const el = getEl('#tm-operation');
  const txt = operation || 'None';
  const cls = txt === 'None'?'tm-green':'tm-red';
  let span = el.querySelector('span');
  span.textContent = txt;
  span.className = cls;
}
function tmUiInitAbort(operation) {
  const el = getEl('#tm-abort');
  el.addEventListener('click',()=>{ tmsDeleteAll(); tmUiShowMain();
    abort('Execution aborted by user. All data was deleted from storage.');
  }
  if (operation) {tmUiFlex(el)}
}
function tmUiInitMinimize() {
  el = getEl('#tm-minimize');
  el.addEventListener('click',()=>{
    if (el.textContent='X') {
      const minimized = tmUiGetDisplay(getEl('#tm-main'))==='flex'?'#tm-main':'#tm-prep');
      tmsSet('tm_keep_minimized', minimized);
      tmUiHide(getEl(minimized));
    } else {
      tmUiFlex(getEl(tmsGet('tm_keep_minimized')));
      tmsDelete('tm_keep_minimized');
    }
    el.textContent='X'?'^':'X';
  }
}
// main
function tmUiInitReadme(link){getEl('#tm-main-readme a').href=link}
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
        <td>${key}</td>
        <td>
          <button class="tm-storage-copy-row tm-btn-g" data-value="${value}">Copy</button>
          <span class="tm-storage-value">${value}</span>
        </td>
      `;
      contentEl.appendChild(row);
    });
    // view-modal-copy-row
    getEls('.tm-storage-copy-row').forEach(el => {
      el.addEventListener('click',(event)=>{
        const value = event.target.getAttribute('data-value');
        navigator.clipboard.writeText(value)
          .then(() => { console.log(`Copied: ${value}`); })
          .catch(e => { console.error(`Failed to copy value: ${e}`); });
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
    }).catch(e =>{abort(`Failed to copy all key-value pairs: ${e}`)});
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
function tmUiInitBack(){getEl('#tm-prep-back').addEventListener('click',()=>{tmUiShowMain()})}
function tmUiInitBtnCancel() {
  getEl('#tm-execution-cancel').addEventListener('click',()=>{
    tmsReset();tmUiShowMain();alert('Execution canceled by user.');
  });
}

// >>> data-related
// thumbler
function tmUiInitThumbler(data) {
  const [idpfx, title, hotkey, action] = data;
  // TODO: replace fake action by real
  const action = (state) => console.log(`Action executed with state: ${state}`)
  const id = 'tm-thmb-'+idpfx;
  getEl('#tm-main-thumblers').innerHTML+=`
    <div id="${id}" class="tm-row">
      <h3 class="thumbler-title">${title}<span>(${hotkey})</span></h3>
      <label class="switch">
        <input type="checkbox">
        <span class="slider"></span>
      </label>
    <div>
  `;
  const checkbox = getEl(`#${id} input`);
  checkbox.addEventListener('change', (event) => {
    if (event.target.checked) {
      console.log('Switch is ON');
      // Активировать действие при включении
    } else {
      console.log('Switch is OFF');
      // Отключить действие при выключении
    }
  });
  // Добавляем глобальный обработчик клавиш
  document.addEventListener('keydown', (event) => {
    if (event.shiftKey && event.key.toLowerCase() === 'j') {
      if (checkbox.checked) {
        console.log('Action triggered for Shift+J (Switch ON)');
        action('on'); // Выполнение переданного действия, если оно включено
      } else {
        console.log('Action triggered for Shift+J (Switch OFF)');
        action('off'); // Выполнение переданного действия, если оно выключено
      }
    }
  });
}
// btnPrep
function tmUiInitBtnPrep(data) {
  const [idpfx, title, action] = data;
  const cMain = getEl('#tm-main-btns-prep');
  const cPrep = getEl('#tm-prep-body');
  const mainGroupClass = 'tm-main-btn-prep';
  const prepGroupClass = 'tm-prep-btn-exec';
  const mainId = `#${mainGroupClass}-${idpfx}`;
  const prepId = `#${prepGroupClass}-${idpfx}`;
  // btnPrep, btnExec - create
  cMain.innerHTML+=`<button id="${mainId}" class="tm-btn-g ${mainGroupClass}">${title}</button>`;
  cPrep.innerHTML+=`<button id="${prepId}" class="tm-btn-r ${prepGroupClass}">EXEC</button>`;
  // btnPrep - click
  getEl(`#${mainId}`).addEventListener('click',()=>{
    // prep - title
    getEl('#tm-prep-title').textContent = title;
    // prep - textarea
    const textarea = getEl('#tm-prep-textarea');
    textarea.value = tmsGet(`tm_keep_uiTextareaValue_${idpfx}`,'');
    el.addEventListener('input',()=>{tmsSet(`tm_keep_uiTextareaValue_${idpfx}`,el.value)});
    // prep - exec
    getEls(groupClass).forEach(el=>{tmUiHide(el)}); // hide all exec buttons
    const prepExec = getEl(`#${prepId}`);
    prepExec.addEventListener('click',()=>{tmUiShowExec();action()});
    tmUiFlex(prepExec);
    // show prep menu
    tmUiShowPrep();
  }
}
// btnExec
function tmUiInitBtnExec(data) {
  const [idpfx, title, action] = data;
  const groupClass = 'tm-main-btn-exec';
  const id = `#${groupClass}-${idpfx}`;
  getEl('#tm-main-btns-exec').innerHTML+=`<button id="${id}" class="tm-btn-g ${groupClass}">EXEC:${title}</button>`;
  getEl(`#${id}`).addEventListener('click',()=>{tmUiShowExec();action()}
}

// TODO: notifications
function tmUiInit(map) {
  const operation = tmsGetOperation();
  // container
  tmUiInitContainer();
  // header
  tmUiInitOperation(operation);
  tmUiInitAbort(operation);
  tmUiInitMinimize();
  // main
  tmUiInitReadme(map.readme);
  for (const data of map.thumblers){tmUiInitThumbler(data)}
  for (const data of map.btnsPrep){tmUiInitBtnPrep(data)}
  for (const data of map.btnsExec){tmUiInitBtnExec(data)}
  tmUiInitStorage();
  // prep
  tmUiInitBack();
  // exec
  tmUiInitBtnCancel();
  // show
  if (operation) {tmUiShowExecution()} else {tmUiShowMain()} // show menu
  console.log('tmUiInit: done.');
}

// pause
async function tmPause(msg) {
  const el = getEl('#tm-execution-continue');
  tmUiBlock(el);
  await sleep(100);
  alert('tmPause: '+msg);
  await new Promise(resolve => {
    el.onclick = resolve;
  });
  tmUiHide(el);
}
