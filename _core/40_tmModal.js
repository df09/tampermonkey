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

  type: null,
  accent: null,
  init: function(type, accent, title) {
    tmMenu.showExec();
    this.type = type;
    this.accent = accent;
    this.e.title.textContent = title;
  },
  show: function(type) {
    let e;
    if (type === 'info') {e = this.e.info}
    if (type === 'yn') {e = this.e.yn}
    if (type === 'input') {e = this.e.input}
    if (type === 'content') {e = this.e.content}
    if (!e) {abort('tmModal.show(): invalid type', type)}
    tmHide(this.e.info, this.e.yn, this.e.input, this.e.content);
    tmShow(e);tmShow(this.e.overlay);
  },
  handle: function(e, key, action) {
    const hideAndAct = ()=>{
      tmHide(this.e.overlay, this.e.info, this.e.yn, this.e.input, this.e.content);
      action();
      document.removeEventListener('keydown', escHandler);
    };
    const escHandler=(event)=>{if(event.key===key||event.code===key){hideAndAct()}};
    e.addEventListener('click',()=>{hideAndAct()});
    if(key){document.addEventListener('keydown', escHandler)}
  },

  // info
  info({accent, title, msg, actionClose}) {
    if (typeof actionClose !== 'function') {abort('tmModal.info: actionClose must be a function.')}
    const type = 'info';
    this.init(type, accent, title);
    this.e.infoMsg.textContent = msg;
    this.handle(this.e.close, 'Escape', actionClose);
    this.handle(this.e.infoBtn, 'Enter', actionClose);
    this.show(type);
  },
  // yn
  yn({accent, title, msg, actionNo, actionYes}) {
    if (typeof actionNo !== 'function') {abort('tmModal.info: actionNo must be a function.')}
    if (typeof actionYes !== 'function') {abort('tmModal.info: actionYes must be a function.')}
    const type = 'yn';
    this.init(type, accent, title);
    this.e.ynMsg.textContent = msg;
    this.handle(this.e.close, 'Escape', actionNo);
    this.handle(this.e.ynBtnNo, false, actionNo);
    this.handle(this.e.ynBtnYes, 'Enter', actionYes);
    setTimeout(() => {
      this.show(type);
    }, 100);
  },
  // input
  input({accent, title, msg, actionClose, actionSubmit}) {
    if (typeof actionClose !== 'function') {abort('tmModal.input: actionClose must be a function.')}
    if (typeof actionSubmit !== 'function') {abort('tmModal.input: actionSubmit must be a function.')}
    const type = 'input';
    this.init(type, accent, title);
    this.e.inputMsg.textContent = msg;
    this.handle(this.e.close, 'Escape', actionClose);
    this.handle(this.e.inputSubmit, 'Enter', actionSubmit);
    setTimeout(() => {
      this.show(type);
      this.e.inputInput.focus();
      this.e.inputInput.value = '';
    }, 100);
  },
  // content
  content({id, accent, title, actionClose, actionContent}) {
    if (typeof actionClose !== 'function') {abort('tmModal.content: actionClose must be a function.')}
    if (typeof actionContent !== 'function') {abort('tmModal.content: actionContent must be a function.')}
    const type = 'content';
    this.init(type, accent, title);
    this.e.body.insertAdjacentHTML('beforeend', '<div id="'+id+'"></div>');
    this.handle(this.e.close, 'Escape', actionClose);
    actionContent();
    this.show(type);
  },
};
