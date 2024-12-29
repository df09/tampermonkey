// ==UserScript==
// @name         ShowerApp_twins
// @namespace    http://tampermonkey.net/
// @description  Сгенерировать идентичные душевые
// @version      28
// @author       anon
// @match        https://solimp.crlaurence.com/SOL_API/ShowerApp/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=crlaurence.com
// @grant        none
// @run-at       document-end
// @require      https://cdn.jsdelivr.net/npm/js-yaml@4/dist/js-yaml.min.js?v=3
// ==/UserScript==

(function() {
    'use strict';

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

    // ==== helpers ============================================
    class StopExecution extends Error {
        constructor(message, variable) {
            super(message);
            this.name = "StopExecution";
            this.variable = variable; // Добавляем переменную в исключение
        }
    }
    function stop(variable=false) {
        getEl(startButtonSelector).style.display = 'none';
        getEl(continueButtonSelector).style.display = 'none';
        getEl(stopButtonSelector).style.display = 'none';
        let msg = 'StopExecution - please reload page.'; if (variable) { msg = msg+' '+variable; }
        alert(msg);
        throw new StopExecution(msg);
    }
    async function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
    async function redirect(newUrl, delay) {
        console.log('redirect: '+newUrl);
        window.location.href = newUrl; // Выполняем редирект
        await sleep(delay);
    }
    function getEl(selector) {
        let el = document.querySelector(selector);
        if (!el) {
            stop('getEl("'+selector+'"): not found');
        }
        console.log('getEl("'+selector+'"):');
        console.log(el);
        return el;
    }
    function getElAll(selector) {
        console.log('getElAll('+selector+')..');
        let els = document.querySelectorAll(selector);
        if (!els) { stop('elements "'+selector+'" not found.'); }
        return els;
    }
    async function clickEl(el, delay) {
        console.log('clickEl:', el);
        // Создаём событие с учетом системы React
        let event = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
        // Вызываем событие через React-обработчики
        Object.keys(el).forEach(key => {
            if (key.startsWith("__reactEventHandlers")) {
                el[key].onClick && el[key].onClick(event);
            }
        });
        // Генерация обычного DOM-события
        let result = el.dispatchEvent(event);
        if (!result) {
            stop('clickEl: canceled.');
        }
        console.log('clickEl: done.', el);
        await sleep(delay);
        return result;
    }
    async function updInputValue(el, newValue, delay) {
        let lastValue = el.value;
        el.focus();
        el.value = newValue;
        // Обновляем значение с учётом React, если _valueTracker существует
        let event = new Event('input', { bubbles: true });
        let changeEvent = new Event('change', { bubbles: true });
        let tracker = el._valueTracker;
        if (tracker) {
            tracker.setValue(lastValue);
        }
        el.dispatchEvent(event);
        el.dispatchEvent(changeEvent);
        // done
        el.blur();
        console.log('updInputValue: done.');
        await sleep(delay);
    }

    // ==== init ============================================
    function addStyles() {
        let styles = `
            #generate-twins-container { z-index: 99999; position: fixed; bottom: 10px; right: 10px; background-color: white; border: 1px solid #ccc; padding: 10px; z-index: 1000; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); }
            #generate-twins-container textarea { width: 300px; height: 150px; margin-bottom: 10px; }
            #generate-twins-container button { display: block; width: 100%; padding: 5px; }
            #generate-twins-start { background-color: green; color: white; }
            #generate-twins-continue { background-color: yellow; color: black; display: none; }
            #generate-twins-stop { background-color: red; color: white; display: none; }
        `;
        let styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
    }
    function addInputContainer() {
        let container = document.createElement('div');
        let textarea = document.createElement('textarea');
        let startButton = document.createElement('button');
        let continueButton = document.createElement('button');
        let stopButton = document.createElement('button');
        container.id = 'generate-twins-container';
        textarea.id = 'generate-twins-textarea';
        // start
        startButton.id = startButtonSelector.replace('#', '');
        startButton.textContent = 'Generate twins';
        startButton.style.display = 'block';
        startButton.addEventListener('click', () => handleStartButton(textarea));
        // continue
        continueButton.id = continueButtonSelector.replace('#', '');
        continueButton.textContent = 'Continue';
        continueButton.style.display = 'none';
        continueButton.addEventListener('click', () => {
            startButton.style.display = 'none';
            continueButton.style.display = 'none';
            stopButton.style.display = 'block';
        });
        // stop
        stopButton.id = stopButtonSelector.replace('#', '');
        stopButton.textContent = 'Stop';
        stopButton.style.display = 'none';
        stopButton.addEventListener('click', () => {
            startButton.style.display = 'none';
            continueButton.style.display = 'none';
            stopButton.style.display = 'none';
            let msg = 'Execution stopped by user.';
            alert(msg);
            throw new StopExecution(msg);
        });
        // append
        container.appendChild(textarea);
        container.appendChild(startButton);
        container.appendChild(continueButton);
        container.appendChild(stopButton);
        document.body.appendChild(container);
    }
    async function pause(msg) {
        let continueButton = getEl(continueButtonSelector);
        getEl(startButtonSelector).style.display = 'none';
        getEl(stopButtonSelector).style.display = 'none';
        continueButton.style.display = 'block';
        await(100);
        alert('pause: '+msg);
        await new Promise(resolve => {
            continueButton.onclick = resolve;
        });
    }
    window.onload = function() {
        console.log('tampermonkey: init..');
        addStyles();
        addInputContainer();
    };

    // ==== upd header ==========================================
    async function updProjectName(projectLocation, delay) {
        console.log('updProjectName..');
        let projectNameDiv = getEl('div[data-sb-field="content/projectName"]');
        if (!projectNameDiv) { stop('DIV для "Project Name" не найден.') }
        let inputEl = projectNameDiv.querySelector('input');
        if (!inputEl) { stop('Поле ввода в "Project Name" не найдено.'); }
        // upd value
        let currentValue = inputEl.value;
        if (currentValue.startsWith('Clone: ')) { currentValue = currentValue.replace('Clone: ', ''); }
        let parts = currentValue.split(' - ');
        if (parts.length > 1) { currentValue = parts[0]+' - '+projectLocation; }
        await updInputValue(inputEl, currentValue, delay);
        console.log('updProjectName: updated to"'+currentValue+'".');
    }
    async function updLocation(projectLocation, delay) {
        console.log('updLocation..');
        let locationEl = getEl('input[placeholder="Select or enter custom location..."]');
        if (!locationEl) { stop('Поле для "Location" не найдено.') }
        await updInputValue(locationEl, projectLocation, delay);
        console.log('updLocation: updated to "'+projectLocation+'".');
    }
    async function updOwner(delay) {
        console.log('updOwner..');
        await clickEl(getEl('input[placeholder="Select a value..."]'), 1000);
        await clickEl(getEl('[data-sb-option-title="0100200854 User"]'), 1000);
        await sleep(delay);
    }

    // ==== save ==========================================
    async function checkModalWarnings() {
        let modal = document.querySelector('.modal-content .warnings-dialog');
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
            stop('React компонент с doAction не найден!');
        }
        let props = reactComponent.memoizedProps;
        if (!props || !props.doAction) {
            stop('doAction не найден в memoizedProps!');
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

    // ==== upd measurements ==========================================
    // async function updOutageDirection(number, edge, delay) {
    //     console.log('updOutageDirection..');
    //     // Выполняем нужное количество кликов
    //     for (let i = 0; i < clickCount; i++) {
    //         await clickEl(outageDirectionEl, delay);
    //         // outageDirectionEl.click();
    //         // await sleep(delay);
    //     }
    // }
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
            stop('Outage не может быть одновременно с двух сторон.');
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
        await updInputValue(lengthEl, length, delay);
        await updInputValue(outageSizeEl, 0, delay);
        await updInputValue(outageSizeEl, outageSize, delay);
        // TODO: await updOutageDirection(number, outageDirection, outageDirectionEl, delay);
        addClickCounterHint(number, clickCount, outageDirectionEl);
        await sleep(delay);
    }

    // ==== reports =============================================
    async function waitForGeneratingReport(timeout = 20000) {
        return new Promise((resolve, reject) => {
            let selector = '.modal-dialog h3';
            let targetText = 'Generating Report';
            let checkModal = () => {
                let modal = getEl(selector);
                // Проверяем, есть ли модальное окно с нужным текстом
                if (!modal || modal.textContent.trim() !== targetText) {
                    resolve(); // Модальное окно отсутствует или текст изменился
                    return;
                }
            };
            let observer = new MutationObserver(() => {
                checkModal();
            });
            // Проверяем изменения в DOM
            observer.observe(document.body, { childList: true, subtree: true });
            // Тайм-аут для предотвращения бесконечного ожидания
            setTimeout(() => {
                observer.disconnect();
                reject(stop('waitForGeneratingReport: timeout.'));
            }, timeout);
            // Начальная проверка
            checkModal();
        });
    }

    // ==== run =============================================
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
            stop('Ошибка в данных: ' + error.message);
        }
    }
    // перехват fetch
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

    async function handleStartButton(textarea) {
        if (document.querySelector('#save-resource')) {
            stop('cancel - project must be saved.');
        }
        console.log('run..');
        getEl(startButtonSelector).style.display = 'none';
        getEl(continueButtonSelector).style.display = 'none';
        getEl(stopButtonSelector).style.display = 'block';
        // main logic
        let data = getInputData(textarea);
        for (let projectLocation in data) {
            // clone project
            console.log('clone project..');
            await clickEl(getEl('div[aria-label="Clone"]'), 300);
            await clickEl(getEl('div#dropdown-item-clone-all-details'), 0);
            let fetchData = await interceptFetch('WebPlusDesignAllCRL.dll/rest/projects/');
            let projectId = fetchData.result.projectId;
            let chargeableId = fetchData.result.chargeable.chargeableId;
            console.log("fetchData:", fetchData);
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
            let projectData = data[projectLocation];
            for (let [number, edge] of Object.entries(projectData)) {
                await updMeasurementFields(number, edge, 2000);
            }

            // TODO TODO TODO
            // let outageDirectionSelector = `div[data-sb-field="content/measurements/${number}/outageDirection"] button`;
            // let outageDirectionEl = getEl(outageDirectionSelector);
            // await updOutageDirection(number, outageDirection, outageDirectionEl, delay);
            await pause('please set outageDirections manually.');

            await save(5000);
            // redirect to project-page
            await redirect('https://solimp.crlaurence.com/SOL_API/ShowerApp/#projects/'+projectId, 8000);

            // TODO TODO TODO
            // TODO: view multiple reports
            // await clickEl(getEl(viewSelectedSelector), 0);
            // waitForGeneratingReport()
            //     .then(() => console.log('waitForGeneratingReport: ok.'))
            //     .catch(error => console.error(error));
            // await sleep(100);
            // let viewReportSelector = '#view-report [role="button"]';
            // let multipleReportsSelector = '#dropdown-item-multipleReports';
            // let viewSelectedSelector = '#sb-slider .multi-report-slider .multi-report-slider-actions button';
            // let dissmissSelector = '#sb-slider .slider-controls button';
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
})();
