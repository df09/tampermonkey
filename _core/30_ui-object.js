const tmMenu = {
  // === elements ====================================
  e: {
    // header
    container: getEl('#tm-container'),
    operation: getEl('#tm-operation'),
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

  // === state ================================
  state: {},

  // === show/hide ==============================
  hide: function (...els) {
    els.forEach(e => e.classList.add('tm-dnone'));
  },
  show: function (...els) {
    els.forEach(e => e.classList.remove('tm-dnone'));
  },
  showMain: function () {
    tmsSet('tm_keep_activeId', this.e.main.id);
    this.recalcHeader();
    this.recalcSize();
    const { minimize, main, back, prep, exec } = this.e;
    if (tmsGet('tm_keep_minimized')) {
      remCls(minimize, 'tm-btn-r', 'tm-btn-header-r');
      addCls(minimize, 'tm-btn-b', 'tm-btn-header-b');
      minimize.textContent = '^';
      this.show(minimize);
      this.hide(back, main, prep, exec);
    } else {
      remCls(minimize, 'tm-btn-b', 'tm-btn-header-b');
      addCls(minimize, 'tm-btn-r', 'tm-btn-header-r');
      minimize.textContent = 'X';
      this.show(minimize, main);
      this.hide(back, prep, exec);
    }
  },
  showPrep: function () {
    tmsSet('tm_keep_activeId', this.e.prep.id);
    this.recalcHeader();
    this.recalcSize();
    const { back, prep, minimize, main, exec } = this.e;
    this.show(back, prep);
    this.hide(minimize, main, exec);
  },
  showExec: function () {
    tmsSet('tm_keep_activeId', this.e.exec.id);
    this.recalcHeader();
    this.recalcSize();
    const { exec, back, minimize, main, prep } = this.e;
    this.show(exec);
    this.hide(back, minimize, main, prep);
  },

  // === recalc ==============================
  recalcHeader: function () {
    const { operation } = this.e;
    const op = tmsGetOperation();
    const txt = op || 'None';
    const span = operation.querySelector('span');
    span.textContent = txt;

    if (txt === 'None') {
      addCls(operation, 'tm-border-w');
      remCls(operation, 'tm-border-y', 'tm-border-r');
      addCls(span, 'tm-w');
      remCls(span, 'tm-y', 'tm-r');
    } else {
      addCls(operation, 'tm-border-r');
      remCls(operation, 'tm-border-y', 'tm-border-w');
      addCls(span, 'tm-r');
      remCls(span, 'tm-y', 'tm-w');
    }

    if (op) {
      this.show(this.e.abort);
    } else {
      this.hide(this.e.abort);
    }
  },
  recalcSize: function () {
    const { container } = this.e;
    const activeId = tmsGet('tm_keep_activeId');
    const style = window.getComputedStyle(container);
    container.style.width = tmsGet('tm_keep_uiWidth_' + activeId);
    container.style.height = tmsGet('tm_keep_uiHeight_' + activeId);
  },

  // === init functions ==============================
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

  tmUiInit: function (map) {
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
    this.makeResizable(this.e.main);
    this.makeResizable(this.e.prep);
    if (tmsGetOperation()) {
      this.showExec();
    } else {
      this.showMain();
    }
    console.log('tmUiInit: done.');
  }
};
