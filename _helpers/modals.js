const ModalManager = {
  // vars
  backup: null,
  eOverlay: getEl('#tm-modal-overlay'),
  e: getEl('#tm-modal'),
  // vars.header
  eHeader: getEl('#tm-modal-header'),
  eHeaderTitle: getEl('#tm-modal-header-title'),
  eHeaderClose: getEl('#tm-modal-header-close'),
  // vars.alert
  eAlert: getEl('#tm-modal-alert'),
  eAlertMsg: getEl('#tm-modal-alert-msg'),
  eAlertOk: getEl('#tm-modal-alert-ok'),
  // vars.dialog
  eDialog: getEl('#tm-modal-dialog'),
  eDialogMsg: getEl('#tm-modal-dialog-msg'),
  eDialogInput: getEl('#tm-modal-dialog-input'),
  eDialogTextarea: getEl('#tm-modal-dialog-textarea'),
  eDialogSubmit: getEl('#tm-modal-dialog-submit'),

  setModalType(type) {
    const allowed = ['alert', 'dialog-input', 'dialog-textarea', 'content'];
    if (!allowed.includes(type)) {
      abort('ModalManager.setModalType: invalid type (' + type + '), allowed only ' + allowed);
    }
    tmAddClass(this.e, 'tm-model-' + type);
  },
  setModalAccent(accent) {
    const allowed = ['info', 'success', 'warning', 'error'];
    if (!allowed.includes(accent)) {
      abort('ModalManager.setModalAccent: invalid type (' + accent + '), allowed only ' + allowed);
    }
    tmAddClass(this.e, 'tm-modal-' + accent);
  },
  setTitle(title){this.eHeaderTitle.textContent=title},
  setClose(actionClose) {
    this.eHeaderClose.onclick=()=>{
      tmUiHide(this.e);
      this.e.innerHTML = this.backup;
      actionClose();
    };
    tmUiShow(this.eHeaderClose);
  },
  setMsg(msg){this.eAlertMsg.textContent=msg},

  // alert
  buildAlert({ accent = 'info', title = '', msg = '', actionClose }) {
    this.backup = this.e.innerHTML;
    // validate
    if (!title) {abort('ModalManager.buildAlert: please set title.')}
    if (!msg) {abort('ModalManager.buildAlert: please set msg.')}
    // preset
    const type = 'alert';
    this.setModalType(type);
    this.setModalAccent(accent);
    // header
    this.setTitle(title);
    tmUiHide(this.eHeaderClose);
    // body
    this.setMsg(msg);
    this.setClose(actionClose);
    tmUiShow(this.eAlert);
    // show modal
    tmUiShow(this.e);
  },

  // dialog
  buildDialog({ kind = 'input', title = '', msg = '', actionClose, actionSubmit }) {
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
      tmUiShow(this.eDialogInput);
    } else {
      tmUiShow(this.eDialogTextarea);
    }
    this.eDialogSubmit.onclick = () => actionSubmit();
    tmUiShow(this.eDialog);
    // Обработка нажатий клавиш
    this.e.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        actionSubmit();
      } else if (event.key === 'Escape') {
        actionClose();
        tmUiReset();
      }
    });
    // show modal
    tmUiShow(this.e);
  },

  // content
  buildContent(idpfx, title, actionClose) {
    // validate
    if (!idpfx) {abort('ModalManager.buildContent: please set idpfx.')}
    if (!title) {abort('ModalManager.buildContent: please set title.')}
    if (typeof actionClose !== 'function') {abort('ModalManager.buildDialog: actionClose must be a function.')}
    // preset
    this.setModalType('content');
    this.setModalAccent('info');
    // header
    this.setTitle(title);
    this.setClose(actionClose);
    // body
    tmUiShow(getEl('#tm-modal-content-'+idpfx));
    // Обработка нажатий клавиш
    this.e.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        actionClose();
        tmUiReset();
      }
    });
    // show modal
    tmUiShow(this.e);
  },
};
