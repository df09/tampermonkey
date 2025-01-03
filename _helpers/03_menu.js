(function() {
  'use strict';

  // ==== menu ============================================
  window.tmMenuContainerSelector = '#tmmenu-container';
  window.tmMenuTextareaSelector = '#tmmenu-textarea';
  window.tmMenuStartSelector = '#tmmenu-start';
  window.tmMenuContinueSelector = '#tmmenu-continue';
  window.tmMenuAbortSelector = '#tmmenu-abort';
  // TODO: сделать мои классические стили
  window.tmMenuAddStyles = function() {
    addStyles(`
      ${tmMenuContainerSelector} {
        z-index: 99999; font-family: monospace;
        position: fixed; bottom: 10px; right: 10px; padding: 10px;
        background-color: white; border: 1px solid #ccc; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
      }
      ${tmMenuTextareaSelector}  { width: 500px; height: 150px; margin-bottom: 10px; }
      ${tmMenuContainerSelector} button { display: block; width: 100%; padding: 5px; }
      ${tmMenuStartSelector}     { background-color: green; color: white; }
      ${tmMenuContinueSelector}  { background-color: yellow; color: black; display: none; }
      ${tmMenuAbortSelector}     { background-color: red; color: white; display: none; }
    `);
  }
  window.tmMenuAdd = function(startButtonTitle) {
    // vars
    const container = document.createElement('div');
    const textarea = document.createElement('textarea');
    const startButton = document.createElement('button');
    const continueButton = document.createElement('button');
    const abortButton = document.createElement('button');
    tmMenuAddStyles(); // styles
    container.id = tmMenuContainerSelector.replace('#', ''); // container
    textarea.id = tmMenuTextareaSelector.replace('#', ''); // textarea
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
      abort('tmMenuAbort - Execution abortped by user.');
    });
    // append
    container.appendChild(textarea);
    container.appendChild(startButton);
    container.appendChild(continueButton);
    container.appendChild(abortButton);
    document.body.appendChild(container);
  }
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
