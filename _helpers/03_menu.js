(function() {
  'use strict';

  // ==== menu ============================================
  window.tmMenuContainerSelector = '#tmmenu-container';
  window.tmMenuTextareaSelector = '#tmmenu-textarea';
  window.tmMenuTextareaDefValue = '';
  window.tmMenuTextareaDefWidth = '500px';
  window.tmMenuTextareaDefHeight = '150px';
  window.tmMenuStartSelector = '#tmmenu-start';
  window.tmMenuContinueSelector = '#tmmenu-continue';
  window.tmMenuAbortSelector = '#tmmenu-abort';
  window.tmMenuMinimizeSelector = '#tmmenu-minimize';
  // TODO: сделать мои классические стили
  window.tmMenuAdd = function(startButtonTitle) {
    const container = document.createElement('div');
    const textarea = document.createElement('textarea');
    const startButton = document.createElement('button');
    const continueButton = document.createElement('button');
    const abortButton = document.createElement('button');
    const minimizeButton = document.createElement('button');
    addStyles(`
      ${tmMenuContainerSelector} {
        z-index: 99999; font-family: monospace;
        position: fixed; bottom: 10px; right: 10px; padding: 10px;
        background-color: white; border: 1px solid #ccc; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
      }
      ${tmMenuTextareaSelector} {
        width: ${tmMenuTextareaDefWidth}; height: ${tmMenuTextareaDefHeight};
        resize: none; margin-bottom: 10px;
      }
      ${tmMenuContainerSelector} button { display: block; width: 100%; padding: 5px; }
      ${tmMenuStartSelector} { background-color: green; color: white; }
      ${tmMenuContinueSelector} { background-color: yellow; color: black; display: none; }
      ${tmMenuAbortSelector} { background-color: red; color: white; display: none; }
      ${tmMenuMinimizeSelector} {
        background-color: gray; color: white; padding: 0 !important; marigin 0 !important;
        border: 1px solid #ccc; cursor: pointer; font-size: 14px; border-radius: 5px;
        position: absolute; top: 5px; right: 5px; width: 25px !important;
      }
    `);
    // countainer
    container.id = tmMenuContainerSelector.replace('#', '');
    // textarea
    textarea.id = tmMenuTextareaSelector.replace('#', '');
    textarea.spellcheck = false;
    textarea.value = tmsGet('tm_menuTextareaValue', tmMenuTextareaDefValue);
    textarea.style.width = tmsGet('tm_menuTextareaWidth', tmMenuTextareaDefWidth);
    textarea.style.height = tmsGet('tm_menuTextareaHeight', tmMenuTextareaDefHeight);
    let isResizing = false;
    let startX, startY, startWidth, startHeight;
    textarea.addEventListener('input', () => { tmsSet('tm_menuTextareaValue', textarea.value); });
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
        tmsSet('tm_menuTextareaWidth', textarea.style.width);
        tmsSet('tm_menuTextareaHeight', textarea.style.height);
      }
    });
    // start
    startButton.id = tmMenuStartSelector.replace('#', '');
    startButton.textContent = startButtonTitle;
    startButton.style.display = 'block';
    startButton.addEventListener('click', () => {
      startButton.style.display = 'none';
      continueButton.style.display = 'none';
      abortButton.style.display = 'block';
    });
    // continue
    continueButton.id = tmMenuContinueSelector.replace('#', '');
    continueButton.textContent = 'Continue';
    continueButton.style.display = 'none';
    continueButton.addEventListener('click', () => {
      startButton.style.display = 'none';
      continueButton.style.display = 'none';
      abortButton.style.display = 'block';
    });
    // abort
    abortButton.id = tmMenuAbortSelector.replace('#', '');
    abortButton.textContent = 'Abort';
    abortButton.style.display = 'none';
    abortButton.addEventListener('click', () => {
      startButton.style.display = 'none';
      continueButton.style.display = 'none';
      abortButton.style.display = 'none';
      abort('tmMenuAbort - Execution aborted by user.');
    });
    // minimize
    minimizeButton.id = tmMenuMinimizeSelector.replace('#', '');
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
  window.tmMenuPause = async function(msg) {
    const continueButton = getEl(tmMenuContinueSelector);
    getEl(tmMenuStartSelector).style.display = 'none';
    getEl(tmMenuAbortSelector).style.display = 'none';
    continueButton.style.display = 'block';
    await sleep(100);
    alert('tmMenuPause: '+msg);
    await new Promise(resolve => {
      continueButton.onclick = resolve;
    });
  }
})();
