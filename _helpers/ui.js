// vars
const eContainer = getEl('#tm-container');
// vars.header
const eOperation = getEl('#tm-operation');
const eAbort = getEl('#tm-abort');
const eBack = getEl('#tm-back');
const eMinimize = getEl('#tm-minimize');
// vars.main
const eMain = getEl('#tm-main');
const eMainReadme = getEl('#tm-main-readme');
const eMainHotkeys = getEl('#tm-main-hotkeys');
const eMainPrep = getEl('#tm-main-prep');
const eMainExec = getEl('#tm-main-exec');
const eMainStorage = getEl('#tm-main-storage');
const eMainStorageBody = getEl('#tm-main-storage-body');
const eMainStorageBodyView = getEl('#tm-main-storage-body-view');
const eMainStorageBodyReset = getEl('#tm-main-storage-body-reset');
const eMainStorageBodyClean = getEl('#tm-main-storage-body-clean');
// vars.prep
const ePrep = getEl('#tm-prep');
const ePrepTitle = getEl('#tm-prep-title');
const ePrepTextarea = getEl('#tm-prep-textarea');
// vars.exec
const eExec = getEl('#tm-exec');
const eExecContinue = getEl('#tm-exec-continue');
const eExecCancel = getEl('#tm-exec-cancel');

// helpers
function tmAddCls(e, ...cls){cls.forEach(c=>{if(!e.classList.contains(c)){e.classList.add(c)}})}
function tmRemCls(e, ...cls){cls.forEach(c=>{if(e.classList.contains(c)){e.classList.remove(c)}})}
function tmUiHide(...els){els.forEach(e=>{e.classList.add('tm-dnone')})}
function tmUiShow(...els){els.forEach(e=>{e.classList.remove('tm-dnone')})}
function tmUiShowMain(){
  tmUiRecalcHeader();
  tmUiShow(eMinimize,eMain);
  tmUiHide(eBack,ePrep,eExec);
}
function tmUiShowPrep(){
  tmUiRecalcHeader();
  tmUiShow(eBack,ePrep);
  tmUiHide(eMinimize,eMain,eExec);
}
function tmUiShowExec(){
  tmUiRecalcHeader();
  tmUiShow(eExec);
  tmUiHide(eBack,eMinimize,eMain,ePrep);
}
function makeResizebale(c) {
  // Restore last size
  c.style.width = tmsGet('tm_keep_uiWidth_' + c.id) || c.style.width;
  c.style.height = tmsGet('tm_keep_uiHeight_' + c.id) || c.style.height;
  // Resize
  let isResizing = false;
  let startX, startY, startWidth, startHeight;
  c.addEventListener("mousedown", (e) => {
    if (e.target.matches("button, input, textarea, .tm-slider")) return; // Skip excluded elements
    if (e.button !== 0) return; // Only left mouse button
    isResizing = true;
    startX = e.clientX;
    startY = e.clientY;
    startWidth = c.offsetWidth;
    startHeight = c.offsetHeight;
    document.body.style.userSelect = "none"; // Disable text selection
  });
  document.addEventListener("mousemove", (e) => {
    if (!isResizing) return;
    let newWidth = startWidth - (e.clientX - startX);
    let newHeight = startHeight - (e.clientY - startY);
    c.style.width = `${Math.max(newWidth, 50)}px`; // Minimum width
    c.style.height = `${Math.max(newHeight, 50)}px`; // Minimum height
  });
  document.addEventListener("mouseup", () => {
    if (isResizing) {
      isResizing = false;
      document.body.style.userSelect = "";
      tmsSet('tm_keep_uiWidth_' + c.id, c.style.width);
      tmsSet('tm_keep_uiHeight_' + c.id, c.style.height);
    }
  });
}
// container
// header
function tmUiRecalcHeader() {
  let operation = tmsGetOperation(); let txt = operation || 'None';
  let eSpan = eOperation.querySelector('span');
  // upd
  eSpan.textContent = txt;
  if (txt === 'None') {
    tmAddCls(eSpan,'tm-g');tmAddCls(eOperation,'tm-border-g');
    tmRemCls(eSpan,'tm-r');tmRemCls(eOperation,'tm-border-r');
  } else {
    tmAddCls(eSpan,'tm-r');tmAddCls(eOperation,'tm-border-r');
    tmRemCls(eSpan,'tm-g');tmRemCls(eOperation,'tm-border-g');
  }
  if (operation) {tmUiShow(eAbort)} else {tmUiHide(eAbort)}
}
function tmUiInitAbortBtn(){eAbort.addEventListener('click',()=>{tmUiAbort('Exec aborted by user. All data was deleted from storage.')})}
function tmUiInitBack(){eBack.addEventListener('click',()=>{tmUiShowMain()})}
function tmUiInitMinimize() {
  eMinimize.addEventListener('click',()=>{
    if (eMinimize.textContent === 'X') {
      tmsSet('tm_keep_minimized', 1);
      eMinimize.textContent='^';
      tmUiHide(eMain);
    } else {
      tmsDelete('tm_keep_minimized');
      eMinimize.textContent='X';
      tmUiShow(eMain);
    }
  })
}
// main
function tmUiInitMain() {makeResizebale(eMain)}
function tmUiInitReadme(link){eMainReadme.querySelector('a').href=link}
function getKey(hotkey,n) {
  const key = hotkey.split('+')[n];
  if (key === 'Shift') return event.shiftKey;
  if (key === 'Ctrl') return event.ctrlKey;
  if (key === 'Alt') return event.altKey;
  if (key === 'Meta') return event.metaKey;
  return event.key === key;
}
function tmUiInitHotkeys(data) {
  let [idpfx, title, hotkey, action] = data;
  let id = 'tm-hotkey-' + idpfx;
  let groupClass = 'tm-group-hotkey';
  // Добавляем hotkey в HTML
  eMainHotkeys.insertAdjacentHTML('beforeend', `
    <div id="${id}" class="tm-row ${groupClass}">
      <h3 id="tm-hotkey-title" class="tm-row tm-title"><span>${title}</span><span class="tm-hotkey-keys">(${hotkey})</span></h3>
      <label class="tm-hotkey-switch tm-ml0 tm-mb0">
        <input type="checkbox">
        <span class="tm-hotkey-slider"></span>
      </label>
    </div>
  `);
  // event
  let checkbox = getEl('#'+id+' input[type="checkbox"]');
  checkbox.addEventListener('change', function () {
    if (checkbox.checked) {
      console.log(id+': ON');
      tmsSet('tm_keep_hotkey-'+idpfx, '1')
      function hotkeyHandler(event){if(getKey(hotkey,0)&&getKey(hotkey,1)){action()}}
      checkbox.hotkeyHandler = hotkeyHandler;
      document.addEventListener('keydown', hotkeyHandler);
    } else {
      console.log(id+': OFF');
      tmsDelete('tm_keep_hotkey-'+idpfx)
      if (checkbox.hotkeyHandler) {
        document.removeEventListener('keydown', checkbox.hotkeyHandler);
        checkbox.hotkeyHandler = null;
      }
    }
  });
  // user settings
  if (tmsGet('tm_keep_hotkey-' + idpfx) === '1') {
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change'));
  }
  // show
  tmUiShow(eMainHotkeys);
}
// main.buttons
function tmUiInitBtnPrep(data) {
  let [idpfx, title, action] = data;
  let mainGroupClass = 'tm-group-main-prep';
  let prepGroupClass = 'tm-group-prep-exec';
  let mainId = mainGroupClass+'-'+idpfx;
  let prepId = prepGroupClass+'-'+idpfx;
  // html
  eMainPrep.insertAdjacentHTML(
    'beforeend',
    `<button id="${mainId}" class="${mainGroupClass} tm-btn-g">${title} -&gt;</button>`
  );
  ePrep.insertAdjacentHTML(
    'beforeend',
    `<button id="${prepId}" class="${prepGroupClass} tm-btn-r">EXEC</button>`
  );
  // event
  getEl('#'+mainId).addEventListener('click', () => {
    ePrepTitle.textContent = title;
    ePrepTextarea.value = tmsGet('tm_keep_uiTextareaValue_'+idpfx, '');
    // Скрываем другие EXEC кнопки
    getEls('.'+prepGroupClass).forEach(e => tmUiHide(e));
    // Показ текущей EXEC кнопки
    let prepExec = getEl('#'+prepId);
    tmUiShow(prepExec);
    prepExec.addEventListener('click', () => {
      tmsSet('tm_keep_uiTextareaValue_'+idpfx, ePrepTextarea.value);
      tmUiShowExec();
      action();
    });
    tmUiShowPrep();
  });
  // show
  tmUiShow(eMainPrep);
}
function tmUiInitBtnExec(data) {
  let [idpfx, title, action] = data;
  let groupClass = 'tm-group-main-exec';
  let id = 'tm-main-exec-'+idpfx;
  // html
  eMainExec.insertAdjacentHTML(
    'beforeend',
    `<button id="${id}" class="${groupClass} tm-btn-y">EXEC: ${title}</button>`
  );
  // event
  let button = getEl('#'+id);
  button.addEventListener('click', () => {
    tmUiShowExec();
    action();
  });
  // show
  tmUiShow(eMainExec);
}
// main.storage
// TODO: migrate to ModalManager
function tmUiInitStorageView() {
  // Инициализация кнопки для отображения модального окна
  eMainStorageBodyView.addEventListener('click', () => {
    // Заполняем содержимое модального окна
    const data = tmsGetAll(); // Получаем все ключи
    const contentEl = getEl('#tm-modal-storage-view-content'); // Контейнер для строк
    contentEl.innerHTML = ''; // Очищаем существующее содержимое
    // Создаем строки для каждого ключа
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
    // Добавляем обработчики событий для кнопок Copy после их создания
    getEls('.tm-storage-copy-row').forEach(e => {
      e.addEventListener('click', (event) => {
        const value = event.target.getAttribute('data-value');
        navigator.clipboard.writeText(value)
          .then(() => { console.log(`Copied: ${value}`); })
          .catch(e => { console.error(`Failed to copy value: ${e}`); });
      });
    });
    // Показываем модальное окно
    tmUiShow(getEl('#tm-modal-storage-view'));
  });
  // Копирование всех ключей и значений
  getEl('#tm-storage-copy-all').addEventListener('click', () => {
    const allData = tmsGetAll().map(key => {
      const value = localStorage.getItem(key);
      return `${key}: ${value}`;
    }).join('\n');
    navigator.clipboard.writeText(allData)
      .then(() => {
        console.log('Copied all key-value to clipboard');
      })
      .catch(e => {
        console.error(`Failed to copy all key-value: ${e}`);
      });
  });
}
function tmUiInitStorageReset() {
  eMainStorageBodyReset.addEventListener('click',()=>{
    tmsReset();
    tmUiRecalcHeader();
    ModalManager.buildAlert({
      accent: 'warning',
      title: 'Storage.Reset',
      msg: 'all non-premanent data was removed from storage.',
      actionClose: ()=>{},
    });
  });
}
function tmUiInitStorageClean() {
  eMainStorageBodyClean.addEventListener('click',()=>{
    tmsDeleteAll();
    tmUiRecalcHeader();
    ModalManager.buildAlert({
      accent: 'error',
      title: 'Storage.CLEAN',
      msg: 'all data was deleted from storage.',
      actionClose: ()=>{},
    });
  });
}
// prep
function tmUiInitPrep(){makeResizebale(ePrep)}
async function tmUiPause(msg) {
  tmUiShow(eExecContinue);
  ModalManager.buildAlert({
    accent: 'warning',
    title: 'tmUiPause',
    msg: msg,
    actionClose: ()=>{},
  });
  await new Promise(resolve => {
    eExecContinue.onclick = resolve;
  });
  tmUiHide(eExecContinue);
}
// exec
function tmUiInitBtnCancel(){eExecCancel.addEventListener('click',()=>{tmUiReset('Exec canceled by user.')})}

// === init ==============================
function tmUiInit(map) {
  let operation = tmsGetOperation();
  // header
  tmUiInitAbortBtn();
  tmUiInitBack();
  tmUiInitMinimize();
  // main
  tmUiInitMain();
  tmUiInitReadme(map.readme);
  for (let data of map.hotkeys){tmUiInitHotkeys(data)}
  for (let data of map.btnsPrep){tmUiInitBtnPrep(data)}
  for (let data of map.btnsExec){tmUiInitBtnExec(data)}
  tmUiInitStorageView();
  tmUiInitStorageClean();
  tmUiInitStorageReset();
  // prep
  tmUiInitPrep();
  // exec
  tmUiInitBtnCancel();
  // show
  if (operation) {
    tmUiShowExec();
  } else {
    tmUiShowMain();
    // minimize - user settings
    if (tmsGet('tm_keep_minimized')) {
      tmUiHide(eMain);
      eMinimize.textContent='^';
    } else {
      tmUiShow(eMain);
    }
  }
  console.log('tmUiInit: done.');
}
// abort/reset
function tmUiAbort(...args) {
  console.log('tmUiAbort: init..')
  tmsDeleteAll(); // clean storage
  tmUiShowMain();
  abort(...args);
}
function tmUiReset(...args) {
  console.log('tmUiReset: init..');
  tmsReset();
  tmUiShowMain();
  // Если есть аргументы, формируем сообщение и вызываем alert
  if (args.length > 0) {
    const joinedArgs = args.map(arg =>
      typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
    ).join(' ');
    ModalManager.buildAlert({
      accent: 'warning',
      title: 'tmUiReset',
      msg: joinedArgs,
      actionClose: ()=>{},
    });
  }
  console.log('tmUiReset: done.');
}
function tmStart(actionName) {
  tmsSetOperation(actionName+'/start');
  tmUiShowExec();
}
