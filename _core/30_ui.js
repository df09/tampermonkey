const tmMenu = {
  // === elements ====================================
  e: {
    container: getEl('#tm-menu'),
    // header
    header: getEl('#tm-header'),
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
  },
  // === state ==================================
    activeId: 'tm-main',
    operation: tmsGetOperation(),
    initHw: [250,350],
    isMinimized: tmsGet('tm_keep_isMinimized') || false,
    getHwMain: function(){return tmsGet('tm_keep_hwMain')},
    getHwPrep: function(){return tmsGet('tm_keep_hwPrep')},
    getHwMinz: function(){return tmsGet('tm_keep_hwMinz')},
    // minimizedHeight: 30,
    setIsMinimized: function(val){tmsSet('tm_keep_isMinimized',val);this.isMinimized=val},
    setHw: function(activeId, isInit=false) {
      // main, minimized
      if (activeId == 'tm-main' && this.isMinimized) {
        this.mainHw = this.minimizedHeight, this.e.container.offsetWidth;
        console.log('tmMenu.state.setHw(): main,minimized - using css min-height, min-width.', this.mainHw);
        return;
      }
      // main + prep, storage
      const tmsHw = tmsGet('tm_keep_hw-'+activeId);
      if (Array.isArray(tmsHw) && tmsHw.length === 2) {
        if (activeId === 'tm-main') { this.mainHw = tmsHw; } else { this.prepHw = tmsHw; }
        console.log('tmMenu.state.setHw(): '+activeId+' - using storage.', tmsHw);
        return;
      }
      // main + prep, init size
      let hw = [];
      if (isInit) {
        hw = this.initHw;
        console.log('tmMenu.state.setHw(): '+activeId+' - init using initHw and save to storage.', hw);
      // main + prep, current size
      } else {
        hw = [tmMenu.e.container.offsetHeight, tmMenu.e.container.offsetWidth];
        console.log('tmMenu.state.setHw(): '+activeId+' - using current hw and save to storage.', hw);
      }
      tmsSet('tm_keep_hw-'+activeId, hw);
      if (activeId === 'tm-main') { this.mainHw = hw; } else { this.prepHw = hw; }
    },
  },
  // === show/hide ==============================
  showMain: function(){
    const {abort, back, minimize, main, prep, exec} = this.e;
    if (this.state.isMinimized) {
      tmShow(minimize);
      tmHide(abort, back, main, prep, exec);
    } else {
      tmShow(minimize, main);
      tmHide(abort, back, prep, exec);
    }
    this.render(main.id);
  },
  showPrep: function(){
    const {abort, back, minimize, main, prep, exec} = this.e;
    tmShow(back, prep);
    tmHide(abort, minimize, main, exec);
    this.render(prep.id);
  },
  showExec: function(){
    const {abort, back, minimize, main, prep, exec} = this.e;
    tmShow(abort, exec);
    tmHide(back, minimize, main, prep);
    this.render(exec.id);
  },

  // === render ==============================
  render: function(activeId) {

    this.state.activeId = acitveId;
    tmsSet('tm_keep_activeId',id);

    this.renderOperation();
    this.renderMinimize();
    this.renderSize();
    console.log('tmMenu.render(): done.');
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
    this.state.operation ? tmShow(this.e.abort) : tmHide(this.e.abort);
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
    let hw;
    console.log(this.state.minimizedHeight);
    console.log(this.e.container.offsetWidth);
    console.log(this.state.activeId);
    console.log(this.state.mainHw);
    console.log(this.state.prepHw);
    if (this.state.isMinimized) {
      hw = [this.state.minimizedHeight, this.e.container.offsetWidth];
    } else {
      hw = this.state.activeId === 'tm-main' ? this.state.mainHw : this.state.prepHw;
    }
    this.e.container.style.height = hw[0]+'px';
    this.e.container.style.width = hw[1]+'px';
    this.e.container.style.position = 'fixed';
    this.e.container.style.bottom = '5px';
    this.e.container.style.right = '10px';
    console.log('tmMenu.renderSize(): done.', this.state.activeId, hw);
  },

  // === listners ==============================
  handleAbort: function(){this.e.abort.addEventListener('click',()=>{
    this.abort('Exec aborted by user. ALL DATA was deleted from storage.')
  })},
  handleBack: function(){this.e.back.addEventListener('click',()=>{this.showMain()})},
  handleMinimize: function(){this.e.minimize.addEventListener('click',()=>{
    if (this.e.minimize.textContent === 'X') {
      this.state.setIsMinimized(true);
      this.state.mainHw = this.minimizedHeight, this.e.container.offsetWidth;
      console.log('tmMenu.handleMinimize(): off -> on');
    } else {
      this.state.setIsMinimized(false);
      console.log('tmMenu.handleMinimize(): on -> off');
    }
    this.showMain();
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
    const checkbox = getEl('#' + id + ' input[type="checkbox"]');
    const hotkeyHandler = (event) => {
      console.log('hotkeyHandler: start..');
      if (getKey(event, keys, 0) && getKey(event, keys, 1)) {
      // if (event.shiftKey && event.key === 'J') { // Проверяем нажатие Shift + J
        console.log('hotkeyHandler: get keys ok..');
        action();
      }
      console.log('hotkeyHandler: done.');
    };
    checkbox.addEventListener('change', function () {
      if (checkbox.checked) {
        console.log('tmMenu.handleHotkey(): ' + id + ': ON');
        tmsSet('tm_keep_hotkey-' + idsfx, '1');
        document.addEventListener('keydown', hotkeyHandler);
      } else {
        console.log('tmMenu.handleHotkey(): ' + id + ': OFF');
        tmsDelete('tm_keep_hotkey-' + idsfx);
        document.removeEventListener('keydown', hotkeyHandler);
      }
    });
    // user settings
    if (tmsGet('tm_keep_hotkey-' + idsfx) === '1') {
      checkbox.checked = true;
      checkbox.dispatchEvent(new Event('change'));
    }
    // show
    tmShow(this.e.hotkeys);
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
      this.e.prepTextarea.value = tmsGet('tm_keep_prepTextarea-'+idsfx, '');
      // prepExec
      getEls('.tm-group-prep-exec').forEach(e=>tmHide(e));
      const prepExec = getEl('#'+prepId);
      prepExec.addEventListener('click', () => {
        tmsSet('tm_keep_prepTextarea-'+idsfx, this.e.prepTextarea.value);
        this.showExec();
        action();
      });
      tmShow(prepExec);
      this.showPrep();
    });
    // show
    tmShow(this.e.mainPrep);
  },
  handleMainExec: function(data) {
    const [idsfx, title, action] = data;
    const id = 'tm-main-exec-'+idsfx;
    this.e.mainExec.insertAdjacentHTML('beforeend',mustache(tmHTMLMainExec,{id:id,title:title}));
    getEl('#'+id).addEventListener('click',()=>{this.e.showExec();action()});
    tmShow(this.e.mainExec);
  },
  handleStorageView: function(){
    function prepareContent() {
      // insert
      const e = getEl('#tm-modal-storageview');
      const data = tmsGetAll();
      e.insertAdjacentHTML('beforeend', tmHTMLModalStorageview);
      const content = e.lastElementChild;
      const tbody = content.querySelector('tbody');
      tbody.innerHTML = '';
      data.forEach(k=>{tbody.insertAdjacentHTML('beforeend',mustache(
        tmHTMLModalStorageviewRow, {key:k, value:tmsGet(k)}
      ))});
      // events
      getEls('.tm-modal-storageview-row-copy').forEach(e=>{
        e.addEventListener('click',()=>{
          const value = e.getAttribute('data-value');
          navigator.clipboard.writeText(value)
            .then(() => {console.log('tmMenu.storageView(): copied', value)})
            .catch(e => {abort('tmMenu.storageView(): failed to copy value', e)})
        });
      });
      getEl('#tm-modal-storageview-copyall').addEventListener('click',()=>{
        const allData = data.map(k=>{const v=tmsGet(k);return k+': '+v}).join('\n');
        navigator.clipboard.writeText(allData)
          .then(() => {console.log('tmMenu.storageView(): copied all.')})
          .catch(e => {abort('tmMenu.storageView(): failed to copy all', e)})
      });
    }
    // click view
    this.e.storageView.addEventListener('click', () => {
      tmModal.content({
        id: 'tm-modal-content-storageview', accent:'info', title:'Storage View',
        actionClose: ()=>{},
        actionContent: ()=>prepareContent(),
      });
    });
  },
  handleStorageReset: function(){
    this.e.storageReset.addEventListener('click',()=>{
      tmsReset();
      this.showMain();
      tmModal.info({
        accent:'warning', title:'Storage Reset',
        msg: 'All non-premanent data has been removed from storage.',
        actionClose:()=>{},
      });
    });
  },
  handleStorageClean: function(){
    this.e.storageClean.addEventListener('click',()=>{
      tmsDeleteAll();
      this.renderOperation();
      tmModal.info({
        accent: 'error', title: 'Storage CLEAN',
        msg: 'ALL DATA has been deleted from storage.',
        actionClose:()=>{},
      });
    });
  },
  handleCancel: function(){ this.e.execCancel.addEventListener('click',()=>{
    this.reset('Exec canceled by user.')
  })},
  makeResizable: function(e) {
    let isResizing = false; let startX, startY, startWidth, startHeight;
    e.style.cursor = 'pointer';
    e.addEventListener('mousedown', (event) => {
      if (event.target.matches('button, input, textarea, .tm-slider')) return;
      if (event.button !== 0) return;
      isResizing = true;
      startX = event.clientX;
      startY = event.clientY;
      hw = this.state.activeId === 'tm-main' ? this.state.mainHw : this.state.prepHw;
      startHeight = hw[0];
      startWidth = hw[1];
      document.body.style.userSelect = 'none';
    });
    document.addEventListener('mousemove', (event) => {
      if (!isResizing) return;
      const newWidth = startWidth - (event.clientX - startX);
      const newHeight = startHeight - (event.clientY - startY);
      this.e.container.style.height = Math.max(newHeight, this.state.minHeight)+'px';
      this.e.container.style.width = newWidth+'px';
    });
    document.addEventListener('mouseup', () => {
      if (isResizing) {
        isResizing = false;
        document.body.style.userSelect = '';
        tmsSet('tm_keep_hw-'+this.state.activeId,[
          this.e.container.offsetHeight, this.e.container.offsetWidth
        ]);
        this.state.setHw(this.state.activeId);
      }
    });
  },

  // === pause/reset/cancel ==============================
  // TODO: remove pause at all?
  // pause: function(msg) {
  //   tmShow(this.e.execContinue);
  //   tmModal.info({
  //     accent: 'warning',
  //     title: 'tmMenu.Pause',
  //     msg: msg,
  //     actionClose: ()=>{},
  //   });
  //   await new Promise(resolve => {
  //     this.e.execContinue.onclick = resolve;
  //   });
  //   tmHide(this.e.execContinue);
  // },
  reset: function(...args) {
    console.log('tmMenu.reset(): start..');
    tmsReset();
    this.showMain();
    // modal
    if(args.length>0){const joined=args.map(
      arg=>typeof arg==='object'?JSON.stringify(arg,null,2):String(arg)
    ).join(' ')}
    tmModal.info({
      accent: 'warning',
      title: 'tmMenu.reset',
      msg: joined,
      actionClose: ()=>{},
    });
    console.log('tmMenu.reset(): done.');
  },
  abort: function(...args) {
    console.log('tmMenu.reset(): start..');
    tmsDeleteAll();
    this.showMain();
    // modal
    const joinedArgs=args.map(
      arg=>typeof arg==='object'?JSON.stringify(arg,null,2):String(arg)
    ).join('\n');
    const msg = joinedArgs?joinedArgs:'abort.';
    console.log(msg);
    tmModal.info({
      accent: 'error',
      title: 'tmMenu.abort',
      msg: msg,
      actionClose:()=>{},
    });
    throw new AbortExecution(joinedArgs);
  },

  // === init ==============================
  init: function(map) {
    console.log('tmMenu.init(): start..');
    this.state.setHw('tm-main', isInit=true);
    this.state.setHw('tm-prep', isInit=true);
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
    console.log('tmMenu.init(): done.', this.state);
  }
};
