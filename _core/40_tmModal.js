const tmModal = {
  // === elements ====================================
  e: {
    overlay: getEl("#tm-modal-overlay"),
    container: getEl("#tm-modal"),
    header: getEl("#tm-modal-header"),
    body: getEl("#tm-modal-body"),
    // header
    title: getEl("#tm-modal-title"),
    close: getEl("#tm-modal-close"),
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
    args.forEach((arg, index) => {
      if (typeof arg !== 'function') {
        tmUi.abort({
          title: 'tmModal.validateIsFunctions',
          msg: 'The argument-'+(index+1)+' is of type "'+(typeof arg)+'", a function is expected.',
        });
      }
    });
    return true;
  },

  type: null,
  eType: null,
  init(type, accent, title) {
    this.type = type;
    this.eType = type;
    let e;
    if (type === 'info') {e = this.e.info}
    if (type === 'yn') {e = this.e.yn}
    if (type === 'input') {e = this.e.input}
    if (type === 'content') {e = this.e.content}
    if (!e) {
      const e = 'invalid type: '+type;
      alert(e);throw new Error(e);
    }
    this.eType = e;

    if (!["w","g","y","r","b"].includes(accent)) {
      const e = 'invalid accent: '+accent;
      alert(e);throw new Error(e);
    }
    this.accent = accent;
    remClsRegex(this.e.header, '^tm-[wgyrb]$', '^tm-bg-[wgyrb]$', '^tm-brd-[wgyrb]$');
    remClsRegex(this.e.close, '^tm-btn-[wgyrb]$');
    addCls(this.e.header , 'tm-'+accent, 'tm-bg-'+accent, 'tm-brd-'+accent);
    addCls(this.e.close, 'tm-btn-'+accent);
    if (type === 'info') {
      remClsRegex(this.e.infoBtn, '^tm-btn-[wgyrb]$');
      addCls(this.e.infoBtn, 'tm-btn-'+accent);
    }
    if (type === 'yn') {
      remClsRegex(this.e.ynBtnYes, '^tm-btn-[wgyrb]$');
      remClsRegex(this.e.ynBtnNo, '^tm-btn-[wgyrb]$');
      addCls(this.e.ynBtnNo, 'tm-btn-w');
      addCls(this.e.ynBtnYes, 'tm-btn-'+accent);
    }
    if (type === 'input') {
      remClsRegex(this.e.inputInput, '^tm-brd-[wgyrb]$');
      remClsRegex(this.e.inputSubmit, '^tm-btn-[wgyrb]$', '^tm-brd-[wgyrb]$');
      addCls(this.e.inputInput, 'tm-brd-w');
      addCls(this.e.inputSubmit, 'tm-btn-'+accent);
    }
    this.e.title.textContent = title;
  },
  show(type) {
    tmHide(this.e.info, this.e.yn, this.e.input, this.e.content);
    tmShow(this.eType);tmShow(this.e.overlay);
  },
  hide() {tmHide(this.e.overlay, this.e.info, this.e.yn, this.e.input, this.e.content)},
  // handlers
  handleEl(e, action) {e.addEventListener('click',()=>{this.hide();action()})},
  handleKey(key, action) {
    const escHandler = (event) => { if (event.key === key || event.code === key) {
      document.removeEventListener('keydown', escHandler);
      this.hide();
      action();
    }};
    document.addEventListener('keydown', escHandler);
  },
  handleOverlayClick(closeAction, event) {
    if (!this.e.container.contains(event.target)) {
      this.hide();
      closeAction();
      this.e.overlay.removeEventListener("click", this.boundOverlayClick);
    }
  },

  // info
  info({accent, title, msg, actionClose=()=>{}}) {
    this.validateIsFunctions(actionClose);
    const type = 'info';
    this.init(type, accent, title);
    this.e.infoMsg.textContent = tmUi.formulateMsg(msg);
    this.handleEl(this.e.close, actionClose);
    this.handleEl(this.e.infoBtn, actionClose);
    this.handleKey('Escape', actionClose);
    this.handleKey('Enter', actionClose);
    // Используем bind, чтобы сохранить контекст this
    this.boundOverlayClick = this.handleOverlayClick.bind(this, actionClose);
    this.e.overlay.addEventListener("click", this.boundOverlayClick);
    this.show(type);
    setTimeout(() => {
      this.e.infoBtn.focus();
    }, 100);
  },
  // yn
  yn({accent, title, msg, actionNo=()=>{}, actionYes=()=>{}}) {
    this.validateIsFunctions(actionNo, actionYes);
    const type = 'yn';
    this.init(type, accent, title);
    this.e.ynMsg.textContent = tmUi.formulateMsg(msg);
    this.handleEl(this.e.close, actionNo);
    this.handleEl(this.e.ynBtnNo, actionNo);
    this.handleEl(this.e.ynBtnYes, actionYes);
    this.handleKey('Escape', actionNo);
    this.handleKey('Enter', actionYes);
    // Используем bind, чтобы сохранить контекст this
    this.boundOverlayClick = this.handleOverlayClick.bind(this, actionNo);
    this.e.overlay.addEventListener("click", this.boundOverlayClick);
    this.show(type);
    setTimeout(() => {
      this.e.ynBtnYes.focus();
    }, 100);
  },
  // input
  input({accent, title, msg, actionClose=()=>{}, actionSubmit=()=>{}}) {
    this.validateIsFunctions(actionClose, actionSubmit);
    const type = 'input';
    this.init(type, accent, title);
    this.e.inputMsg.textContent = tmUi.formulateMsg(msg);
    this.handleEl(this.e.close, actionClose);
    this.handleEl(this.e.inputSubmit, actionSubmit);
    this.handleKey('Escape', actionClose);
    this.handleKey('Enter', actionSubmit);
    // Используем bind, чтобы сохранить контекст this
    this.boundOverlayClick = this.handleOverlayClick.bind(this, actionClose);
    this.e.overlay.addEventListener("click", this.boundOverlayClick);
    this.show(type);
    setTimeout(() => {
      this.e.inputInput.focus();
      this.e.inputInput.value = '';
    }, 100);
  },
  // content
  content({idsfx, accent, title, actionClose=()=>{}, actionContent}) {
    this.validateIsFunctions(actionClose, actionContent);
    const type = 'content';
    this.init(type, accent, title);
    this.e.content.innerHTML = '';
    this.e.content.insertAdjacentHTML('beforeend', '<div id="tm-modal-content-'+idsfx+'"></div>');
    this.handleEl(this.e.close, actionClose);
    this.handleKey('Escape', actionClose);
    // Используем bind, чтобы сохранить контекст this
    this.boundOverlayClick = this.handleOverlayClick.bind(this, actionClose);
    this.e.overlay.addEventListener("click", this.boundOverlayClick);
    this.show(type);
    setTimeout(() => {
      this.e.container.focus();
    }, 100);
    actionContent();
  },
};
