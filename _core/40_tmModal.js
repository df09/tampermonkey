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
  validateIsFunctions(...args) {
    if (!args.every(arg => typeof arg === 'function')) {
      tmUi.abort({
        title: 'validateIsFunctions',
        msg: 'false'
      })
    }
    return true;
  },

  type: null,
  accent: null,
  init(type, accent, title) {
    tmMenu.showExec();
    this.type = type;
    this.accent = accent;
    this.e.title.textContent = title;
  },
  show(type) {
    let e;
    if (type === 'info') {e = this.e.info}
    if (type === 'yn') {e = this.e.yn}
    if (type === 'input') {e = this.e.input}
    if (type === 'content') {e = this.e.content}
    if (!e) {
      tmUi.abort({
        title: 'tmModal.show()',
        msg: {'invalid type', type}
      })
    }
    tmHide(this.e.info, this.e.yn, this.e.input, this.e.content);
    tmShow(e);tmShow(this.e.overlay);
  },
  hide() {tmHide(this.e.info, this.e.yn, this.e.input, this.e.content)},
  handleEl(e, action) {e.addEventListener('click',()=>{this.hide();action()})},
  handleKey(key, action) {
    const escHandler = (event) => { if (event.key === key || event.code === key) {
      document.removeEventListener('keydown', escHandler);
      this.hide();
      action();
    }};
    document.addEventListener('keydown', escHandler);
  },

  // info
  info({accent, title, msg, actionClose=()=>{}}) {
    this.validateIsFunctions(actionClose);
    const type = 'info';
    this.init(type, accent, title);
    this.e.infoMsg.textContent = msg;
    this.handleEl(this.e.close, actionClose);
    this.handleEl(this.e.infoBtn, actionClose);
    this.handleKey('Escape', actionClose);
    this.handleKey('Enter', actionClose);
    this.show(type);
  },
  // yn
  yn({accent, title, msg, actionNo=()=>{}, actionYes=()=>{}}) {
    this.validateIsFunctions(actionNo, actionYes);
    const type = 'yn';
    this.init(type, accent, title);
    this.e.ynMsg.textContent = msg;
    this.handleEl(this.e.close, actionNo);
    this.handleEl(this.e.ynBtnNo, actionNo);
    this.handleEl(this.e.ynBtnYes, actionYes);
    this.handleKey('Escape', actionNo);
    this.handleKey('Enter', actionYes);
    this.show(type);
  },
  // input
  input({accent, title, msg, actionClose=()=>{}, actionSubmit=()=>{}}) {
    this.validateIsFunctions(actionClose, actionSubmit);
    const type = 'input';
    this.init(type, accent, title);
    this.e.inputMsg.textContent = msg;
    this.handleEl(this.e.close, actionClose);
    this.handleEl(this.e.inputSubmit, actionSubmit);
    this.handleKey('Escape', actionClose);
    this.handleKey('Enter', actionSubmit);
    this.show(type);
    setTimeout(() => {
      this.e.inputInput.focus();
      this.e.inputInput.value = '';
    }, 100);
  },
  // content
  content({id, accent, title, actionClose=()=>{}, actionContent}) {
    this.validateIsFunctions(actionClose, actionContent);
    const type = 'content';
    this.init(type, accent, title);
    this.e.body.insertAdjacentHTML('beforeend', '<div id="'+id+'"></div>');
    this.handleEl(this.e.close, actionClose);
    this.handleKey('Escape', actionClose);
    actionContent();
    this.show(type);
  },
};
