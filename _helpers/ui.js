// helpers
function tmAddClass(element, ...classes) {
  classes.forEach(cls => {
    if (!element.classList.contains(cls)) {
      element.classList.add(cls);
    }
  });
}
function tmRemoveClass(element, ...classes) {
  classes.forEach(cls => {
    if (element.classList.contains(cls)) {
      element.classList.remove(cls);
    }
  });
}
function tmUiBlock(...els){els.forEach(e =>{e.classList.remove('tm-hidden','tm-flex');e.classList.add('tm-block')})}
function tmUiFlex(...els){els.forEach(e=>{e.classList.remove('tm-hidden','tm-block');e.classList.add('tm-flex')})}
function tmUiHide(...els){els.forEach(e =>{e.classList.remove('tm-block','tm-flex');e.classList.add('tm-hidden')})}
function tmUiShowMain(){tmUiInitOperation();tmUiHide(getEl('#tm-prep'),getEl('#tm-execution'));tmUiFlex(getEl('#tm-minimize',getEl('#tm-main')))}
function tmUiShowPrep(){tmUiInitOperation();tmUiHide(getEl('#tm-main'),getEl('#tm-execution'));tmUiFlex(getEl('#tm-minimize'),getEl('#tm-prep'))}
function tmUiShowExecution(){tmUiInitOperation();tmUiHide(getEl('#tm-minimize'),getEl('#tm-main'),getEl('#tm-prep'));tmUiFlex(getEl('#tm-execution'))}
function makeResizebale(selector) {
  let c = getEl(selector);
  // Restore last size
  c.style.width = tmsGet('tm_keep_uiWidth_' + selector) || c.style.width;
  c.style.height = tmsGet('tm_keep_uiHeight_' + selector) || c.style.height;
  // Resize
  let isResizing = false;
  let startX, startY, startWidth, startHeight;
  c.addEventListener("mousedown", (e) => {
    if (e.target.matches("button, input, .tm-slider")) return; // Skip excluded elements
    if (e.button !== 0) return; // Only left mouse button
    isResizing = true;
    startX = e.clientX;
    startY = e.clientY;
    startWidth = c.offsetWidth;
    startHeight = c.offsetHeight;
    document.body.style.userSelect = "none"; // Disable text selection
  });
  document.addEventListener("mousemove", (e) => {
    if (!isResizing) return;
    let newWidth = startWidth - (e.clientX - startX);
    let newHeight = startHeight - (e.clientY - startY);
    c.style.width = `${Math.max(newWidth, 50)}px`; // Minimum width
    c.style.height = `${Math.max(newHeight, 50)}px`; // Minimum height
  });
  document.addEventListener("mouseup", () => {
    if (isResizing) {
      isResizing = false;
      document.body.style.userSelect = "";
      tmsSet('tm_keep_uiWidth_' + selector, c.style.width);
      tmsSet('tm_keep_uiHeight_' + selector, c.style.height);
    }
  });
}
// container
// header
function tmUiInitOperation() {
  let operation = tmsGetOperation();
  let txt = operation || 'None';
  // elements
  let e = getEl('#tm-operation');
  let span = e.querySelector('span');
  // upd txt
  span.textContent = txt;
  // classes
  if (txt === 'None') {
    tmRemoveClass(e,'tm-border-r');tmAddClass(e,'tm-border-g');
    tmRemoveClass(span,'tm-r');tmAddClass(span,'tm-g');
  } else {
    tmRemoveClass(e,'tm-border-g');tmAddClass(e,'tm-border-r');
    tmRemoveClass(span,'tm-g');tmAddClass(span,'tm-r');
  }
  // abort button
  tmUiInitAbortBtn(operation);
}
function tmUiInitAbortBtn(operation) {
  let e = getEl('#tm-abort');
  e.addEventListener('click',()=>{tmUiAbort('Execution aborted by user. All data was deleted from storage.')})
  if (operation) {tmUiFlex(e)} else {tmUiHide(e)}
}
function tmUiInitMinimize() {
  e = getEl('#tm-minimize');
  e.addEventListener('click',()=>{
    if (e.textContent === 'X') {
      let target = getEl('#tm-main').classList.contains('tm-hidden')?'#tm-prep':'#tm-main';
      tmsSet('tm_keep_minimized', target);
      e.textContent='^';
      tmUiHide(getEl(target));
    } else {
      let restore_target = tmsGet('tm_keep_minimized');
      tmsDelete('tm_keep_minimized');
      e.textContent='X';
      tmUiFlex(getEl(restore_target));
    }
  })
}
// main
function tmUiInitMain() {makeResizebale('#tm-main')}
function tmUiInitReadme(link){getEl('#tm-main-readme a').href=link}
function getKey(hotkeyPair,n) {
  const key = hotkeyPair.split('+')[n];
  if (key === 'Shift') return event.shiftKey;
  if (key === 'Ctrl') return event.ctrlKey;
  if (key === 'Alt') return event.altKey;
  if (key === 'Meta') return event.metaKey;
  return event.key === key;
}
function tmUiInitHotkeyPair(data) {
  let [idpfx, title, hotkeyPair, action] = data;
  let id = 'tm-thmb-' + idpfx;
  let c = getEl('#tm-main-hotkey-pairs');
  // Добавляем hotkeyPair в HTML
  c.insertAdjacentHTML('beforeend', `
    <div id="${id}" class="tm-row">
      <h3 class="tm-title tm-row tm-hotkey-title"><span>${title}</span><span class="tm-hotkey">(${hotkeyPair})</span></h3>
      <label class="tm-switch">
        <input type="checkbox">
        <span class="tm-slider"></span>
      </label>
    </div>
  `);
  let checkbox = getEl('#'+id+' input[type="checkbox"]');
  // Обработчик изменения состояния чекбокса
  checkbox.addEventListener('change', function () {
    if (checkbox.checked) {
      console.log(id+': ON');
      tmsSet('tm_keep_hotkeyPair-'+idpfx, '1')
      function hotkeyHandler(event){if(getKey(hotkeyPair,0)&&getKey(hotkeyPair,1)){action()}}
      checkbox.hotkeyHandler = hotkeyHandler;
      document.addEventListener('keydown', hotkeyHandler);
    } else {
      console.log(id+': OFF');
      tmsDelete('tm_keep_hotkeyPair-'+idpfx)
      if (checkbox.hotkeyHandler) {
        document.removeEventListener('keydown', checkbox.hotkeyHandler);
        checkbox.hotkeyHandler = null;
      }
    }
  });
  // воостановить пользовательские значения
  if (tmsGet('tm_keep_hotkeyPair-' + idpfx) === '1') {
    checkbox.checked = true; // Установить состояние чекбокса как включенное
    checkbox.dispatchEvent(new Event('change')); // Триггерим обработчик для применения действия
  }
  // show
  tmUiFlex(c);
}
// main.buttons
function tmUiInitBtnPrep(data) {
  let [idpfx, title, action] = data;
  let cMain = getEl('#tm-main-btns-prep');
  let cPrep = getEl('#tm-prep-body');
  let mainGroupClass = 'tm-main-btn-prep';
  let prepGroupClass = 'tm-prep-btn-exec';
  let mainId = mainGroupClass+'-'+idpfx;
  let prepId = prepGroupClass+'-'+idpfx;
  // Добавляем кнопки в DOM
  cMain.insertAdjacentHTML(
    'beforeend',
    `<button id="${mainId}" class="tm-btn-g ${mainGroupClass}">${title} -&gt;</button>`
  );
  tmUiFlex(cMain);
  cPrep.insertAdjacentHTML(
    'beforeend',
    `<button id="${prepId}" class="tm-btn-r ${prepGroupClass}">EXEC</button>`
  );
  // Привязываем обработчик к кнопке
  getEl('#'+mainId).addEventListener('click', () => {
    getEl('#tm-prep-title').textContent = title;
    let textarea = getEl('#tm-prep-textarea');
    textarea.value = tmsGet('tm_keep_uiTextareaValue_'+idpfx, '');
    textarea.addEventListener('input', () => {
      tmsSet('tm_keep_uiTextareaValue_'+idpfx, textarea.value);
    });
    // Скрываем другие EXEC кнопки
    getEls('.'+prepGroupClass).forEach(e => tmUiHide(e));
    // Показ текущей EXEC кнопки
    let prepExec = getEl('#'+prepId);
    tmUiBlock(prepExec);
    prepExec.addEventListener('click', () => {
      tmUiShowExecution();
      action();
    });
    tmUiShowPrep();
  });
}
function tmUiInitBtnExec(data) {
  let [idpfx, title, action] = data;
  let groupClass = 'tm-main-btn-exec';
  let id = `${groupClass}-${idpfx}`;
  let container = getEl('#tm-main-btns-exec');

  // Добавляем кнопку в контейнер
  container.insertAdjacentHTML(
    'beforeend',
    `<button id="${id}" class="tm-btn-y ${groupClass}">EXEC: ${title}</button>`
  );
  tmUiFlex(getEl('#tm-main-btns-exec'));

  // Привязываем обработчик события к только что созданной кнопке
  let button = getEl(`#${id}`);
  button.addEventListener('click', () => {
    tmUiShowExecution();
    action();
  });

  // Лог для отладки
  console.log('EXEC Button added: '+id);
}

// main.storage
function tmUiInitStorageView() {
  // Инициализация кнопки для отображения модального окна
  getEl('#tm-storage-view').addEventListener('click', () => {
    // Заполняем содержимое модального окна
    const data = tmsGetAll(); // Получаем все ключи
    const contentEl = getEl('#tm-modal-storage-view-content'); // Контейнер для строк
    contentEl.innerHTML = ''; // Очищаем существующее содержимое

    // Создаем строки для каждого ключа
    data.forEach(key => {
      const value = localStorage.getItem(key);
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${key}</td>
        <td>
          <button class="tm-storage-copy-row tm-btn-g" data-value="${value}">Copy</button>
          <span class="tm-storage-value">${value}</span>
        </td>
      `;
      contentEl.appendChild(row);
    });

    // Добавляем обработчики событий для кнопок Copy после их создания
    getEls('.tm-storage-copy-row').forEach(e => {
      e.addEventListener('click', (event) => {
        const value = event.target.getAttribute('data-value');
        navigator.clipboard.writeText(value)
          .then(() => { console.log(`Copied: ${value}`); })
          .catch(e => { console.error(`Failed to copy value: ${e}`); });
      });
    });

    // Показываем модальное окно
    tmUiBlock(getEl('#tm-modal-storage-view'));
  });

  // Закрытие модального окна
  getEl('#tm-storage-close').addEventListener('click', () => {
    tmUiHide(getEl('#tm-modal-storage-view'));
  });

  // Копирование всех ключей и значений
  getEl('#tm-storage-copy-all').addEventListener('click', () => {
    const allData = tmsGetAll().map(key => {
      const value = localStorage.getItem(key);
      return `${key}: ${value}`;
    }).join('\n');
    navigator.clipboard.writeText(allData)
      .then(() => {
        console.log('Copied all key-value pairs to clipboard');
      })
      .catch(e => {
        console.error(`Failed to copy all key-value pairs: ${e}`);
      });
  });
}
function tmUiInitStorageReset() {
  getEl('#tm-storage-reset').addEventListener('click',()=>{
    tmsReset();
    tmUiInitOperation();
    // allert('Storage.Reset: all non-premanent data was removed from storage.')
    ModalManager.buildAlert({
      accent: 'warning',
      title: 'Storage.Reset',
      msg: 'all non-premanent data was removed from storage.',
      actionClose: ()=>{},
    });
  });
}
function tmUiInitStorageClen() {
  getEl('#tm-storage-clean').addEventListener('click',()=>{
    tmsDeleteAll();
    tmUiInitOperation();
    // allert('Storage.CLEAN: all data was deleted from storage.')
    ModalManager.buildAlert({
      accent: 'error',
      title: 'Storage.CLEAN',
      msg: 'all data was deleted from storage.',
      actionClose: ()=>{},
    });
  });
}
// prep
function tmUiInitPrep(){makeResizebale('#tm-prep')}
function tmUiInitBack(){getEl('#tm-prep-back').addEventListener('click',()=>{tmUiShowMain()})}
async function tmUiPause(msg) {
  let e = getEl('#tm-execution-continue');
  tmUiBlock(e);
  await sleep(100);
  // allert('tmUiPause: '+msg);
  ModalManager.buildAlert({
    accent: 'warning',
    title: 'tmUiPause',
    msg: msg,
    actionClose: ()=>{},
  });
  await new Promise(resolve => {
    e.onclick = resolve;
  });
  tmUiHide(e);
}
// execution
function tmUiInitBtnCancel() {
  getEl('#tm-execution-cancel').addEventListener('click',()=>{tmUiReset('Execution canceled by user.')});
}

// === init ==============================
function tmUiInit(map) {
  // container
  console.log('tmUiInit.container: done.');
  // header
  tmUiInitMinimize();
  console.log('tmUiInit.header: done.');
  // main
  tmUiInitMain();
  tmUiInitReadme(map.readme);
  for (let data of map.hotkeyPairs){tmUiInitHotkeyPair(data)}
  for (let data of map.btnsPrep){tmUiInitBtnPrep(data)}
  for (let data of map.btnsExec){tmUiInitBtnExec(data)}
  tmUiInitStorageView();
  tmUiInitStorageClen();
  tmUiInitStorageReset();
  console.log('tmUiInit.main: done.');
  // prep
  tmUiInitPrep();
  tmUiInitBack();
  // exec
  tmUiInitBtnCancel();
  // show
  let operation = tmsGetOperation();
  if (operation) {
    tmUiShowExecution()
  } else {
    // show menu
    tmUiShowMain()
    // restore user minimize state
    let e=getEl('#tm-main');
    if (tmsGet('tm_keep_minimized')==='#tm-main') {
      tmUiHide(e);
      getEl('#tm-minimize').textContent='^';
    } else {
      tmUiFlex(e)
    }
  }
  console.log('tmUiInit: done.');
}
// abort/reset
function tmUiAbort(...args) {
  console.log('tmUiAbort: init..')
  tmsDeleteAll(); // clean storage
  tmUiShowMain();
  abort(...args);
}
function tmUiReset(...args) {
  console.log('tmUiReset: init..');
  tmsReset();
  tmUiShowMain();
  // Если есть аргументы, формируем сообщение и вызываем alert
  if (args.length > 0) {
    const joinedArgs = args.map(arg =>
      typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
    ).join(' ');
    // allert('tmUiReset: ' + joinedArgs);
    ModalManager.buildAlert({
      accent: 'warning',
      title: 'tmUiReset',
      msg: joinedArgs,
      actionClose: ()=>{},
    });
  }
  console.log('tmUiReset: done.');
}
function tmStart(actionName) {
  tmsSetOperation(actionName+'/start');
  tmUiShowExecution();
}
