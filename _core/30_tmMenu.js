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
  map: null,
  validateHw(hw, pass=false) {
    if (Array.isArray(hw)
        && hw.length === 2
        && hw.every(item => typeof item === 'number'
        && !isNaN(item))) {
      return hw
    }
    if (pass) {return false}
    tmUi.abort({
      title: 'validateHw()',
      msg: ['invalid hw', hw],
    });
  },
  isMain() {return tmsGet('tm_keep_activeId') === 'tm-main'},
  isPrep() {return tmsGet('tm_keep_activeId') === 'tm-prep'},
  isMnmz() {return tmsGet('tm_keep_mnmz')},
  isExec() {return tmsGetOperation()},
  getHwActual() {return [this.e.container.offsetHeight, this.e.container.offsetWidth]},
  getHwMain() {return tmsGet('tm_keep_hwMain')},
  getHwPrep() {return tmsGet('tm_keep_hwPrep')},
  setActiveId(val) {tmsSet('tm_keep_activeId', val)},
  setMnmz(val) {tmsSet('tm_keep_mnmz', val)},
  setHwMain(val) {tmsSet('tm_keep_hwMain', this.validateHw(val))},
  setHwPrep(val) {tmsSet('tm_keep_hwPrep', this.validateHw(val))},

  // === init ==============================
  init(map) {
    console.log('tmMenu.init(): start..');
    this.map = map;
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
    this.handleExecCancel();
    // show
    if (tmsGetOperation()) {
      this.setActiveId('tm-exec');
    } else {
      this.setActiveId('tm-main');
    }
    this.show();
    // done
    console.log('tmMenu.init(): done.');
  },

  // === listners ==============================
  // === listners.header ==============================
  handleAbort() {this.e.abort.addEventListener('click',()=>{
    tmUi.abort({
      title: 'Abort operation.',
      msg: 'Operation aborted by user. ALL DATA was deleted from storage.',
    });
  })},
  handleBack() {this.e.back.addEventListener('click',()=>{this.showMain()})},
  handleMnmz() {this.e.mnmz.addEventListener('click',()=>{
    if (this.e.mnmz.textContent === 'X') {
      this.setMnmz(true); console.log('tmMenu.handleMnmz(): off -> on');
    } else {
      this.setMnmz(false); console.log('tmMenu.handleMnmz(): on -> off');
    }
    this.showMain();
  })},
  // === listners.main ==============================
  handleReadme(link) {this.e.readme.querySelector('a').href=link},
  handleHotkey(hotkey) {
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
  handlePrep(data) {
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
      setTimeout(()=>{this.e.prepTextarea.focus()},100);
    });
    // show
    tmShow(this.e.mainPrep);
  },
  handleMainExec(data) {
    const [idsfx, title, action] = data;
    const id = 'tm-main-exec-'+idsfx;
    this.e.mainExec.insertAdjacentHTML('beforeend',mustache(tmHTMLMainExec,{id:id,title:title}));
    getEl('#'+id).addEventListener('click',()=>{this.e.showExec();action()});
    tmShow(this.e.mainExec);
  },
  handleStorageView() {
    const idsfx = 'storageview';
    this.e.storageView.addEventListener('click', ()=>{
      tmModal.content({
        idsfx: idsfx,
        accent: 'w',
        title: 'Storage View',
        actionContent: ()=>{
          const data = tmsGetAll();
          // insert content
          const content = getEl('#tm-modal-content-'+idsfx);
          content.insertAdjacentHTML('beforeend', tmHTMLModalStorageview);
          // modify
          const tbody = content.querySelector('table tbody');
          console.log('tbody', tbody);
          tbody.innerHTML = '';
          if (data.length === 0) {
            // rows
            tbody.insertAdjacentHTML('beforeend', `
              <tr class="tm-modal-storageview-row">
                <td>NONE</td><td>NONE</td><td>NONE</td>
              </tr>`);
            // copyAll
            getEl('#tm-modal-storageview-copyall').disabled = true;
            tmHide(getEl('#tm-modal-storageview-copyall'));
          } else {
            // rows
            data.forEach(k => {
              tbody.insertAdjacentHTML('beforeend', mustache(
                tmHTMLModalStorageviewRow, { key: k, value: tmsGet(k) }
              ));
            });
            getEls('.tm-modal-storageview-row').forEach(row => {
              const btnCopy = row.querySelector('.tm-modal-storageview-row-copy');
              const btnDelete = row.querySelector('.tm-modal-storageview-row-delete');
              const key = row.querySelector('.tm-modal-storageview-row-tdkey').getAttribute('data-key');
              const value = row.querySelector('.tm-modal-storageview-row-tdval').getAttribute('data-value');
              const data = key+': '+value;
              btnCopy.addEventListener('click', ()=>{
                tmCopy(data)
                  .then(()=>{tmModal.info({
                    accent: 'g',
                    title: 'StorageView.copy',
                    msg: ['Data was copied:', data],
                  })})
                  .catch(err => tmUi.abort({
                    title: 'StorageView.copy',
                    msg: ['Failed to copy:', err],
                  }));
              });
              btnDelete.addEventListener('click', ()=>{
                tmsDelete(key);
                this.showMain();
                tmModal.info({
                  accent: 'g',
                  title: 'StorageView.delete',
                  msg: ['Data was deleted: ', key],
                });
              });
            });
            // copyAll
            getEl('#tm-modal-storageview-copyall').addEventListener('click', ()=>{
              const allData = data.map(k => k+': '+tmsGet(k)).join('\n');
              tmCopy(allData)
                .then(() => {
                  tmModal.info({
                    accent: 'g',
                    title: 'StorageView.copyAll',
                    msg: ['All data was copied.', allData],
                  });
                })
                .catch(err => tmUi.abort({
                  title: 'StorageView.copyAll',
                  msg: ['Failed to copyAll:', err],
                }));
            });
          }
        },
      });
    });
  },
  handleStorageReset() {this.e.storageReset.addEventListener('click',()=>{
    tmUi.reset();
    tmModal.info({
      accent: 'y',
      title: 'Storage Reset',
      msg: 'All non-premanent data has been removed from storage.',
    });
  })},
  handleStorageClean() {this.e.storageClean.addEventListener('click',()=>{
    tmsDeleteAll();
    this.showMain();
    tmModal.info({
      accent: 'r',
      title: 'Storage CLEAN',
      msg: 'ALL DATA has been removed from storage.',
    });
  })},
  makeResizable(e) {
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
          tmUi.abort({
            title: 'tmMenu.makeResizable()',
            msg: 'wrong menu-type.',
          });
        }
      }
    });
  },
  // === listners.exec ==============================
  pause({accent, title, msg}) {
    return new Promise(resolve => {
      const handler = ()=>{
        tmHide(this.e.execContinue);
        this.e.execContinue.removeEventListener('click', handler);
        resolve();
      };
      this.e.execContinue.addEventListener('click', handler);
      this.showExecContinue();
      tmModal.info({accent:accent, title:title, msg:msg, actionClose:()=>{}});
    });
  },
  handleExecCancel() {this.e.execCancel.addEventListener('click',()=>{
    tmUi.reset();
    tmModal.info({
      accent: 'y',
      title: 'Cancel EXEC',
      msg: 'Exec canceled by user.',
    });
  })},

  // === show ==============================
  show() {
    if (this.isMain()) {this.showMain();return} // main
    if (this.isPrep()) {this.showPrep();return} // prep
    if (this.isExec()) {this.showExec();return} // exec
    tmUi.abort({
      title: 'tmMenu.show()',
      msg: 'unknown menu-type.',
    });
  },
  showMain() {
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
    this.updHotkeys();
    this.updContainer(this.getHwMain());
    // show
    tmShow(mnmz, main);
    tmHide(this.e.abort, back, prep, exec);
    // resize
    this.makeResizable(this.e.header);
    return;
  },
  showPrep() {
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
  showExec() {
    const {container, back, mnmz, main, prep, exec} = this.e;
    this.setActiveId('tm-exec');
    // upd
    this.updOperation();
    this.updMnmz();
    this.updContainer(false);
    // show
    tmShow(this.e.abort, exec);
    tmHide(back, mnmz, main, prep);
    return;
  },
  showExecContinue() {
    tmShow(this.e.execContinue);
  },
  // === upd ==============================
  updOperation(){
    const txt = tmsGetOperation() || 'None';
    const span = this.e.operation.querySelector('span');
    span.textContent = txt;
    if (txt === 'None') {
      addCls(this.e.operation, 'tm-brd-w', 'tm-bg-w');
      remCls(this.e.operation, 'tm-brd-y', 'tm-brd-r', 'tm-bg-y', 'tm-bg-r');
      addCls(span, 'tm-w');
      remCls(span, 'tm-y', 'tm-r');
    } else {
      addCls(this.e.operation, 'tm-brd-r', 'tm-bg-r');
      remCls(this.e.operation, 'tm-brd-y', 'tm-brd-w', 'tm-bg-y', 'tm-bg-w');
      addCls(span, 'tm-r');
      remCls(span, 'tm-y', 'tm-w');
    }
    this.operation ? tmShow(this.e.abort) : tmHide(this.e.abort);
  },
  updMnmz() {
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
  updHotkeys() {
    const containers = this.e.hotkeys.querySelectorAll('.tm-group-main-hotkeys');
    containers.forEach(container => {
      const fullId = container.getAttribute('id'); // "tm-main-hotkeys-<idsfx>"
      const idsfx = fullId.replace('tm-main-hotkeys-', '');
      const checkbox = container.querySelector('input[type="checkbox"]');
      if (tmsGet('tm_keep_hotkey-' + idsfx) === '1') {
        if (!checkbox.checked) {
          checkbox.checked = true;
          checkbox.dispatchEvent(new Event('change'));
        }
      } else {
        if (checkbox.checked) {
          checkbox.checked = false;
          checkbox.dispatchEvent(new Event('change'));
        }
      }
    });
  },
  updContainer(hw) {
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
};
