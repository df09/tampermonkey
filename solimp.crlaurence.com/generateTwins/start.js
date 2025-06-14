// ==== upd measurements ==========================================
function getOutageDirection(edge) {
  let outageDirection = '';
  if (edge[0] == "0" && edge[2] == "0") {
    outageDirection = "none";
  } else {
    if (edge[0] == "0") {
      outageDirection = "right";
    } else {
      outageDirection = "left";
    }
  }
  console.log('getOutageDirection - edge: '+edge, 'outageDirection: '+outageDirection)
  return outageDirection;
}
function getClickCount(number, outageDirection) {
  let clickCount = 0;
  if (outageDirection != 'none') {
    if (number == 1) {
      clickCount = outageDirection == 'right' ? 1 : 2; // 1 click - right, 2 click - left
    } else if (number == 2) {
      clickCount = outageDirection == 'left' ? 1 : 2; // 1 click - left, 2 click - right
    } else if (number == 3) {
      clickCount = outageDirection == 'right' ? 1 : 2; // 1 click - right, 2 click - left
    }
  }
  console.log(`getClickCount - number: ${number}, outageDirection: ${outageDirection}, clickCount: ${clickCount}`);
  return clickCount;
}
function addClickCounterHint(number, clickCount, outageDirectionEl) {
  // Добавляем подсказки
  const clickCounterId = `click-counter-${number}`;
  const counterContainer = document.createElement('div');
  counterContainer.id = clickCounterId;
  counterContainer.style.position = 'absolute';
  counterContainer.style.top = '-10px';
  counterContainer.style.right = '-10px';
  counterContainer.style.padding = '5px';
  counterContainer.style.fontSize = '12px';
  counterContainer.style.border = '1px solid black';
  counterContainer.style.borderRadius = '3px';
  counterContainer.innerText = clickCount;
  if (clickCount == 0) {
    counterContainer.style.background = 'green';
  } else {
    counterContainer.style.background = 'yellow';
  }
  // Вставляем подсказку рядом с кнопкой
  outageDirectionEl.parentElement.style.position = 'relative';
  outageDirectionEl.parentElement.appendChild(counterContainer);
  // Обработчик кликов
  outageDirectionEl.addEventListener('click', () => {
    let counter = parseInt(counterContainer.innerText, 10);
    counter--;
    counterContainer.innerText = counter;
    if (counter == 0) { counterContainer.style.background = 'green'; }
    if (counter < 0) { counterContainer.style.background = 'red'; }
  });
}
async function updMeasurementFields(number, edge, delay) {
  console.log(`updMeasurementFields: number=${number}, edge=${edge}, delay=${delay}`);
  console.log(edge);
  if (edge[0].trim() !== "0" && edge[2].trim() !== "0") {
    tmUi.abort({
      title: 'Upd Measurement - fail',
      msg: 'Outage не может быть одновременно с двух сторон.'
    });
  }
  const length = edge[1];
  const outageSize = edge[0] != "0" ? edge[0] : edge[2];
  const outageDirection = getOutageDirection(edge);
  const clickCount = getClickCount(number, outageDirection);
  // Селекторы для полей
  const lengthSelector = `div[data-sb-field="content/measurements/${number}/length"] input`;
  const outageSizeSelector = `div[data-sb-field="content/measurements/${number}/outagePastElbow"] input`;
  console.log(number);
  // let outageDirectionSelector;
  // if (number === '1') {
  //   outageDirectionSelector = `div[data-sb-field="content/measurements/${number}/measurementMethod"] button`;
  // } else {
  outageDirectionSelector = `div[data-sb-field="content/measurements/${number}/outageDirection"] button`;
  // }
  // Элементы
  const lengthEl = getEl(lengthSelector);
  const outageSizeEl = getEl(outageSizeSelector);
  const outageDirectionEl = getEl(outageDirectionSelector);
  // Обновляем значения
  await updValEl(lengthEl, length, delay);
  await updValEl(outageSizeEl, 0, delay);
  await updValEl(outageSizeEl, outageSize, delay);
  addClickCounterHint(number, clickCount, outageDirectionEl);
}

// ==== save ==========================================
async function checkModalWarnings() {
  const modal = getEl('.modal-content .warnings-dialog', true);
  // модального окна нет - все хорошо
  if (!modal) return true;
  // serious - tmUiPause
  if (modal.classList.contains('serious')) {
    await tmMenu.pause({
      accent: 'y',
      title: 'Save Project - serious warnings',
      msg: 'Please double check, save manually and continue.',
    });
    return false;
  }
  // если невозможно сохранить - abort
  if (modal.classList.contains('fatal')) {
    tmUi.abort({
      title: 'Check Modal - failed to save.',
      msg: 'Fatal error. abort.',
    });
  }
  // если индетифицировать не удалось - abort
  tmUi.abort({
    title: 'Check Modal - failed to save.',
    msg: 'Unknown modal type. abort.',
  });
}
function getReactPropsTree(e) {
  const key = Object.keys(e).find(key => key.startsWith("__reactFiber") || key.startsWith("__reactInternalInstance"));
  if (!key) { tmUi.abort({ msg: 'getReactProps - fail' }) }
  let node = e[key];
  while (node) {
    const obj = node.memoizedProps;
    if (obj !== null && typeof obj === 'object' && Object.keys(obj).length === 0) {
      console.log('node.type:', node.type);
      console.log('node.memoizedProps:', node.memoizedProps);
      console.log(' ');
    }
    node = node.return; // Поднимаемся вверх по дереву
  }
}
function triggerReactProp(e, prop, ...args) {
  const key = Object.keys(e).find(key => key.startsWith("__reactFiber") || key.startsWith("__reactInternalInstance"));
  if (!key) { tmUi.abort({ msg: 'getReactProps - fail' }) }
  let node = e[key];
  while (node) {
    if (!node.memoizedProps || typeof node.memoizedProps[prop] !== 'function') {
      node = node.return; // Поднимаемся вверх по дереву
      continue;
    }
    // Вызываем найденный метод с переданными аргументами
    node.memoizedProps[prop](...args);
    return;
  }
  tmUi.abort({ msg: 'getReactProps - fail' });
}
async function saveResource(delay) {
  await new Promise(resolve => {
    triggerReactProp(getEl('#save-resource'), 'doAction', resolve, resolve);
  });
  await sleep(delay);
  await checkModalWarnings();
}

// ==== upd header ==========================================
async function updProjectName(projectLocation, delay) {
  console.log('updProjectName..');
  const projectNameDiv = getEl('div[data-sb-field="content/projectName"]');
  if (!projectNameDiv) {
    tmUi.abort({
      title: 'Udp Project - fail',
      msg: 'DIV для "Project Name" не найден.',
    });
  }
  const inputEl = projectNameDiv.querySelector('input');
  if (!inputEl) {
    tmUi.abort({
      title: 'Udp Project - fail',
      msg: 'Поле ввода в "Project Name" не найдено.',
    });
  }
  // upd value
  let currentValue = inputEl.value;
  if (currentValue.startsWith('Clone: ')) {
    currentValue = currentValue.replace('Clone: ', '');
  }
  const parts = currentValue.split(' - ');
  if (parts.length > 1) { currentValue = parts[0]+' - '+projectLocation; }
  await updValEl(inputEl, currentValue, delay);
  console.log('updProjectName: updated to"'+currentValue+'".');
}
async function updLocation(projectLocation, delay) {
  console.log('updLocation..');
  const locationEl = getEl('div.inner-control-container[data-sb-field="content/location"] input.dx-texteditor-input')
  await updValEl(locationEl, projectLocation, delay);
  console.log('updLocation: updated to "'+projectLocation+'".');
}
async function updOwner(delay) {
  console.log('updOwner..');
  await clickEl(getEl('div.inner-control-container[data-sb-field="content/userOwnerId"] input.dx-texteditor-input'), delay);
  await clickEl(getEls('[data-sb-option-title="0100200854 User"]')[0], delay);
}

// === data/fetch ===========================================================
function interceptFetch(urlSubstring, timeout = 20000) {
  return new Promise((resolve, reject) => {
    const originalFetch = window.fetch;
    // Переопределяем fetch
    window.fetch = async function (...args) {
      if (args[0].includes(urlSubstring)) {
        console.log('interceptFetch: url - '+args[0]);
        try {
          // Выполняем оригинальный запрос
          const response = await originalFetch.apply(this, args);
          // Клонируем ответ, чтобы прочитать его тело
          const clonedResponse = response.clone();
          const data = await clonedResponse.json();
          resolve(data);
          return response;
        } catch (error) {
          console.error('Failed to handle fetch response:', error);
          reject(error);
          throw error;
        }
      }
      // Если URL не совпадает, выполняем оригинальный fetch
      return originalFetch.apply(this, args);
    };
    // Добавляем timeout
    setTimeout(() => {
      reject(new Error('Timeout waiting for fetch: "' + urlSubstring + '".'));
    }, timeout);
  });
}
function getInputData(textareaValue) {
  try {
    const data = new Map(); // Используем Map вместо объекта
    const lines = textareaValue.split('\n');
    lines.forEach(line => {
      line = line.trim();
      if (!line) return;
      // Проверка: должно быть ровно одно ":"
      const colonCount = (line.match(/:/g) || []).length;
      if (colonCount !== 1) {
        throw new Error('В строке должно быть ровно одно ":" — "' + line + '".');
      }
      // Разделяем ключ и значение
      const [key, value] = line.split(':').map(part => part.trim());
      if (!key || !value) {
        throw new Error('Пустой ключ или значение: "' + line + '".');
      }
      // Проверка: ровно две точки
      const dotCount = (value.match(/\./g) || []).length;
      if (dotCount !== 2) {
        throw new Error('После ":" должно быть ровно 2 точки — "' + value + '".');
      }
      // Проверка допустимых символов: цифры, пробелы, /, -, +, .
      if (!/^[0-9\s\/\-+.]+$/.test(value)) {
        throw new Error('Недопустимые символы в значении: "' + value + '".');
      }
      // Разбор на группы по точкам
      const groups = value.split('.').map(group => group.trim());
      const groupObj = {};
      groups.forEach((group, index) => {
        const parts = group.split(/[+ ]/).map(part => part.trim()).filter(Boolean);
        groupObj[index + 1] = parts;
      });
      data.set(key, groupObj); // сохраняем в Map
    });
    console.log('>>> parsed textarea data:');
    console.log(data);
    return data;
  } catch (error) {
    tmUi.abort({
      title: 'Parse Input Data',
      msg: ['Ошибка в данных: ', error.message],
    });
  }
}
async function generateTwinsStart() {
  try {
    // start
    tmUi.startOperation('generateTwins/start');
    // check start conditions
    const regex = /^https:\/\/solimp\.crlaurence\.com\/SOL_API\/ShowerApp\/#projects\/\d+/;
    if (!regex.test(window.location.href)) {
      tmUi.abort({msg: 'URL must be https://solimp.crlaurence.com/SOL_API/ShowerApp/#projects/<number>'});
    }
    if (getEl('#save-resource', true)) {
      tmUi.abort({msg: 'Cancel - You should be on the saved project page.'});
    }
    // main logic
    const data = getInputData(tmMenu.e.prepTextarea.value);
    tmsSet('tm_data-generateTwins', data);
    for (const [projectLocation, projectData] of data.entries()) {
      // clone project
      await clickEl(getEl('div[aria-label="Clone"]'), 300);
      await clickEl(getEl('div#dropdown-item-clone-all-details'), 0);
      const fetchData = await interceptFetch('WebPlusDesignAllCRL.dll/rest/projects/');
      const projectId = fetchData.result.projectId;
      const chargeableId = fetchData.result.chargeable.chargeableId;
      await sleep(2000);
      // upd header
      await updProjectName(projectLocation, 3000);
      await updLocation(projectLocation, 300);
      await updOwner(1000);
      await saveResource(3000);
      // measurement grid page
      await fakeRedirect('https://solimp.crlaurence.com/SOL_API/ShowerApp/#shower/'+chargeableId+'/measurements/grid', 3000);
      for (const [number, edge] of Object.entries(projectData)) {
        await updMeasurementFields(number, edge, 300);
      }
      await tmMenu.pause({
        accent: 'y',
        title: 'Outage Directions',
        msg: 'Please SET OUTAGE DIRECTIONS manually and PRESS CONTINUE.',
      });
      await saveResource(3000);
      await fakeRedirect('https://solimp.crlaurence.com/SOL_API/ShowerApp/#projects/'+projectId, 3000);
    }
    tmUi.done()
  } catch (err) {tmUi.abort({msg:['Error('+tmsGetOperation()+'):',err.message]})}
}
