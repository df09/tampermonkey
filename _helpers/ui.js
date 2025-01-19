// helpers
function tmUiGetDisplay(...els) {
  return els.map(el => {
    const computedStyle = window.getComputedStyle(el);
    return computedStyle.display;
  });
}
function tmUiBlock(...els) {
  els.forEach(el => {
    el.classList.remove('tm-hidden', 'tm-flex'); // Удаляем другие классы
    el.classList.add('tm-block'); // Добавляем класс для отображения как блок
  });
}
function tmUiFlex(...els) {
  els.forEach(el => {
    el.classList.remove('tm-hidden', 'tm-block'); // Удаляем другие классы
    el.classList.add('tm-flex'); // Добавляем класс для отображения как flex
  });
}
function tmUiHide(...els) {
  els.forEach(el => {
    el.classList.remove('tm-block', 'tm-flex'); // Удаляем классы отображения
    el.classList.add('tm-hidden'); // Добавляем класс для скрытия
  });
}
function tmUiToggleBlock(...els){els.forEach(el=>{el.style.display=(el.style.display==='none')?'block':'none'})}
function tmUiToggleFlex(...els){els.forEach(el=>{el.style.display=(el.style.display==='none')?'flex':'none'})}
function tmUiShowMain(){tmUiInitOperation();tmUiHide(getEl('#tm-prep'),getEl('#tm-execution'));tmUiFlex(getEl('#tm-minimize'),getEl('#tm-main'))}
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
  c.addEventListener("mousedown", (el) => {
    if (el.target.matches("button, input, .tm-slider")) return; // Skip excluded elements
    if (el.button !== 0) return; // Only left mouse button
    isResizing = true;
    startX = el.clientX;
    startY = el.clientY;
    startWidth = c.offsetWidth;
    startHeight = c.offsetHeight;
    document.body.style.userSelect = "none"; // Disable text selection
  });
  document.addEventListener("mousemove", (el) => {
    if (!isResizing) return;
    let newWidth = startWidth - (el.clientX - startX);
    let newHeight = startHeight - (el.clientY - startY);
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
  let el = getEl('#tm-operation');
  let span = el.querySelector('span');
  // upd txt
  span.textContent = txt;
  // classes
  el.className = txt === 'None'?'tm-title tm-border-g':'tm-title tm-border-r';
  span.className = txt === 'None'?'tm-g':'tm-r';
  // abort button
  tmUiInitAbortBtn(operation);
}
function tmUiInitAbortBtn(operation) {
  let el = getEl('#tm-abort');
  el.addEventListener('click',()=>{tmUiAbort('Execution aborted by user. All data was deleted from storage.')})
  if (operation) {tmUiFlex(el)} else {tmUiHide(el)}
}
function tmUiInitMinimize() {
  el = getEl('#tm-minimize');
  el.addEventListener('click',()=>{
    if (el.textContent === 'X') {
      let minimized = tmUiGetDisplay(getEl('#tm-main'))==='none'?'#tm-prep':'#tm-main';
      tmsSet('tm_keep_minimized', minimized);
      tmUiHide(getEl(minimized));
      el.textContent='^';
    } else {
      tmUiFlex(getEl(tmsGet('tm_keep_minimized')));
      tmsDelete('tm_keep_minimized');
      el.textContent='X';
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
      <h3 class="tm-title">${title} <span class="tm-hotkey">(${hotkeyPair})</span></h3>
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
      tmsSet('tm_keep_'+idpfx, '1')
      function hotkeyHandler(event){if(getKey(hotkeyPair,0)&&getKey(hotkeyPair,1)){action()}}
      checkbox.hotkeyHandler = hotkeyHandler;
      document.addEventListener('keydown', hotkeyHandler);
    } else {
      console.log(id+': OFF');
      tmsDelete('tm_keep_'+idpfx)
      if (checkbox.hotkeyHandler) {
        document.removeEventListener('keydown', checkbox.hotkeyHandler);
        checkbox.hotkeyHandler = null;
      }
    }
  });
  // воостановить пользовательские значения
  if (tmsGet('tm_keep_' + idpfx) === '1') {
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
    getEls('.'+prepGroupClass).forEach(el => tmUiHide(el));
    // Показ текущей EXEC кнопки
    let prepExec = getEl('#'+prepId);
    tmUiFlex(prepExec);
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
    getEls('.tm-storage-copy-row').forEach(el => {
      el.addEventListener('click', (event) => {
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
    alert('Storage.Reset: all non-premanent data was removed from storage.')
  });
}
function tmUiInitStorageClen() {
  getEl('#tm-storage-clean').addEventListener('click',()=>{
    tmsDeleteAll();
    tmUiInitOperation();
    alert('Storage.CLEAN: all data was deleted from storage.')
  });
}
// prep
function tmUiInitPrep(){makeResizebale('#tm-prep')}
function tmUiInitBack(){getEl('#tm-prep-back').addEventListener('click',()=>{tmUiShowMain()})}
async function tmUiPause(msg) {
  let el = getEl('#tm-execution-continue');
  tmUiBlock(el);
  await sleep(100);
  alert('tmUiPause: '+msg);
  await new Promise(resolve => {
    el.onclick = resolve;
  });
  tmUiHide(el);
}
// execution
function tmUiInitBtnCancel() {
  getEl('#tm-execution-cancel').addEventListener('click',()=>{reset('Execution canceled by user.')});
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
  if (operation) {tmUiShowExecution()} else {tmUiShowMain()} // show menu
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
    alert('tmUiReset: ' + joinedArgs);
  }
  console.log('tmUiReset: done.');
}
async function tmStart(actionName) {
  tmsSetOperation(actionName+'/start');
  tmUiShowExecution();
  await sleep(100);
}
