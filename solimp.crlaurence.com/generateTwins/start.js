// // ==== reports =============================================
// async function waitForGeneratingReport(timeout = 20000) {
//   return new Promise((resolve, reject) => {
//     let selector = '.modal-dialog h3';
//     let targetText = 'Generating Report';
//     let checkModal = () => {
//       let modal = getEl(selector);
//       // Проверяем, есть ли модальное окно с нужным текстом
//       if (!modal || modal.textContent.trim() !== targetText) {
//         resolve(); // Модальное окно отсутствует или текст изменился
//         return;
//       }
//     };
//     let observer = new MutationObserver(() => {
//       checkModal();
//     });
//     // Проверяем изменения в DOM
//     observer.observe(document.body, { childList: true, subtree: true });
//     // Тайм-аут для предотвращения бесконечного ожидания
//     setTimeout(() => {
//       observer.disconnect();
//       reject(abort('waitForGeneratingReport: timeout.'));
//     }, timeout);
//     // Начальная проверка
//     checkModal();
//   });
// }

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
  let clickCounterId = `click-counter-${number}`;
  let counterContainer = document.createElement('div');
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
  if (edge[0] !== "0" && edge[2] !== "0") {
    abort('Outage не может быть одновременно с двух сторон.');
  }
  let length = edge[1];
  let outageSize = edge[0] != "0" ? edge[0] : edge[2];
  let outageDirection = getOutageDirection(edge);
  let clickCount = getClickCount(number, outageDirection);
  // Селекторы для полей
  let lengthSelector = `div[data-sb-field="content/measurements/${number}/length"] input`;
  let outageSizeSelector = `div[data-sb-field="content/measurements/${number}/outagePastElbow"] input`;
  let outageDirectionSelector = `div[data-sb-field="content/measurements/${number}/outageDirection"] button`;
  // Элементы
  let lengthEl = getEl(lengthSelector);
  let outageSizeEl = getEl(outageSizeSelector);
  let outageDirectionEl = getEl(outageDirectionSelector);
  // Обновляем значения
  await updValEl(lengthEl, length, delay);
  await updValEl(outageSizeEl, 0, delay);
  await updValEl(outageSizeEl, outageSize, delay);
  // TODO: await updOutageDirection(number, outageDirection, outageDirectionEl, delay);
  addClickCounterHint(number, clickCount, outageDirectionEl);
}

// ==== save ==========================================
async function checkModalWarnings() {
  let modal = document.querySelector('.modal-content .warnings-dialog');
  // модального окна нет - все хорошо
  if (!modal) { return true; }
  // serious - tmUiPause
  if (modal.classList.contains('serious')) {
    await tmUiPause('serious warnings - save manually and continue.');
    return 'manually';
  }
  // если невозможно сохранить - abort
  if (modal.classList.contains('fatal')) { abort('save - fatal errors.'); }
  // если индетифицировать не удалось - abort
  abort('save - unknown modal type.');
}
function findReactComponent(dom) {
  let key = Object.keys(dom).find(key => key.startsWith("__reactFiber") || key.startsWith("__reactInternalInstance"));
  if (!key) return null;
  let node = dom[key];
  while (node) {
    if (node.memoizedProps && node.memoizedProps.doAction) { return node; }
    node = node.return; // Поднимаемся вверх по дереву
  }
  return null;
}
async function save(delay) {
  console.log('save..');
  let selector = '#save-resource';
  let button = getEl(selector);
  let reactComponent = findReactComponent(button);
  if (!reactComponent) {
    abort('React компонент с doAction не найден!');
  }
  let props = reactComponent.memoizedProps;
  if (!props || !props.doAction) {
    abort('doAction не найден в memoizedProps!');
  }
  props.doAction(
    () => { console.log('reactComponent: doAction...'); },
    (status) => { console.log('Intermittent status updated:', status); }
  );
  await sleep(1000);
  // Добавляем проверку на модальное окно
  let result = await checkModalWarnings();
  if (result == 'manually') { // если сохранение вручную, сохранять не нужно
    console.log('save: done.');
    return;
  }
  await sleep(delay);
  console.log('save: done.');
}

// ==== upd header ==========================================
async function updProjectName(projectLocation, delay) {
  console.log('updProjectName..');
  let projectNameDiv = getEl('div[data-sb-field="content/projectName"]');
  if (!projectNameDiv) { abort('DIV для "Project Name" не найден.') }
  let inputEl = projectNameDiv.querySelector('input');
  if (!inputEl) { abort('Поле ввода в "Project Name" не найдено.'); }
  // upd value
  let currentValue = inputEl.value;
  if (currentValue.startsWith('Clone: ')) { currentValue = currentValue.replace('Clone: ', ''); }
  let parts = currentValue.split(' - ');
  if (parts.length > 1) { currentValue = parts[0]+' - '+projectLocation; }
  await updValEl(inputEl, currentValue, delay);
  console.log('updProjectName: updated to"'+currentValue+'".');
}
async function updLocation(projectLocation, delay) {
  console.log('updLocation..');
  let locationEl = getEl('div.inner-control-container[data-sb-field="content/location"] input.dx-texteditor-input')
  if (!locationEl) { abort('Поле для "Location" не найдено.') }
  await updValEl(locationEl, projectLocation, delay);
  console.log('updLocation: updated to "'+projectLocation+'".');
}
async function updOwner(delay) {
  console.log('updOwner..');
  await clickEl(getEl('div.inner-control-container[data-sb-field="content/userOwnerId"] input.dx-texteditor-input'), 3000);
  await clickEl(getEls('[data-sb-option-title="0100200854 User"]')[0], 1000);
  await sleep(delay);
}

// === data/fetch ===========================================================
function interceptFetch(urlSubstring, timeout = 20000) {
  return new Promise((resolve, reject) => {
    let originalFetch = window.fetch;
    // Переопределяем fetch
    window.fetch = async function (...args) {
      if (args[0].includes(urlSubstring)) {
        console.log('interceptFetch: url - '+args[0]);
        try {
          // Выполняем оригинальный запрос
          let response = await originalFetch.apply(this, args);
          // Клонируем ответ, чтобы прочитать его тело
          let clonedResponse = response.clone();
          let data = await clonedResponse.json();
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
function getInputData(textarea) {
  try {
    let data = {}; // Инициализация объекта
    let lines = textarea.value.split('\n');
    lines.forEach(line => {
      line = line.trim();
      // Удаляем лишние пробелы
      line = line.replace(/\s+/g, ' ');
      if (!line) return; // Пропускаем пустую строку
      // Разделяем ключ и значение
      let [key, value] = line.split(':').map(part => part.trim());
      if (!key || !value) {
        throw new Error('Некорректная строка: "' + line + '".');
      }
      // Проверяем корректность формата данных
      if (!/^([0-9+\s\-/]+(\.[0-9+\s\-/]+|;[0-9+\s\-/]+)*)$/.test(value)) {
        // Регулярное выражение проверяет формат данных:
        // - [0-9+\s\-/]+: Разрешает группы, содержащие: [0-9],"-","/"; "+"," ".
        // - (\.[0-9+\s\-/]+|;[0-9+\s\-/]+)*: Позволяет добавлять группы, разделенные символом "." или ";".
        throw new Error('Некорректный формат данных для "' + key + '": "' + value + '".');
      }
      // Разбираем данные
      let groups = value.split(/[.;]/).map(group => group.trim());
      data[key] = {};
      groups.forEach((group, index) => {
        let parts = group.split(/[+ ]/).map(part => part.trim()); // Разделение на части по "+" или пробелу
        data[key][index + 1] = parts;
      });
    });
    return data;
  } catch (error) {
    abort('Ошибка в данных: ' + error.message);
  }
}
async function generateTwinsStart() {
  // check start conditions
  if (document.querySelector('#save-resource')) {
    abort('cancel - please save project before starting.');
  }
  // action
  console.log('run..');
  // main logic
  let data = getInputData(getEl('#tm-prep-textarea'));
  for (let projectLocation in data) {
    // clone project
    console.log('clone project..');
    await clickEl(getEl('div[aria-label="Clone"]'), 300);
    await clickEl(getEl('div#dropdown-item-clone-all-details'), 0);
    let fetchData = await interceptFetch('WebPlusDesignAllCRL.dll/rest/projects/');
    let projectId = fetchData.result.projectId;
    let chargeableId = fetchData.result.chargeable.chargeableId;
    await sleep(3000);
    // upd header
    await updProjectName(projectLocation, 3000);
    await updLocation(projectLocation, 300);
    await updOwner(4000);
    await save(5000);

    // measurement grid page
    await fakeRedirect('https://solimp.crlaurence.com/SOL_API/ShowerApp/#shower/'+chargeableId+'/measurements/grid');
    let projectData = data[projectLocation];
    for (let [number, edge] of Object.entries(projectData)) {
      await updMeasurementFields(number, edge, 1000);
    }
    // TODO
    // let outageDirectionSelector = `div[data-sb-field="content/measurements/${number}/outageDirection"] button`;
    // let outageDirectionEl = getEl(outageDirectionSelector);
    // await updOutageDirection(number, outageDirection, outageDirectionEl, delay);
    await tmUiPause('please set outageDirections manually.');
    await save(5000);

    // project page
    await fakeRedirect('https://solimp.crlaurence.com/SOL_API/ShowerApp/#projects/'+projectId);

    // TODO: view multiple reports
    // await clickEl(getEl(viewSelectedSelector), 0);
    // waitForGeneratingReport()
    //   .then(() => console.log('waitForGeneratingReport: ok.'))
    //   .catch(error => console.error(error));
    // await sleep(100);
    // let viewReportSelector = '#view-report [role="button"]';
    // let multipleReportsSelector = '#dropdown-item-multipleReports';
    // let viewSelectedSelector = '#sb-slider .multi-report-slider .multi-report-slider-actions button';
    // let dissmissSelector = '#sb-slider .slider-controls button';
    // await clickEl(getEl(viewReportSelector), 500);
    // await clickEl(getEl(multipleReportsSelector), 500);
    // await clickEl(getEl(dissmissSelector), 500);
    // await tmUiPause('please download reports manually.');
  }
  // done
  tmsReset();
  tmUiInitOperation();
  tmUiShowMain();
  alert('Done!');
}

// async function updInputValue(el, newValue, delay) {
//   let lastValue = el.value;
//   el.focus();
//   el.value = newValue;
//   // Обновляем значение с учётом React, если _valueTracker существует
//   let event = new Event('input', { bubbles: true });
//   let changeEvent = new Event('change', { bubbles: true });
//   let tracker = el._valueTracker;
//   if (tracker) {
//     tracker.setValue(lastValue);
//   }
//   el.dispatchEvent(event);
//   el.dispatchEvent(changeEvent);
//   // done
//   el.blur();
//   console.log('updInputValue: done.');
//   await sleep(delay);
// }
