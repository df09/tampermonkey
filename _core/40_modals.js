const ModalManager = {
  // vars
  backup: null,
  eOverlay: getEl('#tm-modal-overlay'),
  eModal: getEl('#tm-modal'),

  setModalType(type) {
    const allowed = ['alert', 'dialog-input', 'dialog-textarea', 'content'];
    if (!allowed.includes(type)) {
      abort('ModalManager.setModalType: invalid type (' + type + '), allowed only ' + allowed);
    }
    addCls(eModal, 'tm-model-' + type);
  },
  setModalAccent(accent) {
    const allowed = ['info', 'success', 'warning', 'error'];
    if (!allowed.includes(accent)) {
      abort('ModalManager.setModalAccent: invalid type (' + accent + '), allowed only ' + allowed);
    }
    addCls(eModal, 'tm-modal-' + accent);
  },
  setTitle(title){eModalHeaderTitle.textContent=title},
  setClose(actionClose) {
    // button
    eModalHeaderClose.onclick=()=>{
      tmUiHide(eModalOverlay);
      eModal.innerHTML = this.backup;
      actionClose();
    };
    // hotkeys
    eModal.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        tmUiHide(eModalOverlay);
        eModal.innerHTML = this.backup;
        actionClose();
      }
    });
    tmUiShow(eModalHeaderClose);
  },
  setMsg(msg){eModalAlertMsg.textContent=msg},

  // alert
  buildAlert({accent='info', title='', msg='', actionClose}) {
    this.backup = eModal.innerHTML;
    // validate
    if (!title) {abort('ModalManager.buildAlert: please set title.')}
    if (!msg) {abort('ModalManager.buildAlert: please set msg.')}
    // preset
    const type = 'alert';
    this.setModalType(type);
    this.setModalAccent(accent);
    // header
    this.setTitle(title);
    tmUiHide(eModalHeaderClose);
    // body
    this.setMsg(msg);
    this.setClose(actionClose);
    tmUiShow(eModalAlert);
    // show modal
    tmUiShow(eModalOverlay);
  },

  // dialog
  buildDialog({kind='input',title='',msg='',actionSubmit,actionClose}) {
    const allowed = ['input','textarea'];
    // validate
    if (!allowed.includes(kind)){abort('ModalManager.buildDialog: invalid kind ('+kind+'), allowed only '+allowed)}
    if (!title) {abort('ModalManager.buildDialog: please set title.')}
    if (!msg) {abort('ModalManager.buildDialog: please set msg.')}
    if (typeof actionClose !== 'function') {abort('ModalManager.buildDialog: actionClose must be a function.')}
    if (typeof actionSubmit !== 'function') {abort('ModalManager.buildDialog: actionSubmit must be a function.')}
    // preset
    const type = 'dialog-' + kind;
    const accent = 'info';
    this.setModalType(type);
    this.setModalAccent(accent);
    // header
    this.setTitle(title);
    this.setClose(actionClose);
    // body
    this.setMsg(msg);
    if (kind === 'input') {
      tmUiShow(eModalDialogInput);
    } else {
      tmUiShow(eModalDialogTextarea);
    }
    eModalDialogSubmit.onclick = () => actionSubmit();
    tmUiShow(eModalDialog);
    // Обработка нажатий клавиш
    eModal.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        actionSubmit();
      } else if (event.key === 'Escape') {
        actionClose();
        tmUiReset();
      }
    });
    // show modal
    tmUiShow(eModalOverlay);
  },

  // content
  buildContent(idsfx, accent, title, actionPrepareContent, actionClose) {
    // validate
    if (!idsfx) {abort('ModalManager.buildContent: please set idsfx.')}
    if (!accent) {abort('ModalManager.buildContent: please set accent.')}
    if (!title) {abort('ModalManager.buildContent: please set title.')}
    if (typeof actionClose !== 'function') {abort('ModalManager.buildContent: actionClose must be a function.')}
    if (typeof actionPrepareContent !== 'function') {abort('ModalManager.buildContent: actionPrepareContent must be a function.')}
    // preset
    this.setModalType('content');
    this.setModalAccent(accent);
    // header
    this.setTitle(title);
    this.setClose(actionClose);
    // content
    actionPrepareContent();
    tmUiShow(getEl('#tm-modal-content-'+idsfx));
    // show modal
    tmUiShow(eModalOverlay);
  },
};
