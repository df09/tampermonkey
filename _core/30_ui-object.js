const tmMenu = {
  // === elements ====================================
  e: {
    // header
    container: getEl('#tm-container'),
    op: getEl('#tm-operation'),
    abort: getEl('#tm-abort'),
    back: getEl('#tm-back'),
    minimize: getEl('#tm-minimize'),
    // main
    main: getEl('#tm-main'),
    mainReadme: getEl('#tm-main-readme'),
    mainHotkeys: getEl('#tm-main-hotkeys'),
    mainPrep: getEl('#tm-main-prep'),
    mainExec: getEl('#tm-main-exec'),
    mainStorage: getEl('#tm-main-storage'),
    mainStorageTitle: getEl('#tm-main-storage-title'),
    mainStorageBody: getEl('#tm-main-storage-body'),
    mainStorageBodyView: getEl('#tm-main-storage-view'),
    mainStorageBodyReset: getEl('#tm-main-storage-reset'),
    mainStorageBodyClean: getEl('#tm-main-storage-clean'),
    // prep
    prep: getEl('#tm-prep'),
    prepTitle: getEl('#tm-prep-title'),
    prepTextarea: getEl('#tm-prep-textarea'),
    // exec
    exec: getEl('#tm-exec'),
    execContinue: getEl('#tm-exec-continue'),
    execCancel: getEl('#tm-exec-cancel'),
    // modal
    modalOverlay: getEl('#tm-modal-overlay'),
    modal: getEl('#tm-modal'),
    modalHeader: getEl('#tm-modal-header'),
    modalHeaderTitle: getEl('#tm-modal-header-title'),
    modalHeaderClose: getEl('#tm-modal-header-close'),
    modalAlert: getEl('#tm-modal-alert'),
    modalAlertMsg: getEl('#tm-modal-alert-msg'),
    modalAlertOk: getEl('#tm-modal-alert-ok'),
    modalDialog: getEl('#tm-modal-dialog'),
    modalDialogMsg: getEl('#tm-modal-dialog-msg'),
    modalDialogInput: getEl('#tm-modal-dialog-input'),
    modalDialogTextarea: getEl('#tm-modal-dialog-textarea'),
    modalDialogSubmit: getEl('#tm-modal-dialog-submit')
  },
  // === state ==================================
  state: {
    activeId: 'tm-main',
    op: tmsGetOperation(),
    isMinimized: 0,
    setActiveId: function(id){tmsSet('tm_keep_activeId',id);this.activeId=id},
    setOperation: function(id){tmsSet('tm_keep_activeId',id);this.activeId=id},
    setIsMinimized: function(val){tmsSet('tm_keep_isMinimized', val);this.isMinimized=val},
    style: {
      hw: this.setHw(),
      minWidth: window.getComputedStyle(tmMenu.e.container).minWidth,
      minHeight: window.getComputedStyle(tmMenu.e.container).minHeight,
      setHw: function() {
        if (tmMenu.state.isMinimized) {
          // using css min-height, min-width
          this.hw = {this.minHeight, this.minWidth};
        } else {
          const tmsHw = tmsGet('tm_keep_hw-' + tmMenu.state.activeId);
          if (tmsHw[0] && tmsHw[1]) {
            // using storage
            this.hw = {this.tmsHeight, this.tmsWidth};
          } else {
            // using current hw and save to storage
            const hw = {tmMenu.e.container.offsetWidth, tmMenu.e.container.offsetWidth};
            tmsSet('tm_keep_hw-'+tmMenu.state.activeId, hw);
            this.hw = hw;
          }
        }
      },
    },
  },
  // === show/hide ==============================
  hide: function(...els){els.forEach(e=>e.classList.add('tm-dnone'))},
  show: function(...els){els.forEach(e=>e.classList.remove('tm-dnone'))},
  showMain: function () {
    const {abort, back, minimize, main, prep, exec} = this.e,
    this.render(main.id)
    if (this.state.isMinimized) {
      this.show(minimize);
      this.hide(abort, back, main, prep, exec);
    } else {
      this.show(minimize, main);
      this.hide(abort, back, prep, exec);
    }
  },
  showPrep: function () {
    const {abort, back, minimize, main, prep, exec} = this.e,
    this.render(prep.id)
    this.show(back, prep);
    this.hide(abort, minimize, main, exec);
  },
  showExec: function () {
    const {abort, back, minimize, main, prep, exec} = this.e,
    this.render(exec.id)
    this.show(abort, exec);
    this.hide(back, minimize, main, prep);
  },
  // === render ==============================
  render: function (activeId) {
    this.state.setActiveId(activeId);
    this.renderOperation();
    this.renderMinimize();
    this.renderSize();
  }
  renderOperation: function () {
    const txt = this.state.op || 'None';
    const span = this.e.op.querySelector('span');
    span.textContent = txt;
    if (txt === 'None') {
      addCls(this.e.op, 'tm-border-w');
      remCls(this.e.op, 'tm-border-y', 'tm-border-r');
      addCls(span, 'tm-w');
      remCls(span, 'tm-y', 'tm-r');
    } else {
      addCls(this.e.op, 'tm-border-r');
      remCls(this.e.op, 'tm-border-y', 'tm-border-w');
      addCls(span, 'tm-r');
      remCls(span, 'tm-y', 'tm-w');
    }
    this.state.op ? this.show(this.e.abort) : this.hide(this.e.abort);
  },
  renderMinimize: function() {
    if (this.state.isMinimized) {
      this.e.minimize.textContent = '^';
      addCls(this.e.minimize, 'tm-btn-b', 'tm-btn-header-b');
      remCls(this.e.minimize, 'tm-btn-r', 'tm-btn-header-r');
    } else {
      this.e.minimize.textContent = 'X';
      addCls(this.e.minimize, 'tm-btn-r', 'tm-btn-header-r');
      remCls(this.e.minimize, 'tm-btn-b', 'tm-btn-header-b');
    }
  },
  renderSize: function () {
    this.e.container.style.width = this.state.hw[0];
    this.e.container.style.height = this.state.hw[1];
  },

  // === listners ==============================
 
  makeResizable: function (e) {
    let isResizing = false;
    let startX, startY, startWidth, startHeight;
    e.addEventListener("mousedown", (event) => {
      if (event.target.matches("button, input, textarea, .tm-slider")) return;
      if (event.button !== 0) return;
      isResizing = true;
      startX = event.clientX;
      startY = event.clientY;
      startWidth = e.offsetWidth;
      startHeight = e.offsetHeight;
      document.body.style.userSelect = "none";
    });
    document.addEventListener("mousemove", (event) => {
      if (!isResizing) return;
      const newWidth = startWidth - (event.clientX - startX);
      const newHeight = startHeight - (event.clientY - startY);
      e.style.width = `${Math.max(newWidth, parseInt(window.getComputedStyle(e).minWidth, 10))}px`;
      e.style.height = `${Math.max(newHeight, parseInt(window.getComputedStyle(e).minHeight, 10))}px`;
    });
    document.addEventListener("mouseup", () => {
      if (isResizing) {
        isResizing = false;
        document.body.style.userSelect = "";
        const activeId = tmsGet("tm_keep_activeId");
        const style = window.getComputedStyle(e);
        tmsSet('tm_keep_uiWidth_' + activeId, style.width);
        tmsSet('tm_keep_uiHeight_' + activeId, style.height);
      }
    });
  },
  // === init ==============================
  init: function (map) {
    this.tmUiInitHeaderAbort();
    this.tmUiInitHeaderBack();
    this.tmUiInitHeaderMinimize();
    this.tmUiInitMainReadme(map.readme);
    for (let data of map.hotkeys) {
      this.tmUiInitMainHotkey(data);
    }
    for (let data of map.btnsPrep) {
      this.tmUiInitMainPrep(data);
    }
    for (let data of map.btnsExec) {
      this.tmUiInitMainExec(data);
    }
    this.tmUiInitMainStorageView();
    this.tmUiInitMainStorageReset();
    this.tmUiInitMainStorageClean();
    this.tmUiInitExecCancel();

    // show
    if (tmsGetOperation()) {
      this.showExec();
    } else {
      this.makeResizable(this.e.header);
      this.showMain();
    }
    console.log('tmUiInit: done.');
  }
};
