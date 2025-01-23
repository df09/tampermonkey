// === vars ====================================
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
const eModalOverlay = getEl('#tm-modal-overlay');
const eModal = getEl('#tm-modal');
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

// === helpers ==============================
function tmUiHide(...els){els.forEach(e=>{e.classList.add('tm-dnone')})}
function tmUiShow(...els){els.forEach(e=>{e.classList.remove('tm-dnone')})}
function tmUiShowMain(){
  tmsSet('tm_keep_active_menu_id', eMain.id);
  tmUiRecalcHeader();tmUiRecalcSize();
  // minimize
  if (tmsGet('tm_keep_minimized')) {
    remCls(eMinimize,'tm-btn-r','tm-btn-header-r');
    addCls(eMinimize,'tm-btn-b','tm-btn-header-b');
    eMinimize.textContent='^';
    tmUiShow(eMinimize);
    tmUiHide(eBack,eMain,ePrep,eExec);
  } else {
    remCls(eMinimize,'tm-btn-b','tm-btn-header-b');
    addCls(eMinimize,'tm-btn-r','tm-btn-header-r');
    eMinimize.textContent='X';
    // show
    tmUiShow(eMinimize,eMain);
    tmUiHide(eBack,ePrep,eExec);
  }
}
function tmUiShowPrep(){
  tmsSet('tm_keep_active_menu_id', ePrep.id);
  tmUiRecalcHeader();tmUiRecalcSize();
  // show
  tmUiShow(eBack,ePrep);
  tmUiHide(eMinimize,eMain,eExec);
}
function tmUiShowExec(){
  tmsSet('tm_keep_active_menu_id', eExec.id);
  tmUiRecalcHeader();tmUiRecalcSize();
  tmUiShow(eExec);
  tmUiHide(eBack,eMinimize,eMain,ePrep);
}
function tmUiRecalcSize() {
  const activeId = tmsGet('tm_keep_active_menu_id');
  eContainer.style.width = tmsGet('tm_keep_uiWidth_'+activeId);
  eContainer.style.height = tmsGet('tm_keep_uiHeight_'+activeId);
}
function tmUiRecalcHeader() {
  const operation = tmsGetOperation(); const txt = operation || 'None';
  const eSpan = eOperation.querySelector('span');
  eSpan.textContent = txt;
  if (txt === 'None') {
    addCls(eOperation,'tm-border-w');remCls(eOperation,'tm-border-y','tm-border-r');
    addCls(eSpan,'tm-w');remCls(eSpan,'tm-y','tm-r');
  } else {
    addCls(eOperation,'tm-border-r');remCls(eOperation,'tm-border-y','tm-border-w');
    addCls(eSpan,'tm-r');remCls(eSpan,'tm-y','tm-w');
  }
  if (operation) {tmUiShow(eAbort)} else {tmUiHide(eAbort)}
}

// === init functions ==============================
function tmUiInitContainer() {
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
    const newWidth = startWidth - (e.clientX - startX);
    const newHeight = startHeight - (e.clientY - startY);
    // Apply size with constraints
    eContainer.style.width = Math.max(newWidth, parseFloat(getComputedStyle(eContainer).minWidth))+'px'; // Minimum width 300px
    eContainer.style.height = Math.max(newHeight, parseFloat(getComputedStyle(eContainer).minHeight))+'px'; // Minimum height 50px
  });
  document.addEventListener("mouseup", () => {
    if (isResizing) {
      isResizing = false;
      document.body.style.userSelect = "";
      const activeId = tmsGet('tm_keep_active_menu_id');
      tmsSet('tm_keep_uiWidth_'+activeId, eContainer.style.width);
      tmsSet('tm_keep_uiHeight_'+activeId, eContainer.style.height);
    }
  });
}
function tmUiInitHeaderAbort(){eAbort.addEventListener('click',()=>{
  tmUiAbort('Exec aborted by user. All data was deleted from storage.')
})}
function tmUiInitHeaderBack(){
  eBack.addEventListener('click',()=>{
    tmUiShowMain()})
}
function tmUiInitHeaderMinimize() {
  eMinimize.addEventListener('click',()=>{
    if (eMinimize.textContent === 'X') {
      tmsSet('tm_keep_minimized', 1);
      remCls(eMinimize,'tm-btn-r','tm-btn-header-r');
      addCls(eMinimize,'tm-btn-b','tm-btn-header-b');
      eMinimize.textContent='^';
      tmUiHide(eMain);
      eContainer.style.width = getComputedStyle(eContainer).minWidth;
      eContainer.style.height = getComputedStyle(eContainer).minHeight;
    } else {
      tmsDelete('tm_keep_minimized');
      remCls(eMinimize,'tm-btn-b','tm-btn-header-b');
      addCls(eMinimize,'tm-btn-r','tm-btn-header-r');
      eMinimize.textContent='X';
      tmUiShow(eMain);
      eContainer.style.width = tmsGet('tm_keep_uiWidth_'+eMain.id);
      eContainer.style.height = tmsGet('tm_keep_uiHeight_'+eMain.id);
    }
  })
}
function tmUiInitMainReadme(link){eMainReadme.querySelector('a').href=link}
function tmUiInitMainHotkey(hotkey) {
  const [idsfx, name, keys, action] = hotkey;
  const id = 'tm-main-hotkeys-' + idsfx;
  // insert
  eMainHotkeys.insertAdjacentHTML('beforeend',mustache(
    tmHTMLMainHotkeysHotkey, {id:id, name:name, keys:keys}
  ));
  // event
  const checkbox = getEl('#'+id+' input[type="checkbox"]');
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
function tmUiInitMainPrep(data) {
  const [idsfx, title, action] = data;
  const mainId = 'tm-main-prep-'+idsfx;
  const prepId = 'tm-prep-exec-'+idsfx;
  // insert
  eMainPrep.insertAdjacentHTML('beforeend',mustache(tmHTMLMainPrep,{id:mainId,title:title}));
  ePrep.insertAdjacentHTML('beforeend',mustache(tmHTMLPrepExec,{id:prepId}));
  // event
  getEl('#'+mainId).addEventListener('click', () => {
    ePrepTitle.textContent = title;
    ePrepTextarea.value = tmsGet('tm_keep_uiTextareaValue_'+idsfx, '');
    // Скрываем другие EXEC кнопки
    getEls('.tm-group-prep-exec').forEach(e=>tmUiHide(e));
    // Показ текущей EXEC кнопки
    const prepExec = getEl('#'+prepId);
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
function tmUiInitMainExec(data) {
  const [idsfx, title, action] = data;
  const id = 'tm-main-exec-'+idsfx;
  eMainExec.insertAdjacentHTML('beforeend',mustache(tmHTMLMainExec,{id:id,title:title}));
  getEl('#'+id).addEventListener('click',()=>{tmUiShowExec();action()});
  tmUiShow(eMainExec);
}
function tmUiInitMainStorageView() {
  function prepareContent() {
    const data = tmsGetAll();
    // insert
    eModal.insertAdjacentHTML('beforeend', tmHTMLModalStorageview);
    const eContent = eModal.lastElementChild;
    const eTbody = eContent.querySelector('tbody');
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
      idsfx:'storage-view', accent:'info', title:'Storage View',
      actionPrepareContent: prepareContent,
      actionClose:()=>{},
    });
  });
}
function tmUiInitMainStorageReset() {
  eMainStorageBodyReset.addEventListener('click',()=>{
    // reset
    tmsReset();
    tmUiRecalcHeader();
    // modal
    ModalManager.buildAlert({
      accent:'warning', title:'Storage Reset',
      msg: 'All non-premanent data has been removed from storage.',
      actionClose:()=>{},
    });
  });
}
function tmUiInitMainStorageClean() {
  eMainStorageBodyClean.addEventListener('click',()=>{
    // clean
    tmsDeleteAll();
    tmUiRecalcHeader();
    // modal
    ModalManager.buildAlert({
      accent: 'error', title: 'Storage CLEAN',
      msg: 'ALL DATA has been deleted from storage.',
      actionClose:()=>{}
    });
  });
}
function tmUiInitExecCancel(){eExecCancel.addEventListener('click',()=>{tmUiReset('Exec canceled by user.')})}

// === init ==============================
function tmUiInit(map) {
  tmUiInitContainer();
  tmUiInitHeaderAbort();
  tmUiInitHeaderBack();
  tmUiInitHeaderMinimize();
  tmUiInitMainReadme(map.readme);
  for (let data of map.hotkeys) {tmUiInitMainHotkey(data)}
  for (let data of map.btnsPrep){tmUiInitMainPrep(data)}
  for (let data of map.btnsExec){tmUiInitMainExec(data)}
  tmUiInitMainStorageView();
  tmUiInitMainStorageReset();
  tmUiInitMainStorageClean();
  tmUiInitExecCancel();
  // show
  if (tmsGetOperation()) {
    tmUiShowExec()
  } else {
    tmUiShowMain()
  }
  function emulateResizeByOnePixel() {
    const startEvent = new MouseEvent("mousedown", {clientX:0, clientY:0, button:0});
    const moveEvent = new MouseEvent("mousemove", {clientX:0, clientY:-1});
    const endEvent = new MouseEvent("mouseup");
    eContainer.dispatchEvent(startEvent);
    document.dispatchEvent(moveEvent);
    document.dispatchEvent(endEvent);
  }
  emulateResizeByOnePixel();
  console.log('tmUiInit: done.');
}

// === pause/reset/cancel ==============================
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
function tmUiReset(...args) {
  console.log('tmUiReset: init..');
  tmsReset();
  tmUiShowMain();
  // modal
  if(args.length>0){const joined=args.map(
    arg=>typeof arg==='object'?JSON.stringify(arg,null,2):String(arg)
  ).join(' ')}
  ModalManager.buildAlert({
    accent: 'warning',
    title: 'tmUiReset',
    msg: joined,
    actionClose: ()=>{},
  });
  console.log('tmUiReset: done.');
}
function tmUiAbort(...args) {
  const pfx = 'tmUiAbort';
  console.log(pfx+': init..');
  tmsDeleteAll();
  // Formulate message
  const joinedArgs=args.map(
    arg=>typeof arg==='object'?JSON.stringify(arg,null,2):String(arg)
  ).join('\n');
  const msg = joinedArgs?joinedArgs:pfx+'.';
  console.log(msg);
  ModalManager.buildAlert({
    accent: 'error',
    title: 'tmUiAbort',
    msg: msg,
    actionClose:()=>{},
  });
  throw new AbortExecution(joinedArgs);
}
