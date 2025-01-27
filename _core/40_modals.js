const tmModal = {
  // === elements ====================================
  e: {
    overlay: getEl("#tm-modal-overlay"),
    container: getEl("#tm-modal"),
    // header
    header: getEl("#tm-modal-header"),
    title: getEl("#tm-modal-title"),
    close: getEl("#tm-modal-close"),
    body: getEl("#tm-modal-body"),
    // info
    info: getEl("#tm-modal-info"),
    infoMsg: getEl("#tm-modal-info-msg"),
    infoBtn: getEl("#tm-modal-info-btn"),
    // yn
    yn: getEl("#tm-modal-yn"),
    ynMsg: getEl("#tm-modal-yn-msg"),
    ynBtnNo: getEl("#tm-modal-yn-btn-no"),
    ynBtnYes: getEl("#tm-modal-yn-btn-yes"),
    // input
    input: getEl("#tm-modal-input"),
    inputMsg: getEl("#tm-modal-input-msg"),
    inputInput: getEl("#tm-modal-input-input"),
    inputSubmit: getEl("#tm-modal-input-submit"),
    // content
    content: getEl("#tm-modal-content")
  },
  backup: null,
  type: null,
  accent: null,

  init(type, accent, title) {
    this.backup = this.e.container.innerHTML;
    this.type = type;
    this.accent = accent;
    this.e.title.textContent = title;
  },
  handleClose(e, action) {
    e.onclick=()=>{
      tmHide(this.e.overlay);
      this.e.container.innerHTML = this.backup;
      tmsReset();
      tmMenu.showMain();
      action();
    };
    // TODO hotkeys
  },
  show() {
    let e = null;
    if (this.type === 'info') { tmShow(this.e.info); tmHide(this.e.yn, this.e.input, this.e.content); }
    if (this.type === 'yn') { tmShow(this.e.yn); tmHide(this.e.info, this.e.input, this.e.content); }
    if (this.type === 'input') { tmShow(this.e.input); tmHide(this.e.info, this.e.yn, this.e.content); }
    if (this.type === 'content') { tmShow(this.e.content); tmHide(this.e.info, this.e.yn, this.e.input); }
    tmShow(this.e.overlay);
  },
  // info
  info({accent, title, msg, actionClose}) {
    if (typeof actionClose !== 'function') {abort('tmModal.info: actionClose must be a function.')}
    this.init('info', accent, title);
    this.e.infoMsg.textContent = msg;
    this.handleClose(this.e.close, actionClose);
    this.handleClose(this.e.infoBtn, actionClose);
    this.show();
  },
  // yn
  yn({accent, title, msg, actionNo, actionYes}) {
    if (typeof actionNo !== 'function') {abort('tmModal.info: actionNo must be a function.')}
    if (typeof actionYes !== 'function') {abort('tmModal.info: actionYes must be a function.')}
    this.init('yn', accent, title);
    this.e.ynMsg.textContent = msg;
    this.handleClose(this.e.close, actionNo);
    this.handleClose(this.e.ynBtnNo, actionNo);
    this.handleClose(this.e.ynBtnYes, actionYes);
    this.show();
  },
  // input
  input({accent, title, msg, actionClose, actionSubmit}) {
    if (typeof actionClose !== 'function') {abort('tmModal.input: actionClose must be a function.')}
    if (typeof actionSubmit !== 'function') {abort('tmModal.input: actionSubmit must be a function.')}
    this.init('input', accent, title);
    this.e.ynMsg.textContent = msg;
    this.handleClose(this.e.close, actionClose);
    this.handleClose(this.e.inputSubmit, actionSubmit);
    this.show();
  },
  // content
  content({id, accent, title, actionClose, actionContent}) {
    if (typeof actionClose !== 'function') {abort('tmModal.content: actionClose must be a function.')}
    if (typeof actionContent !== 'function') {abort('tmModal.content: actionContent must be a function.')}
    this.init('content', accent, title);
    this.e.body.insertAdjacentHTML('beforeend', '<div id="'+id+'"></div>');
    this.handleClose(this.e.close, actionClose);
    actionContent();
    this.show();
  },
};
