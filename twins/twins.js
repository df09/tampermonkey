(function() {
  'use strict';

  // // ==== reports =============================================
  // async function waitForGeneratingReport(timeout = 20000) {
  //   return new Promise((resolve, reject) => {
  //     const selector = '.modal-dialog h3';
  //     const targetText = 'Generating Report';
  //     const checkModal = () => {
  //       const modal = getEl(selector);
  //       // Проверяем, есть ли модальное окно с нужным текстом
  //       if (!modal || modal.textContent.trim() !== targetText) {
  //         resolve(); // Модальное окно отсутствует или текст изменился
  //         return;
  //       }
  //     };
  //     const observer = new MutationObserver(() => {
  //       checkModal();
  //     });
  //     // Проверяем изменения в DOM
  //     observer.observe(document.body, { childList: true, subtree: true });
  //     // Тайм-аут для предотвращения бесконечного ожидания
  //     setTimeout(() => {
  //       observer.disconnect();
  //       reject(stop('waitForGeneratingReport: timeout.'));
  //     }, timeout);
  //     // Начальная проверка
  //     checkModal();
  //   });
  // }

  // ==== upd measurements ==========================================
  function getOutageDirection(edge) {
    const outageDirection = '';
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
    const clickCount = 0;
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
      const counter = parseInt(counterContainer.innerText, 10);
      counter--;
      counterContainer.innerText = counter;
      if (counter == 0) { counterContainer.style.background = 'green'; }
      if (counter < 0) { counterContainer.style.background = 'red'; }
    });
  }
  async function updMeasurementFields(number, edge, delay) {
    console.log(`updMeasurementFields: number=${number}, edge=${edge}, delay=${delay}`);
    if (edge[0] !== "0" && edge[2] !== "0") {
      stop('Outage не может быть одновременно с двух сторон.');
    }
    const length = edge[1];
    const outageSize = edge[0] != "0" ? edge[0] : edge[2];
    const outageDirection = getOutageDirection(edge);
    const clickCount = getClickCount(number, outageDirection);
    // Селекторы для полей
    const lengthSelector = `div[data-sb-field="content/measurements/${number}/length"] input`;
    const outageSizeSelector = `div[data-sb-field="content/measurements/${number}/outagePastElbow"] input`;
    const outageDirectionSelector = `div[data-sb-field="content/measurements/${number}/outageDirection"] button`;
    // Элементы
    const lengthEl = getEl(lengthSelector);
    const outageSizeEl = getEl(outageSizeSelector);
    const outageDirectionEl = getEl(outageDirectionSelector);
    // Обновляем значения
    await updElVal(lengthEl, length, delay);
    await updElVal(outageSizeEl, 0, delay);
    await updElVal(outageSizeEl, outageSize, delay);
    // TODO: await updOutageDirection(number, outageDirection, outageDirectionEl, delay);
    addClickCounterHint(number, clickCount, outageDirectionEl);
    await sleep(delay);
  }

  // ==== save ==========================================
  async function checkModalWarnings() {
    const modal = document.querySelector('.modal-content .warnings-dialog');
    // модального окна нет - все хорошо
    if (!modal) { return true; }
    // serious - pause
    if (modal.classList.contains('serious')) {
      await pause('serious warnings - save manually and continue.');
      return 'manually';
    }
    // если невозможно сохранить - stop
    if (modal.classList.contains('fatal')) {
      stop('save - fatal errors.');
    }
    // если индетифицировать не удалось - stop
    stop('save - unknown modal type.');
  }
  function findReactComponent(dom) {
    const key = Object.keys(dom).find(key => key.startsWith("__reactFiber") || key.startsWith("__reactInternalInstance"));
    if (!key) return null;
    const node = dom[key];
    while (node) {
      if (node.memoizedProps && node.memoizedProps.doAction) { return node; }
      node = node.return; // Поднимаемся вверх по дереву
    }
    return null;
  }
  async function save(delay) {
    console.log('save..');
    const selector = '#save-resource';
    const button = getEl(selector);
    const reactComponent = findReactComponent(button);
    if (!reactComponent) {
      stop('React компонент с doAction не найден!');
    }
    const props = reactComponent.memoizedProps;
    if (!props || !props.doAction) {
      stop('doAction не найден в memoizedProps!');
    }
    props.doAction(
      () => { console.log('reactComponent: doAction...'); },
      (status) => { console.log('Intermittent status updated:', status); }
    );
    await sleep(1000);
    // Добавляем проверку на модальное окно
    const result = await checkModalWarnings();
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
    const projectNameDiv = getEl('div[data-sb-field="content/projectName"]');
    if (!projectNameDiv) { stop('DIV для "Project Name" не найден.') }
    const inputEl = projectNameDiv.querySelector('input');
    if (!inputEl) { stop('Поле ввода в "Project Name" не найдено.'); }
    // upd value
    const currentValue = inputEl.value;
    if (currentValue.startsWith('Clone: ')) { currentValue = currentValue.replace('Clone: ', ''); }
    const parts = currentValue.split(' - ');
    if (parts.length > 1) { currentValue = parts[0]+' - '+projectLocation; }
    await updElVal(inputEl, currentValue, delay);
    console.log('updProjectName: updated to"'+currentValue+'".');
  }
  async function updLocation(projectLocation, delay) {
    console.log('updLocation..');
    const locationEl = getEl('input[placeholder="Select or enter custom location..."]');
    if (!locationEl) { stop('Поле для "Location" не найдено.') }
    await updElVal(locationEl, projectLocation, delay);
    console.log('updLocation: updated to "'+projectLocation+'".');
  }
  async function updOwner(delay) {
    console.log('updOwner..');
    await clickEl(getEl('input[placeholder="Select a value..."]'), 1000);
    await clickEl(getEl('[data-sb-option-title="0100200854 User"]'), 1000);
    await sleep(delay);
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
  function getInputData(textarea) {
    try {
      const data = {}; // Инициализация объекта
      const lines = textarea.value.split('\n');
      lines.forEach(line => {
        line = line.trim();
        // Удаляем лишние пробелы
        line = line.replace(/\s+/g, ' ');
        if (!line) return; // Пропускаем пустую строку
        // Разделяем ключ и значение
        const [key, value] = line.split(':').map(part => part.trim());
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
        const groups = value.split(/[.;]/).map(group => group.trim());
        data[key] = {};
        groups.forEach((group, index) => {
          const parts = group.split(/[+ ]/).map(part => part.trim()); // Разделение на части по "+" или пробелу
          data[key][index + 1] = parts;
        });
      });
      return data;
    } catch (error) {
      stop('Ошибка в данных: ' + error.message);
    }
  }
  async function start() {
    // storage
    tmsDeleteAll();
    tmsSetState('createBarcodes:start');
    // check start conditions
    if (document.querySelector('#save-resource')) {
      stop('cancel - please save project before starting.');
    }
    // action
    console.log('run..');
    getEl(startButtonSelector).style.display = 'none';
    getEl(continueButtonSelector).style.display = 'none';
    getEl(stopButtonSelector).style.display = 'block';
    // main logic
    const data = getInputData(textarea);
    for (const projectLocation in data) {
      // clone project
      console.log('clone project..');
      await clickEl(getEl('div[aria-label="Clone"]'), 300);
      await clickEl(getEl('div#dropdown-item-clone-all-details'), 0);
      const fetchData = await interceptFetch('WebPlusDesignAllCRL.dll/rest/projects/');
      const projectId = fetchData.result.projectId;
      const chargeableId = fetchData.result.chargeable.chargeableId;
      await sleep(3000);
      // upd header
      await updProjectName(projectLocation, 3000);
      await updLocation(projectLocation, 2000);
      await updOwner(2000);
      // save
      await save(5000);
      // redirect to measurement-page
      await redirect('https://solimp.crlaurence.com/SOL_API/ShowerApp/#shower/'+chargeableId+'/measurements/grid', 8000);
      // Update measurements
      const projectData = data[projectLocation];
      for (const [number, edge] of Object.entries(projectData)) {
        await updMeasurementFields(number, edge, 2000);
      }

      // TODO TODO TODO
      // const outageDirectionSelector = `div[data-sb-field="content/measurements/${number}/outageDirection"] button`;
      // const outageDirectionEl = getEl(outageDirectionSelector);
      // await updOutageDirection(number, outageDirection, outageDirectionEl, delay);
      await pause('please set outageDirections manually.');

      await save(5000);
      // redirect to project-page
      await redirect('https://solimp.crlaurence.com/SOL_API/ShowerApp/#projects/'+projectId, 8000);

      // TODO: view multiple reports
      // await clickEl(getEl(viewSelectedSelector), 0);
      // waitForGeneratingReport()
      //   .then(() => console.log('waitForGeneratingReport: ok.'))
      //   .catch(error => console.error(error));
      // await sleep(100);
      // const viewReportSelector = '#view-report [role="button"]';
      // const multipleReportsSelector = '#dropdown-item-multipleReports';
      // const viewSelectedSelector = '#sb-slider .multi-report-slider .multi-report-slider-actions button';
      // const dissmissSelector = '#sb-slider .slider-controls button';
      // await clickEl(getEl(viewReportSelector), 500);
      // await clickEl(getEl(multipleReportsSelector), 500);
      // await clickEl(getEl(dissmissSelector), 500);
      // await pause('please download reports manually.');
    }
    getEl(startButtonSelector).style.display = 'none';
    getEl(continueButtonSelector).style.display = 'none';
    getEl(stopButtonSelector).style.display = 'none';
    alert('Done!')
  }

  // async function updInputValue(el, newValue, delay) {
  //   const lastValue = el.value;
  //   el.focus();
  //   el.value = newValue;
  //   // Обновляем значение с учётом React, если _valueTracker существует
  //   const event = new Event('input', { bubbles: true });
  //   const changeEvent = new Event('change', { bubbles: true });
  //   const tracker = el._valueTracker;
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

  // === action ============================================
  // TODO: click - не позволяет работать в других окнах?
  // TODO: alerts - repalce to modals so its gonna be easear distinct errors and notifications
  // TODO: если есть 3 точки подряд скипать строку
  // TODO: stop не работает
  // TODO:   избавиться от асинхрона?
  // TODO: multipleReports click
  // TODO: outageDirection click
  // TODO: проверять чтобы небыло дубликатов
  // TODO: сделать чтобы от скорости интернета не зависило а смотрело по факту
  const startButtonSelector = '#generate-twins-start';
  const continueButtonSelector = '#generate-twins-continue';
  const stopButtonSelector = '#generate-twins-stop';
  tmMenuAdd();
  getEl(tmMenuStartSelector).addEventListener('click', () => start());
})();