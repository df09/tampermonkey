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
function tmUiShowMain(){tmUiHide(getEl('#tm-prep'),getEl('#tm-execution'));tmUiFlex(getEl('#tm-minimize'),getEl('#tm-main'))}
function tmUiShowPrep(){tmUiHide(getEl('#tm-main'),getEl('#tm-execution'));tmUiFlex(getEl('#tm-minimize'),getEl('#tm-prep'))}
function tmUiShowExecution(){tmUiHide(getEl('#tm-minimize'),getEl('#tm-main'),getEl('#tm-prep'));tmUiFlex(getEl('#tm-execution'))}
function makeResizebale(selector) {
  let c = getEl(selector);
  // restore last size
  c.style.width = tmsGet('tm_keep_uiWidth_'+selector) || c.style.width;
  c.style.height = tmsGet('tm_keep_uiHeight_'+selector) || c.style.height;
  // resize
  let isResizing = false;
  let startX, startY, startWidth, startHeight;
  c.addEventListener("mousedown", (el) => {
    if (el.button !== 0) return; // Только левая кнопка мыши
    isResizing = true; startX = el.clientX; startY = el.clientY;
    startWidth = c.offsetWidth; startHeight = c.offsetHeight;
    document.body.style.userSelect = "none"; // Убираем выделение текста
  });
  document.addEventListener("mousemove", (el) => {
    if (!isResizing) return;
    let newWidth = startWidth - (el.clientX - startX);
    let newHeight = startHeight - (el.clientY - startY);
    c.style.width = `${Math.max(newWidth, 50)}px`; // Минимальная ширина
    c.style.height = `${Math.max(newHeight, 50)}px`; // Минимальная высота
  });
  document.addEventListener("mouseup", () => {
    if (isResizing) {
      isResizing = false;
      document.body.style.userSelect = "";
      tmsSet('tm_keep_uiWidth', c.style.width);
      tmsSet('tm_keep_uiHeight', c.style.height);
    }
  });
}
// container
// header
function tmUiInitOperation() {
  let operation = tmsGetOperation();
  let el = getEl('#tm-operation');
  let txt = operation || 'None';
  let cls = txt === 'None'?'tm-green':'tm-red';
  let span = el.querySelector('span');
  span.textContent = txt;
  span.className = cls;
  tmUiInitAbort(operation);
}
function tmUiInitAbort(operation) {
  let el = getEl('#tm-abort');
  el.addEventListener('click',()=>{
    tmsDeleteAll();
    tmUiInitOperation();
    tmUiShowMain();
    abort('Execution aborted by user. All data was deleted from storage.');
  })
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
function tmUiInitReadme(link) {
  getEl('#tm-main-readme a').href=link
}
function tmUiInitThumbler(data) {
  let [idpfx, title, hotkey, action] = data;
  let id = 'tm-thmb-' + idpfx;

  // Добавляем Thumbler в HTML
  getEl('#tm-main-thumblers').innerHTML += `
    <div id="${id}" class="tm-row">
      <h3 class="tm-title">${title}<span class="tm-hotkey">(${hotkey})</span></h3>
      <label class="tm-switch">
        <input type="checkbox">
        <span class="tm-slider"></span>
      </label>
    </div>
  `;

  let checkbox = getEl(`#${id} input`);

  // Обработчик изменения состояния переключателя
  checkbox.addEventListener('change', (event) => {
    if (event.target.checked) {
      console.log(`Switch for ${title} is ON`);
      // Активировать действие при включении
    } else {
      console.log(`Switch for ${title} is OFF`);
      // Отключить действие при выключении
    }
  });

  // Привязываем обработчик для горячей клавиши к конкретному переключателю
  document.addEventListener('keydown', (event) => {
    if (event.shiftKey && event.key.toLowerCase() === hotkey.split('+')[1].toLowerCase()) {
      if (checkbox.checked) {
        console.log(`Action triggered for ${hotkey} (Switch ON)`);
        action('on'); // Выполнение переданного действия, если включено
      } else {
        console.log(`Action triggered for ${hotkey} (Switch OFF)`);
        action('off'); // Выполнение переданного действия, если выключено
      }
    }
  });
}
// main.buttons
function tmUiInitBtnPrep(data) {
  let [idpfx, title, action] = data;
  let cMain = getEl('#tm-main-btns-prep');
  let cPrep = getEl('#tm-prep-body');
  let mainGroupClass = 'tm-main-btn-prep';
  let prepGroupClass = 'tm-prep-btn-exec';
  let mainId = `${mainGroupClass}-${idpfx}`;
  let prepId = `${prepGroupClass}-${idpfx}`;

  // Добавляем кнопки в DOM
  cMain.insertAdjacentHTML(
    'beforeend',
    `<button id="${mainId}" class="tm-btn-g ${mainGroupClass}">${title}</button>`
  );
  cPrep.insertAdjacentHTML(
    'beforeend',
    `<button id="${prepId}" class="tm-btn-r ${prepGroupClass}">EXEC</button>`
  );

  // Привязываем обработчик к кнопке
  getEl(`#${mainId}`).addEventListener('click', () => {
    getEl('#tm-prep-title').textContent = title;

    let textarea = getEl('#tm-prep-textarea');
    textarea.value = tmsGet(`tm_keep_uiTextareaValue_${idpfx}`, '');

    textarea.addEventListener('input', () => {
      tmsSet(`tm_keep_uiTextareaValue_${idpfx}`, textarea.value);
    });

    // Скрываем другие EXEC кнопки
    getEls(`.${prepGroupClass}`).forEach(el => tmUiHide(el));

    // Показ текущей EXEC кнопки
    let prepExec = getEl(`#${prepId}`);
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

  // Привязываем обработчик события к только что созданной кнопке
  let button = getEl(`#${id}`);
  button.addEventListener('click', () => {
    tmUiShowExecution();
    action();
    tmUiInitOperation();
  });

  // Лог для отладки
  console.log(`EXEC Button added: ${id}`);
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
  getEl('#tm-execution-cancel').addEventListener('click',()=>{
    tmsReset();
    tmUiInitOperation();
    tmUiShowMain();alert('Execution canceled by user.');
  });
}

// === init ==============================
function tmUiInit(map) {
  // container
  console.log('tmUiInit.container: done.');
  // header
  tmUiInitOperation();
  tmUiInitMinimize();
  console.log('tmUiInit.header: done.');
  // main
  tmUiInitMain();
  tmUiInitReadme(map.readme);
  for (let data of map.thumblers){tmUiInitThumbler(data)}
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
