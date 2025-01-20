const ModalManager = {
  e: getEl('.tm-modal'),
  backup: null,
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
  setTitle(title) {
    getEl('.tm-modal-header-title').textContent = title;
  },
  setClose(actionClose) {
    let eClose = getEl('.tm-modal-header-close');
    eClose.onclick = () => {
      tmUiHide(this.e);
      this.e.innerHTML = this.backup;
      actionClose();
    };
    tmUiFlex(eClose);
  },
  setMsg(msg) {
    getEl('.tm-modal-body-alert-msg').textContent = msg;
  },

  // alert
  buildAlert({ accent = 'info', title = '', msg = '', actionClose }) {
    this.backup = this.e.innerHTML;
    // validate
    if (!title) {
      abort('ModalManager.buildAlert: please set title.');
    }
    if (!msg) {
      abort('ModalManager.buildAlert: please set msg.');
    }
    // preset
    const type = 'alert';
    this.setModalType(type);
    this.setModalAccent(accent);
    // header
    this.setTitle(title);
    tmUiHide(getEl('.tm-modal-header-close'));
    // body
    this.setMsg(msg);
    this.setClose(actionClose);
    tmUiFlex(getEl('.tm-modal-body-alert'));
    // show modal
    tmUiFlex(this.e);
  },

  // dialog
  buildDialog({ kind = 'input', title = '', msg = '', actionClose, actionSubmit }) {
    // validate
    if (!['input', 'textarea'].includes(kind)) {
      abort('ModalManager.buildDialog: invalid kind (' + kind + '), allowed only input, textarea');
    }
    if (!title) {
      abort('ModalManager.buildDialog: please set title.');
    }
    if (!msg) {
      abort('ModalManager.buildDialog: please set msg.');
    }
    if (typeof actionClose !== 'function') {
      abort('ModalManager.buildDialog: actionClose must be a function.');
    }
    if (typeof actionSubmit !== 'function') {
      abort('ModalManager.buildDialog: actionSubmit must be a function.');
    }
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
      tmUiFlex(getEl('.tm-modal-body-dialog-input'));
    } else {
      tmUiFlex(getEl('.tm-modal-body-dialog-textarea'));
    }
    getEl('.tm-modal-body-dialog-submit').onclick = () => actionSubmit();
    tmUiFlex(getEl('.tm-modal-body-dialog'));
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
    tmUiFlex(this.e);
  },

  // content
  buildContent(title = '', actionClose) {
    // validate
    if (!title) {
      abort('ModalManager.buildContent: please set title.');
    }
    // preset
    const type = 'content';
    const accent = 'info';
    this.setModalType(type);
    this.setModalAccent(accent);
    // header
    this.setTitle(title);
    this.setClose(actionClose);
    // body
    tmUiFlex(getEl('.tm-modal-body-content'));
    // show modal
    tmUiFlex(this.e);
  },
};
