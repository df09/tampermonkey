const tmUiContainerSelector = '#tmmenu-container';
const tmUiTextareaSelector = '#tmmenu-textarea';
const tmUiTextareaDefValue = '';
const tmUiTextareaDefWidth = '500px';
const tmUiTextareaDefHeight = '150px';
const tmUiStartSelector = '#tmmenu-start';
const tmUiContinueSelector = '#tmmenu-continue';
const tmUiAbortSelector = '#tmmenu-abort';
const tmUiMinimizeSelector = '#tmmenu-minimize';

// оперделить вид окна:
  // init hide prep2exec exec
// templates:
  // init:
    // opreration
    // hide
    // container-toggle
      // action-toggle
    // container-exec
      // action-prep2exec
      // action-exec
    // container-storage
      // storage-view
      // action-exec
  // hide:
    // opreration
    // hide
  // prep2exec:
    // opreration
    // hide
    // title
    // textarea-info
    // textarea-input
    // action-exec
  // exec:
    // opreration
    // textarea-info
    // action-exec

// TODO: common styles
// TODO: modals - alert, dialog; err, note, info
function tmUiInit() {
  tmUiContainerMain
  tmUiOperation
  if not exec:
    tmUiOperation
    tmUiHide
    
}
function tmUiAdd(type, selector, label, action) {
    const button = document.createElement(type);
    button.textContent = label;
    button.id = selector.replace('#', '');

    getEl(selector).addEventListener('click', action);
    document.body.appendChild(button); // Или другой контейнер, где размещается меню.
}
function tmUiAdd(startButtonTitle) {
  const container = document.createElement('div');
  const textarea = document.createElement('textarea');
  const startButton = document.createElement('button');
  const continueButton = document.createElement('button');
  const abortButton = document.createElement('button');
  const minimizeButton = document.createElement('button');
  addStyles(`
    ${tmUiContainerSelector} {
      z-index: 99999; font-family: monospace;
      position: fixed; bottom: 10px; right: 10px; padding: 10px;
      background-color: white; border: 1px solid #ccc; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    }
    ${tmUiTextareaSelector} {
      width: ${tmUiTextareaDefWidth}; height: ${tmUiTextareaDefHeight};
      resize: none; margin-bottom: 10px;
    }
    ${tmUiContainerSelector} button { display: block; width: 100%; padding: 5px; }
    ${tmUiStartSelector} { background-color: green; color: white; }
    ${tmUiContinueSelector} { background-color: yellow; color: black; display: none; }
    ${tmUiAbortSelector} { background-color: red; color: white; display: none; }
    ${tmUiMinimizeSelector} {
      background-color: gray; color: white; padding: 0 !important; marigin 0 !important;
      border: 1px solid #ccc; cursor: pointer; font-size: 14px; border-radius: 5px;
      position: absolute; top: 5px; right: 5px; width: 25px !important;
    }
  `);
  // countainer
  container.id = tmUiContainerSelector.replace('#', '');
  // textarea
  textarea.id = tmUiTextareaSelector.replace('#', '');
  textarea.spellcheck = false;
  textarea.value = tmsGet('tm_keep_menuTextareaValue', tmUtmUireaDefValue);
  textarea.style.width = tmsGet('tm_keep_menuTextareaWidth', tmUiTextareaDefWidth);
  textarea.style.height = tmsGet('tm_keep_menuTextareaHeight', tmUiTextareaDefHeight);
  let isResizing = false;
  let startX, startY, startWidth, startHeight;
  textarea.addEventListener('input', () => { tmsSet('tm_keep_menuTextareaValue', textarea.value); });
  textarea.addEventListener("mousedown", (e) => {
    if (e.button !== 0) return; // Только левая кнопка мыши
    isResizing = true; startX = e.clientX; startY = e.clientY;
    startWidth = textarea.offsetWidth; startHeight = textarea.offsetHeight;
    document.body.style.userSelect = "none"; // Убираем выделение текста
  });
  document.addEventListener("mousemove", (e) => {
    if (!isResizing) return;
    const newWidth = startWidth - (e.clientX - startX);
    const newHeight = startHeight - (e.clientY - startY);
    textarea.style.width = `${Math.max(newWidth, 50)}px`; // Минимальная ширина
    textarea.style.height = `${Math.max(newHeight, 50)}px`; // Минимальная высота
  });
  document.addEventListener("mouseup", () => {
    if (isResizing) {
      isResizing = false;
      document.body.style.userSelect = "";
      // Сохраняем размеры в локальное хранилище
      tmsSet('tm_keep_menuTextareaWidth', textarea.style.width);
      tmsSet('tm_keep_menuTextareaHeight', textarea.style.height);
    }
  });
  // start
  startButton.id = tmUiStartSelector.replace('#', '');
  startButton.textContent = startButtonTitle;
  startButton.style.display = 'block';
  startButton.addEventListener('click', () => {
    startButton.style.display = 'none';
    continueButton.style.display = 'none';
    abortButton.style.display = 'block';
  });
  // continue
  continueButton.id = tmUiContinueSelector.replace('#', '');
  continueButton.textContent = 'Continue';
  continueButton.style.display = 'none';
  continueButton.addEventListener('click', () => {
    startButton.style.display = 'none';
    continueButton.style.display = 'none';
    abortButton.style.display = 'block';
  });
  // abort
  abortButton.id = tmUiAbortSelector.replace('#', '');
  abortButton.textContent = 'Abort';
  abortButton.style.display = 'none';
  abortButton.addEventListener('click', () => {
    startButton.style.display = 'none';
    continueButton.style.display = 'none';
    abortButton.style.display = 'none';
    abort('tmUiAbort - Execution aborted by user.');
  });
  // minimize
  minimizeButton.id = tmUiMinimizeSelector.replace('#', '');
  minimizeButton.textContent = 'X'; // Иконка стрелки вниз
  minimizeButton.style.display = 'block';
  minimizeButton.addEventListener('click', () => {
    if (textarea.style.display === 'none') {
      textarea.style.display = 'block';
      startButton.style.display = 'block';
      minimizeButton.textContent = 'X'; // Иконка вниз
      minimizeButton.style.top = '5px';
    } else {
      textarea.style.display = 'none';
      startButton.style.display = 'none';
      continueButton.style.display = 'none';
      abortButton.style.display = 'none';
      minimizeButton.textContent = '^'; // Иконка вверх
      minimizeButton.style.top = '-5px';
    }
  });
  // append
  container.appendChild(textarea);
  container.appendChild(startButton);
  container.appendChild(continueButton);
  container.appendChild(abortButton);
  container.appendChild(minimizeButton);
  document.body.appendChild(container);
};
// pause
async function tmUiPause(msg) {
  const continueButton = getEl(tmUiContinueSelector);
  getEl(tmUiStartSelector).style.display = 'none';
  getEl(tmUiAbortSelector).style.display = 'none';
  continueButton.style.display = 'block';
  await sleep(100);
  alert('tmUiPause: '+msg);
  await new Promise(resolve => {
    continueButton.onclick = resolve;
  });
}
