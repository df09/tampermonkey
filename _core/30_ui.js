const tmMenu = {
  log:createObjectLogger('tmMenu'),
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
    readme: getEl('#tm-readme'),
    hotkeys: getEl('#tm-hotkeys'),
    mainPrep: getEl('#tm-main-prep'),
    mainExec: getEl('#tm-main-exec'),
    storage: getEl('#tm-storage'),
    storageTitle: getEl('#tm-storage-title'),
    storageBody: getEl('#tm-storage-body'),
    storageView: getEl('#tm-storage-view'),
    storageReset: getEl('#tm-storage-reset'),
    storageClean: getEl('#tm-storage-clean'),
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
    modalTitle: getEl('#tm-modal-title'),
    modalClose: getEl('#tm-modal-close'),
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
    operation: tmsGetOperation(),
    isMinimized: 0,
    hw: this.setHw(),
    minWidth: window.getComputedStyle(tmMenu.e.container).minWidth,
    minHeight: window.getComputedStyle(tmMenu.e.container).minHeight,
    setActiveId: function(id){tmsSet('tmKeep_activeId',id);this.activeId=id},
    setOperation: function(op){tmsSet('tmKeep_operation',op);this.operation=op},
    setIsMinimized: function(val){tmsSet('tmKeep_isMinimized',val);this.isMinimized=val},
    setHw: function() {
      if (this.isMinimized) {
        this.hw = {this.minHeight, this.minWidth};
        this.log('using css min-height, min-width.', this.hw);
      } else {
        const tmsHw = tmsGet('tmKeep_hw-' + this.activeId);
        if (tmsHw[0] && tmsHw[1]) {
          this.hw = {this.tmsHeight, this.tmsWidth};
          this.log('using storage.', this.hw);
        } else {
          const hw = {tmMenu.e.container.offsetWidth, tmMenu.e.container.offsetWidth};
          tmsSet('tmKeep_hw-'+this.activeId, hw);
          this.hw = hw;
          this.log('using current hw and save to storage.', this.hw);
        }
      },
    },
  },
  // === show/hide ==============================
  hide: function(...els){els.forEach(e=>e.classList.add('tm-dnone'))},
  show: function(...els){els.forEach(e=>e.classList.remove('tm-dnone'))},
  showMain: function(){
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
  showPrep: function(){
    const {abort, back, minimize, main, prep, exec} = this.e;
    this.render(prep.id);
    this.show(back, prep);
    this.hide(abort, minimize, main, exec);
  },
  showExec: function(){
    const {abort, back, minimize, main, prep, exec} = this.e;
    this.render(exec.id);
    this.show(abort, exec);
    this.hide(back, minimize, main, prep);
  },

  // === render ==============================
  render: function(activeId) {
    this.state.setActiveId(activeId);
    this.renderOperation();
    this.renderMinimize();
    this.renderSize();
    this.log('done.');
  },
  renderOperation: function(){
    const txt = this.state.operation || 'None';
    const span = this.e.operation.querySelector('span');
    span.textContent = txt;
    if (txt === 'None') {
      addCls(this.e.operation, 'tm-border-w');
      remCls(this.e.operation, 'tm-border-y', 'tm-border-r');
      addCls(span, 'tm-w');
      remCls(span, 'tm-y', 'tm-r');
    } else {
      addCls(this.e.operation, 'tm-border-r');
      remCls(this.e.operation, 'tm-border-y', 'tm-border-w');
      addCls(span, 'tm-r');
      remCls(span, 'tm-y', 'tm-w');
    }
    this.state.operation ? this.show(this.e.abort) : this.hide(this.e.abort);
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
  renderSize: function(){
    this.e.container.style.width = this.state.hw[0];
    this.e.container.style.height = this.state.hw[1];
    this.log(this.state.hw);
  },

  // === listners ==============================
  handleAbort: function(){this.e.abort.addEventListener('click',()=>{
    this.abort('Exec aborted by user. ALL DATA was deleted from storage.')
  })},
  handleBack: function(){this.e.back.addEventListener('click',()=>{this.showMain()})},
  handleMinimize: function(){this.e.minimize.addEventListener('click',()=>{
    const hw = {this.state.hw[0], this.state.minHeight};
    if (hw === 'X') {
      this.state.hw = hw; // save
      this.state.setIsMinimized(true);
      tmsSet('tmKeep_hw-'+this.state.activeId, hw);
      log('off -> on', hw, this.state)
    } else {
      this.state.setIsMinimized(false);
      log('on -> off', hw, this.state)
    }
  })},
  handleReadme: function(link){this.e.readme.querySelector('a').href=link},
  handleHotkey: function(hotkey) {
    const [idsfx, name, keys, action] = hotkey;
    const id = 'tm-main-hotkeys-' + idsfx;
    // insert
    this.e.hotkeys.insertAdjacentHTML('beforeend',mustache(
      tmHTMLMainHotkey, {id:id, name:name, keys:keys}
    ));
    // event
    const e = getEl('#'+id+' input[type="checkbox"]');
    e.addEventListener('change',function(){
      if (e.checked) {
        log(id+': ON');
        tmsSet('tmKeep_hotkey-'+idsfx, '1')
        function hotkeyHandler(event){if(getKey(keys,0)&&getKey(keys,1)){action()}}
        e.hotkeyHandler = hotkeyHandler;
        document.addEventListener('keydown', hotkeyHandler);
      } else {
        console.log(id+': OFF');
        tmsDelete('tmKeep_hotkey-'+idsfx)
        if (e.hotkeyHandler) {
          document.removeEventListener('keydown', e.hotkeyHandler);
          e.hotkeyHandler = null;
        }
      }
    });
    // user settings
    if (tmsGet('tmKeep_hotkey-' + idsfx) === '1') {
      e.checked = true;
      e.dispatchEvent(new Event('change'));
    }
    // show
    this.show(eMainHotkeys);
  },
  handlePrep: function(data) {
    const [idsfx, title, action] = data;
    const mainId = 'tm-main-prep-'+idsfx;
    const prepId = 'tm-prep-exec-'+idsfx;
    // insert
    this.e.mainPrep.insertAdjacentHTML('beforeend',mustache(tmHTMLMainPrep,{id:mainId,title:title}));
    this.e.prep.insertAdjacentHTML('beforeend',mustache(tmHTMLPrepExec,{id:prepId}));
    // event
    getEl('#'+mainId).addEventListener('click', () => {
      // mainPrep
      this.e.prepTitle.textContent = title;
      this.e.prepTextarea.value = tmsGet('tmKeep_prepTextarea-'+idsfx, '');
      // prepExec
      getEls('.tm-group-prep-exec').forEach(e=>this.hide(e));
      const prepExec = getEl('#'+prepId);
      prepExec.addEventListener('click', () => {
        tmsSet('tmKeep_prepTextarea-'+idsfx, this.e.prepTextarea.value);
        this.showExec();
        action();
      });
      this.show(prepExec);
      this.showPrep();
    });
    // show
    this.show(eMainPrep);
  },
  handleMainExec: function(data) {
    const [idsfx, title, action] = data;
    const id = 'tm-main-exec-'+idsfx;
    this.e.mainExec.insertAdjacentHTML('beforeend',mustache(tmHTMLMainExec,{id:id,title:title}));
    getEl('#'+id).addEventListener('click',()=>{this.e.showExec();action()});
    this.show(eMainExec);
  },
  handleStorageView: function(){
    function contentInit() {
      const data = tmsGetAll();
      // insert
      this.e.modal.insertAdjacentHTML('beforeend', tmHTMLModalStorageview);
      const eContent = this.e.modal.lastElementChild;
      const eTbody = eContent.querySelector('tbody');
      eTbody.innerHTML = '';
      data.forEach(k=>{eTbody.insertAdjacentHTML('beforeend',mustache(
        tmHTMLModalStorageviewRow, {key:k, value:tmsGet(k)}
      ))});
      // events
      getEls('.tm-modal-storageview-row-copy').forEach(e=>{
        e.addEventListener('click',()=>{
          const value = e.getAttribute('data-value');
          navigator.clipboard.writeText(value)
            .then(() => {log(`Copied: ${value}`); })
            .catch(e => {console.error(`Failed to copy value: ${e}`); });
        });
      });
      getEl('#tm-modal-storageview-copyall').addEventListener('click',()=>{
        const allData = data.map(k=>{const v=tmsGet(k);return k+': '+v}).join('\n');
        navigator.clipboard.writeText(allData)
          .then(() => {console.log('Copied all key-value to clipboard')})
          .catch(e => {console.error(`Failed to copy all key-value: ${e}`)})
      });
    }
    // click view
    eMainStorageBodyView.addEventListener('click', () => {
      // modal
      ModalManager.buildContent({
        idsfx:'storage-view', accent:'info', title:'Storage View',
        actionPrepareContent: prepareContent,
        actionClose:()=>{},
      });
    });
  },
  handleStorageReset: function(){
    eMainStorageBodyReset.addEventListener('click',()=>{
      // reset
      tmsReset();
      this.renderOperation();
      // modal
      ModalManager.buildAlert({
        accent:'warning', title:'Storage Reset',
        msg: 'All non-premanent data has been removed from storage.',
        actionClose:()=>{},
      });
    });
  },
  handleStorageClean: function(){
    eMainStorageBodyClean.addEventListener('click',()=>{
      // clean
      tmsDeleteAll();
      this.renderOperation();
      // modal
      ModalManager.buildAlert({
        accent: 'error', title: 'Storage CLEAN',
        msg: 'ALL DATA has been deleted from storage.',
        actionClose:()=>{}
      });
    });
  },
  handleCancel: function(){ this.e.execCancel.addEventListener('click',()=>{
    this.reset('Exec canceled by user.')
  })},
  makeResizable: function(e) {
    let isResizing = false; let startX, startY, startWidth, startHeight;
    e.addEventListener('mousedown', (event) => {
      if (event.target.matches('button, input, textarea, .tm-slider')) return;
      if (event.button !== 0) return;
      isResizing = true;
      startX = event.clientX;
      startY = event.clientY;
      startHeight = this.state.hw[0];
      startWidth = this.state.hw[1];
      document.body.style.userSelect = 'none';
    });
    document.addEventListener('mousemove', (event) => {
      if (!isResizing) return;
      const newWidth = startWidth - (event.clientX - startX);
      const newHeight = startHeight - (event.clientY - startY);
      const hw = {
        Math.max(newHeight, parseInt(this.state.minHeight, 10))+'px',
        Math.max(newWidth, parseInt(this.state.minWidth, 10))+'px'
      }
    });
    document.addEventListener('mouseup', () => {
      if (isResizing) {
        isResizing = false;
        document.body.style.userSelect = '';
        tmsSet('tmKeep_hw-'+this.state.activeId, hw);
        this.state.setHw();
      }
    });
  },

  // === pause/reset/cancel ==============================
  pause: function(msg) {
    this.show(eExecContinue);
    ModalManager.buildAlert({
      accent: 'warning',
      title: 'tmMenu.Pause',
      msg: msg,
      actionClose: ()=>{},
    });
    await new Promise(resolve => {
      eExecContinue.onclick = resolve;
    });
    this.hide(eExecContinue);
  },
  reset: function(...args) {
    this.log('start..');
    tmsReset();
    this.showMain();
    // modal
    if(args.length>0){const joined=args.map(
      arg=>typeof arg==='object'?JSON.stringify(arg,null,2):String(arg)
    ).join(' ')}
    ModalManager.buildAlert({
      accent: 'warning',
      title: 'tmMenu.reset',
      msg: joined,
      actionClose: ()=>{},
    });
    this.log('done.');
  },
  abort: function(...args) {
    this.log('start..');
    tmsDeleteAll();
    this.showMain();
    // modal
    const joinedArgs=args.map(
      arg=>typeof arg==='object'?JSON.stringify(arg,null,2):String(arg)
    ).join('\n');
    const msg = joinedArgs?joinedArgs:'abort.';
    console.log(msg);
    ModalManager.buildAlert({
      accent: 'error',
      title: 'tmMenu.abort',
      msg: msg,
      actionClose:()=>{},
    });
    throw new AbortExecution(joinedArgs);
  },

  // === init ==============================
  init: function(map) {
    // listners
    this.handleAbort();
    this.handleBack();
    this.handleMinimize();
    this.handleReadme(map.readme);
    for (let data of map.hotkeys) {this.handleHotkey(data)}
    for (let data of map.btnsPrep) {this.handlePrep(data)}
    for (let data of map.btnsExec) {this.handleMainExec(data)}
    this.handleStorageView();
    this.handleStorageReset();
    this.handleStorageClean();
    this.handleCancel();
    // show
    if (this.state.operation) {
      this.showExec();
    } else {
      this.makeResizable(this.e.header);
      this.showMain();
    }
    this.log('done.');
  }
};
