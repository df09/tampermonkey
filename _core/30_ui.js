// header
const eContainer = getEl('#tm-container');
const eOperation = getEl('#tm-operation');
const eAbort = getEl('#tm-abort');
const eBack = getEl('#tm-back');
const eMinimize = getEl('#tm-minimize');
// main
const eMain = getEl('#tm-main');
const eMainReadme = getEl('#tm-main-readme');
const eMainHotkeys = getEl('#tm-main-hotkeys');
const eMainPrep = getEl('#tm-main-prep');
const eMainExec = getEl('#tm-main-exec');
const eMainStorage = getEl('#tm-main-storage');
const eMainStorageTitle = getEl('#tm-main-storage-title');
const eMainStorageBody = getEl('#tm-main-storage-body');
const eMainStorageBodyView = getEl('#tm-main-storage-view');
const eMainStorageBodyReset = getEl('#tm-main-storage-reset');
const eMainStorageBodyClean = getEl('#tm-main-storage-clean');
// prep
const ePrep = getEl('#tm-prep');
const ePrepTitle = getEl('#tm-prep-title');
const ePrepTextarea = getEl('#tm-prep-textarea');
// exec
const eExec = getEl('#tm-exec');
const eExecContinue = getEl('#tm-exec-continue');
const eExecCancel = getEl('#tm-exec-cancel');
// modal
const eModalHeader = getEl('#tm-modal-header');
const eModalHeaderTitle = getEl('#tm-modal-header-title');
const eModalHeaderClose = getEl('#tm-modal-header-close');
const eModalAlert = getEl('#tm-modal-alert');
const eModalAlertMsg = getEl('#tm-modal-alert-msg');
const eModalAlertOk = getEl('#tm-modal-alert-ok');
const eModalDialog = getEl('#tm-modal-dialog');
const eModalDialogMsg = getEl('#tm-modal-dialog-msg');
const eModalDialogInput = getEl('#tm-modal-dialog-input');
const eModalDialogTextarea = getEl('#tm-modal-dialog-textarea');
const eModalDialogSubmit = getEl('#tm-modal-dialog-submit');

// helpers
function mustache(template,vars){return template.replace(/{{(\w+)}}/g,(_,key)=>{return vars[key]||''})}
function tmAddCls(e, ...cls){cls.forEach(c=>{if(!e.classList.contains(c)){e.classList.add(c)}})}
function tmRemCls(e, ...cls){cls.forEach(c=>{if(e.classList.contains(c)){e.classList.remove(c)}})}
function tmUiHide(...els){els.forEach(e=>{e.classList.add('tm-dnone')})}
function tmUiShow(...els){els.forEach(e=>{e.classList.remove('tm-dnone')})}
function tmUiShowMain(){
  tmsSet('tm_keep_active_menu_id', eMain.id);
  tmUiRecalcHeader();
  if (tmsGet('tm_keep_minimized')) {
    tmRemCls(eMinimize,'tm-btn-r','tm-btn-header-r');
    tmAddCls(eMinimize,'tm-btn-b','tm-btn-header-b');
    eMinimize.textContent='^';
    tmUiShow(eMinimize);
    tmUiHide(eBack,eMain,ePrep,eExec);
  } else {
    tmRemCls(eMinimize,'tm-btn-b','tm-btn-header-b');
    tmAddCls(eMinimize,'tm-btn-r','tm-btn-header-r');
    eMinimize.textContent='X';
    // show
    tmUiShow(eMinimize,eMain);
    tmUiHide(eBack,ePrep,eExec);
  }
}
function tmUiShowPrep(){
  tmsSet('tm_keep_active_menu_id', ePrep.id);
  tmUiRecalcHeader();
  tmUiShow(eBack,ePrep);
  tmUiHide(eMinimize,eMain,eExec);
}
function tmUiShowExec(){
  tmsSet('tm_keep_active_menu_id', eExec.id);
  tmUiRecalcHeader();
  tmUiShow(eExec);
  tmUiHide(eBack,eMinimize,eMain,ePrep);
}
function makeResizable() {
  const activeId = tmsGet('tm_keep_active_menu_id');
  // Restore last size
  eContainer.style.width = tmsGet('tm_keep_uiWidth_' + activeId) || eContainer.style.width;
  eContainer.style.height = tmsGet('tm_keep_uiHeight_' + activeId) || eContainer.style.height;
  // Resize
  let isResizing = false;
  let startX, startY, startWidth, startHeight;
  eContainer.addEventListener("mousedown", (e) => {
    if (e.target.matches("button, input, textarea, .tm-slider")) return; // Skip excluded elements
    if (e.button !== 0) return; // Only left mouse button
    isResizing = true;
    startX = e.clientX;
    startY = e.clientY;
    startWidth = eContainer.offsetWidth;
    startHeight = eContainer.offsetHeight;
    document.body.style.userSelect = "none"; // Disable text selection
  });
  document.addEventListener("mousemove", (e) => {
    if (!isResizing) return;
    let newWidth = startWidth - (e.clientX - startX);
    let newHeight = startHeight - (e.clientY - startY);
    // Apply size with constraints
    eContainer.style.width = Math.max(newWidth, 300)+'px'; // Minimum width 300px
    eContainer.style.height = Math.max(newHeight, 50)+'px'; // Minimum height 50px
  });
  document.addEventListener("mouseup", () => {
    if (isResizing) {
      isResizing = false;
      document.body.style.userSelect = "";
      tmsSet('tm_keep_uiWidth_' + activeId, eContainer.style.width);
      tmsSet('tm_keep_uiHeight_' + activeId, eContainerc.style.height);
    }
  });
}
// container
function tmUiContainer(){makeResizable()}
// header
function tmUiRecalcHeader() {
  let operation = tmsGetOperation(); let txt = operation || 'None';
  let eSpan = eOperation.querySelector('span');
  // reacalc operation
  eSpan.textContent = txt;
  if (txt === 'None') {
    tmRemCls(eSpan,'tm-y');tmRemCls(eOperation,'tm-border-y');
    tmRemCls(eSpan,'tm-r');tmRemCls(eOperation,'tm-border-r');
    tmAddCls(eSpan,'tm-w');tmAddCls(eOperation,'tm-border-w');
  } else {
    tmRemCls(eSpan,'tm-y');tmRemCls(eOperation,'tm-border-y');
    tmRemCls(eSpan,'tm-w');tmRemCls(eOperation,'tm-border-w');
    tmAddCls(eSpan,'tm-r');tmAddCls(eOperation,'tm-border-r');
  }
  if (operation) {tmUiShow(eAbort)} else {tmUiHide(eAbort)}
}
function tmUiInitAbortBtn(){eAbort.addEventListener('click',()=>{tmUiAbort('Exec aborted by user. All data was deleted from storage.')})}
function tmUiInitBack(){eBack.addEventListener('click',()=>{tmUiShowMain()})}
function tmUiInitMinimize() {
  eMinimize.addEventListener('click',()=>{
    if (eMinimize.textContent === 'X') {
      tmsSet('tm_keep_minimized', 1);
      tmRemCls(eMinimize,'tm-btn-r','tm-btn-header-r');
      tmAddCls(eMinimize,'tm-btn-b','tm-btn-header-b');
      eMinimize.textContent='^';
      tmUiHide(eMain);
    } else {
      tmsDelete('tm_keep_minimized');
      tmRemCls(eMinimize,'tm-btn-b','tm-btn-header-b');
      tmAddCls(eMinimize,'tm-btn-r','tm-btn-header-r');
      eMinimize.textContent='X';
      tmUiShow(eMain);
    }
  })
}
// main
function tmUiInitMain(){}
function tmUiInitReadme(link){eMainReadme.querySelector('a').href=link}
function getKey(keys,n) {
  const k = keys.split('+')[n];
  if (k === 'Shift') return event.shiftKey;
  if (k === 'Ctrl') return event.ctrlKey;
  if (k === 'Alt') return event.altKey;
  if (k === 'Meta') return event.metaKey;
  return event.k === k;
}
function tmUiInitHotkeys(data) {
  let [idsfx, name, keys, action] = data;
  let id = 'tm-main-hotkeys-' + idsfx;
  eMainHotkeys.insertAdjacentHTML('beforeend',mustache(
    tmHTMLMainHotkeysHotkey, {id:id, name:name, keys:keys}
  ));
  // event
  let checkbox = getEl('#'+id+' input[type="checkbox"]');
  checkbox.addEventListener('change', function () {
    if (checkbox.checked) {
      console.log(id+': ON');
      tmsSet('tm_keep_hotkey-'+idsfx, '1')
      function hotkeyHandler(event){if(getKey(keys,0)&&getKey(keys,1)){action()}}
      checkbox.hotkeyHandler = hotkeyHandler;
      document.addEventListener('keydown', hotkeyHandler);
    } else {
      console.log(id+': OFF');
      tmsDelete('tm_keep_hotkey-'+idsfx)
      if (checkbox.hotkeyHandler) {
        document.removeEventListener('keydown', checkbox.hotkeyHandler);
        checkbox.hotkeyHandler = null;
      }
    }
  });
  // user settings
  if (tmsGet('tm_keep_hotkey-' + idsfx) === '1') {
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change'));
  }
  // show
  tmUiShow(eMainHotkeys);
}
// main.buttons
function tmUiInitBtnPrep(data) {
  let [idsfx, title, action] = data;
  let mainId = 'tm-main-prep-'+idsfx;
  let prepId = 'tm-prep-exec-'+idsfx;
  // insert
  eMainPrep.insertAdjacentHTML('beforeend',mustache(tmHTMLMainPrep,{id:mainId,title:title}));
  ePrep.insertAdjacentHTML('beforeend',mustache(tmHTMLPrepExec,{id:prepId}));
  // event
  getEl('#'+mainId).addEventListener('click', () => {
    ePrepTitle.textContent = title;
    ePrepTextarea.value = tmsGet('tm_keep_uiTextareaValue_'+idsfx, '');
    // Скрываем другие EXEC кнопки
    getEls('.tm-group-prep-exec').forEach(e => tmUiHide(e));
    // Показ текущей EXEC кнопки
    let prepExec = getEl('#'+prepId);
    tmUiShow(prepExec);
    prepExec.addEventListener('click', () => {
      tmsSet('tm_keep_uiTextareaValue_'+idsfx, ePrepTextarea.value);
      tmUiShowExec();
      action();
    });
    tmUiShowPrep();
  });
  // show
  tmUiShow(eMainPrep);
}
function tmUiInitBtnExec(data) {
  let [idsfx, title, action] = data;
  let id = 'tm-main-exec-'+idsfx;
  eMainExec.insertAdjacentHTML('beforeend',mustache(tmHTMLMainExec,{id:id,title:title}));
  getEl('#'+id).addEventListener('click',()=>{tmUiShowExec();action()});
  tmUiShow(eMainExec);
}
// main.storage
function tmUiInitStorageView() {
  function prepareContent() {
    eModal.insertAdjacentHTML('beforeend', tmHTMLModalStorageview);
    const data = tmsGetAll();
    const eContent = eModal.lastElementChild;
    const eTbody = eContent.querySelector('tbody');
    // insert
    eTbody.innerHTML = '';
    data.forEach(k=>{eTbody.insertAdjacentHTML('beforeend',mustache(
      tmHTMLModalStorageviewRow, {key:k, value:tmsGet(k)}
    ))});
    // events
    getEls('.tm-modal-storageview-row-copy').forEach(e=>{
      e.addEventListener('click',(event)=>{
        const value = event.target.getAttribute('data-value');
        navigator.clipboard.writeText(value)
          .then(() => { console.log(`Copied: ${value}`); })
          .catch(e => { console.error(`Failed to copy value: ${e}`); });
      });
    });
    getEl('#tm-modal-storageview-copyall').addEventListener('click',()=>{
      const allData = data.map(k=>{const v=tmsGet(k);return k+': '+v}).join('\n');
      navigator.clipboard.writeText(allData)
        .then(() => {console.log('Copied all key-value to clipboard')})
        .catch(e => {console.error(`Failed to copy all key-value: ${e}`)})
    });
  }
  // click view
  eMainStorageBodyView.addEventListener('click', () => {
    // modal
    ModalManager.buildContent({
      idsfx: 'storage-view', accent: 'info',
      title: 'Storage View',
      actionPrepareContent: prepareContent,
      actionClose:()=>{},
    });
  });
}
function tmUiInitStorageReset() {
  eMainStorageBodyReset.addEventListener('click',()=>{
    // reset
    tmsReset();
    tmUiRecalcHeader();
    // modal
    ModalManager.buildAlert({
      accent: 'warning', title: 'Storage Reset',
      msg: 'All non-premanent data has been removed from storage.',
      actionClose:()=>{},
    });
    tmUiShow(getEl('#tm-modal-content-storage-view'));
  });
}
function tmUiInitStorageClean() {
  eMainStorageBodyClean.addEventListener('click',()=>{
    // clean
    tmsDeleteAll();
    tmUiRecalcHeader();
    // modal
    ModalManager.buildAlert({
      accent: 'error', title: 'Storage CLEAN',
      msg: 'ALL DATA has been deleted from storage.',
      actionClose:()=>{},
    });
  });
}
// prep
function tmUiInitPrep(){}
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
  if (tmsGetOperation()) {
    tmUiShowExec();
  } else {
    tmUiShowMain();
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
