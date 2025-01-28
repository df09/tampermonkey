const tmMenu = {
  // === elements ====================================
  e: {
    container: getEl('#tm-menu'),
    // header
    header: getEl('#tm-header'),
    operation: getEl('#tm-operation'),
    abort: getEl('#tm-abort'),
    back: getEl('#tm-back'),
    mnmz: getEl('#tm-minimize'),
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
  // === storage ==============================
  validateHw: function(hw, pass=false) {
    if (Array.isArray(hw) && hw.length === 2 &&
      hw.every(item => typeof item === 'number' && !isNaN(item))) {
        return hw;
    }
    if (pass) {
        return false;
    }
    abort('tmMenu.validateHw(): invalid hw', hw);
  },
  isMain: function() {return tmsGet('tm_keep_activeId') === 'tm-main'},
  isPrep: function() {return tmsGet('tm_keep_activeId') === 'tm-prep'},
  isMnmz: function() {return tmsGet('tm_keep_mnmz')},
  isExec: function() {return tmsGetOperation()},
  getHwActual: function() {return [this.e.container.offsetHeight, this.e.container.offsetWidth]},
  getHwMain: function() {return tmsGet('tm_keep_hwMain')},
  getHwPrep: function() {return tmsGet('tm_keep_hwPrep')},
  setActiveId: function(val) {tmsSet('tm_keep_activeId', val)},
  setMnmz: function(val) {tmsSet('tm_keep_mnmz', val)},
  setHwMain: function(val) {tmsSet('tm_keep_hwMain', this.validateHw(val))},
  setHwPrep: function(val) {tmsSet('tm_keep_hwPrep', this.validateHw(val))},

  // === init ==============================
  init: function(map) {
    console.log('tmMenu.init(): start..');
    // listners
    this.handleAbort();
    this.handleBack();
    this.handleMnmz();
    this.handleReadme(map.readme);
    for (let data of map.hotkeys) {this.handleHotkey(data)}
    for (let data of map.btnsPrep) {this.handlePrep(data)}
    for (let data of map.btnsExec) {this.handleMainExec(data)}
    this.handleStorageView();
    this.handleStorageReset();
    this.handleStorageClean();
    this.handleCancel();
    // show
    this.setActiveId('tm-main');
    this.show();
    // done
    console.log('tmMenu.init(): done.');
  },

  // === listners ==============================
  handleAbort: function(){this.e.abort.addEventListener('click',()=>{
    this.abort('Exec aborted by user. ALL DATA was deleted from storage.')
  })},
  handleBack: function(){this.e.back.addEventListener('click',()=>{this.showMain()})},
  handleMnmz: function(){this.e.mnmz.addEventListener('click',()=>{
    if (this.e.mnmz.textContent === 'X') {
      this.setMnmz(true); console.log('tmMenu.handleMnmz(): off -> on');
    } else {
      this.setMnmz(false); console.log('tmMenu.handleMnmz(): on -> off');
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
      const eActive = document.activeElement;
      if (eActive.tagName==='INPUT'||eActive.tagName==='TEXTAREA'||eActive.isContentEditable) {return}
      if (getKey(event, keys, 0) && getKey(event, keys, 1)) {action()}
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
      // prep title
      this.e.prepTitle.textContent = title;
      // prep textarea
      this.e.prepTextarea.value = tmsGet('tm_keep_prepTextarea-'+idsfx, '');
      this.e.prepTextarea.addEventListener('change', (event) => {
        tmsSet('tm_keep_prepTextarea-'+idsfx, event.target.value);
      });
      // prep exec
      getEls('.tm-group-prep-exec').forEach(e=>tmHide(e));
      const prepExec = getEl('#'+prepId);
      prepExec.addEventListener('click',()=>{this.showExec();action()});
      tmShow(prepExec);
      // show prep
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
      this.updOperation();
      tmModal.info({
        accent: 'error', title: 'Storage CLEAN',
        msg: 'ALL DATA has been deleted from storage.',
        actionClose:()=>{},
      });
    });
  },
  handleCancel: function(){ this.e.execCancel.addEventListener('click',()=>{
    this.reset('Exec canceled by user.')
    this.showMain();
  })},
  makeResizable: function(e) {
    let isResizing = false;
    let yxStart, hwStart;
    // cursor
    e.addEventListener('mouseover',()=>{if(!this.isMnmz()){e.style.cursor='pointer'}else{e.style.cursor=''}});
    e.addEventListener('mouseout',()=>{e.style.cursor = ''});
    // resize
    e.addEventListener('mousedown', (event) => {
      if (this.isMnmz()) return;
      if (event.target.matches('button, input, textarea, .tm-slider')) return;
      if (event.button !== 0) return;
      isResizing = true;
      yxStart = [event.clientY, event.clientX];
      hwStart = this.getHwActual();
      console.log('yxStart:', yxStart);
      console.log('hwStart:', hwStart);
      document.body.style.userSelect = 'none';
    });
    document.addEventListener('mousemove', (event) => {
      if (!isResizing) return;
      this.e.container.style.height = hwStart[0] - (event.clientY - yxStart[0]) + 'px';
      this.e.container.style.width = hwStart[1] - (event.clientX - yxStart[1]) + 'px';
    });
    document.addEventListener('mouseup', () => {
      if (isResizing) {
        isResizing = false;
        document.body.style.userSelect = '';
        // set hw
        if (this.isMnmz()) return; // Не сохранять размеры в режиме mnmz
        const hw = this.getHwActual();
        if (this.isMain()) {
          this.setHwMain(hw)
        } else if (this.isPrep()) {
          this.setHwPrep(hw)
        } else {
          abort('tmMenu.makeResizable(): wrong menu-type.')
        }
      }
    });
  },

  // === show ==============================
  show: function() {
    if (this.isMain()) {this.showMain();return} // main
    if (this.isPrep()) {this.showPrep();return} // prep
    if (this.isExec()) {this.showExec();return} // exec
    abort('tmMenu.show(): unknown menu-type.');
  },
  showExec: function() {
    const {container, back, mnmz, main, prep, exec} = this.e;
    this.setActiveId('tm-exec');
    // upd
    this.updOperation();
    this.updMnmz();
    // show
    tmShow(this.e.abort, exec);
    tmHide(back, mnmz, main, prep);
    return;
  },
  showMain: function() {
    const {container, back, mnmz, main, prep, exec} = this.e;
    this.setActiveId('tm-main');
    if (this.isMnmz()) {
      // upd
      this.updOperation();
      this.updMnmz();
      this.updContainer(false);
      // show
      tmShow(mnmz);
      tmHide(this.e.abort, back, main, prep, exec);
      return;
    };
    // upd
    this.updOperation();
    this.updMnmz();
    this.updContainer(this.getHwMain());
    // show
    tmShow(mnmz, main);
    tmHide(this.e.abort, back, prep, exec);
    // resize
    this.makeResizable(this.e.header);
    return;
  },
  showPrep: function() {
    const {container, back, mnmz, main, prep, exec} = this.e;
    this.setActiveId('tm-prep');
    // upd
    this.updOperation();
    this.updMnmz();
    this.updContainer(this.getHwPrep());
    // show
    tmShow(back, prep);
    tmHide(this.e.abort, mnmz, main, exec);
    // resize
    this.makeResizable(this.e.header);
    return;
  },
  // === upd ==============================
  updOperation: function(){
    const txt = tmsGetOperation() || 'None';
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
    this.operation ? tmShow(this.e.abort) : tmHide(this.e.abort);
  },
  updMnmz: function() {
    if (this.isMnmz()) {
      this.e.mnmz.textContent = '^';
      addCls(this.e.mnmz, 'tm-btn-b', 'tm-btn-header-b');
      remCls(this.e.mnmz, 'tm-btn-r', 'tm-btn-header-r');
    } else {
      this.e.mnmz.textContent = 'X';
      addCls(this.e.mnmz, 'tm-btn-r', 'tm-btn-header-r');
      remCls(this.e.mnmz, 'tm-btn-b', 'tm-btn-header-b');
    }
  },
  updContainer: function(hw) {
    const c = this.e.container;
    c.removeAttribute('style');
    if (this.validateHw(hw, pass=true)) {
      c.style.position = 'fixed';
      c.style.bottom = '5px';
      c.style.right = '10px';
      c.style.height = hw[0]+'px';
      c.style.width = hw[1]+'px';
    }
  },

  // === reset/cancel ==============================
  reset: function(...args) {
    console.log('tmMenu.reset(): start..');
    tmsReset();
    this.showMain();
    // Объединяем аргументы в строку
    let joined = 'NONE';
    if (args.length > 0) {
      joined = args.map(arg =>
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
    }
    // Показываем модальное окно
    tmModal.info({
      accent: 'warning',
      title: 'tmMenu.reset',
      msg: joined,
      actionClose: () => {
        console.log('tmModal closed.');
      }, // Добавлен лог при закрытии модального окна
    });
    console.log('tmMenu.reset(): done.');
  },
  abort: function(...args) {
    console.log('tmMenu.reset(): start..');
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
      actionClose: ()=>{
        tmsDeleteAll();
        this.showMain();
      },
    });
    throw new AbortExecution(joinedArgs);
  },
};
