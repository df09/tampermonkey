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
  tmsSet('tm_keep_activeId', eMain.id);
  tmUiRecalcHeader();tmUiRecalcSize();
  // minimize
  if (tmsGet('tm_keep_minimized')) {
    // hide
    remCls(eMinimize,'tm-btn-r','tm-btn-header-r');
    addCls(eMinimize,'tm-btn-b','tm-btn-header-b');
    eMinimize.textContent='^';
    tmUiShow(eMinimize);
    tmUiHide(eBack,eMain,ePrep,eExec);
  } else {
    // show
    remCls(eMinimize,'tm-btn-b','tm-btn-header-b');
    addCls(eMinimize,'tm-btn-r','tm-btn-header-r');
    eMinimize.textContent='X';
    tmUiShow(eMinimize,eMain);
    tmUiHide(eBack,ePrep,eExec);
  }
}
function tmUiShowPrep(){
  tmsSet('tm_keep_activeId', ePrep.id);
  tmUiRecalcHeader();tmUiRecalcSize();
  tmUiShow(eBack,ePrep);
  tmUiHide(eMinimize,eMain,eExec);
}
function tmUiShowExec(){
  tmsSet('tm_keep_activeId', eExec.id);
  tmUiRecalcHeader();tmUiRecalcSize();
  tmUiShow(eExec);
  tmUiHide(eBack,eMinimize,eMain,ePrep);
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
function tmUiRecalcSize() {
  const activeId = tmsGet('tm_keep_activeId');
  const style = window.getComputedStyle(eContainer);
  eContainer.style.width = tmsGet('tm_keep_uiWidth_'+activeId);
  eContainer.style.height = tmsGet('tm_keep_uiHeight_'+activeId);
}

