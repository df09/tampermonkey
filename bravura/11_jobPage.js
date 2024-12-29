// ==UserScript==
// @name         bc
// @description  bc
// @namespace    bc
// @version      21
// @author       anon
// @match        http://bravura-crm.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=glasscompanyny.com
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
  'use strict';

  // ==== load ============================================
  function waitForLoading(variableName, maxAttempts=50, interval=100) {
      return new Promise((resolve, reject, maxAttempts, interval) => {
          let attempts = 0;
          const checkInterval = setInterval(() => {
              if (window[variableName] === true) {
                  clearInterval(checkInterval);
                  resolve(); // разрешаем промис
              } else if (attempts >= maxAttempts) {
                  clearInterval(checkInterval);
                  reject(new Error(`Timeout waiting for ${variableName} to load.`));
              }
              attempts++;
          }, interval);
      });
  }
  window.addEventListener('load', async () => {
    // await waitForLoading('bc_01_tms', 10, 500);
    // await waitForLoading('bc_02_helpers', 10, 500);
    // await waitForLoading('bc_03_menu', 10, 500);
    // window.bc_10_jobPage = true;
    console.log('21 bc/11_jobPage: loaded.');
    // init menu
    tmMenuAdd();
    getEl(tmMenuStartSelector).addEventListener('click', () => start());
  });

  // ==== start ============================================
  // TODO: перейти на yaml
  // input:
  //   panl-12cl_door-38cl_panl-38cl: test_A1 test_B2 test_C3
  //   panl-38cl_door-38cl_panl-12cl: test_D4 test_E5 test_F6
  // output: [
  //   [test_A1, 12cl, panl],
  //   [test_A1, 38cl, door],
  //   [test_B2: 12cl, panl],
  //   ...
  // ]
  function getBarcodesData(textarea) {
    try {
      const result = [];
      const lines = textarea.value.trim().split('\n');
      lines.forEach((line) => {
        line = line.trim();
        line = line.replace(/\s+/g, ' ');
        if (!line) return;
        const [locParams, locs] = line.split(':').map((part) => part.trim());
        if (!locParams || !locs) {
          throw new Error(`Некорректная строка: "${line}"`);
        }
        const foParams = locParams.split('_').map((pair) => {
          const [fo, glass] = pair.split('-');
          if (!fo || !glass) {
            throw new Error(`Некорректная пара: "${pair}"`);
          }
          return { fo, glass };
        });
        locs.split(' ').forEach((loc) => {
          foParams.forEach(({ fo, glass }) => {
            result.push(`${loc}, ${glass}, ${fo}`);
          });
        });
      });
      console.log('Formatted Data:', result);
      return result;
    } catch (error) {
      console.error('Ошибка при обработке данных:', error.message);
    }
  }
  function getJobId() {
    try {
      const match = window.location.href.match(/\/jobs\/(\d+)/);
      if (match && match[1]) {
        const jobId = match[1];
        console.log('getJobId:', jobId);
        return jobId;
      }
      abort('getJobId - Job ID not found in the URL');
    } catch (error) {
      abort('getJobId - Error extracting Job ID:', error.message);
    }
  }
  function getFosId() {
    try {
      const viewFoSelector = "a[href*='/fabrication_orders/'][href$='/edit']";
      const match = getEl(viewFoSelector).href.match(/\/fabrication_orders\/(\d+)\/edit/);
      if (match && match[1]) {
        const fosId = match[1];
        console.log('getFosId:', fosId);
        return fosId;
      }
      abort('getFosId - fosId not found in "View FO" button href');
    } catch (error) {
      abort('getFosId - Error extracting fosId:', error.message);
    }
  }
  function start() {
    // storage
    tmsDeleteAll();
    tmsState('bc:start');
    // get data
    const barcodesData = getBarcodesData(getEl(tmMenuTextareaSelector));
    const jobId = getJobId();
    const fosId = getFosId();
    sessionStorage.setItem('tm_barcodesData', barcodesData);
    sessionStorage.setItem('tm_jobId', jobId);
    sessionStorage.setItem('tm_fosId', fosId);
    abort();
    // proceed
    if (barcodesData) {
      redirect(`http://bravura-crm.com/fabrication_orders/${fosId}/new_product`);
    }
    alert('Done!');
  }

  // // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  // const existedRoomSelector = '#product_room_id';
  // const existedRoomOptionSelector = '#product_room_id option';
  // const newRoomSelector = '#product_room_name';
  // const productTypeSelector = '#product_product_type_id';
  // const productNameSelector = '#product_name';
  // const numbersOfFoSelector = '#product_sections';
  // const createFoSelector = '#createEditProductModalSaveButton';
  // const perPageSelector = '#dashboard_datatable_length select';
  // const changeStatusesSelector = '#change_all_section';
  // const materialHeaderSelector = 'th[aria-label="Material: activate to sort column ascending"]';
  // const barcodesCheckboxSelector = '#select_all_section';
  // const glassMap = {
  //   '38cl': '5',
  //   '12cl': '1',
  //   '38sf': '16',
  //   '12sf': '14',
  //   '14mr': '4'
  // };
  // function roomExists(loc) {
  //   const options = getElAll(existedRoomOptionSelector);
  //   return Array.from(options).some(option => option.textContent.trim().toLowerCase() === loc.toLowerCase());
  // }
  // async function selectExistingRoom(loc, delay) {
  //   const existedRoomEl = getEl(existedRoomSelector);
  //   const matchingOption = Array.from(existedRoomEl.options).find(option => option.textContent.trim().toLowerCase() === loc.toLowerCase());
  //   if (!matchingOption) {
  //     abort('selectExistingRoom - Matching room option not found');
  //   }
  //   await updValEl(existedRoomEl, matchingOption.value, delay);
  //   console.log('selectExistingRoom:', loc);
  // }
  // async function selectProductType(glass, delay) {
  //   const glassValue = glassMap[glass];
  //   if (!glassValue) {
  //     abort(`selectProductType - Unsupported glass type: ${glass}`);
  //   }
  //   await updValEl(getEl(productTypeSelector), glassValue, delay);
  //   console.log('selectProductType:', glass);
  // }
  //
  // async function proceedNewPeoduct() {
  //           for (const [loc, glasses] of Object.entries(barcodesData)) {
  //             for (const glassParams of glasses) {
  //               redirect(`${baseUrl}/fabrication_orders/${fosId}/new_product`);
  //             }
  //           }
  //           // await redirect(`${baseUrl}/dashboard/sections_detail?job_id=${jobId}&status=N%2FA`);
  //           // await updValEl(getEl(perPageSelector), '100', 1000);
  //           // await updValEl(getEl(changeStatusesSelector), 'CUT', 1000);
  //           // await clickEl(getEl(materialHeaderSelector), 1000);
  //           // await clickEl(getEl(barcodesCheckboxSelector), 1000);
  //           // alert('Done - please PRINT BARCODES and click "UPDATE STATUSES" if everything is ok');
  //   // get gata from storage
  //   const storage = JSON.parse(sessionStorage.getItem('tm_new_product'));
  //   const loc = storage.loc;
  //   const glassParams = storage.glassParams;
  //   sessionStorage.removeItem('tm_new_product');
  //   // proceed
  //   if (roomExists(loc)) {
  //     await selectExistingRoom(loc, 1000);
  //   } else {
  //     await updValEl(getEl(newRoomSelector), loc, 1000);
  //   }
  //   await selectProductType(glassParams.glass, 1000);
  //   await updValEl(getEl(productNameSelector), glassParams.fo, 1000);
  //   await updValEl(getEl(numbersOfFoSelector), '1', 1000);
  //   await sleep(3000);
  //   abort('todo..');
  //   await sleep(3000);
  //   await clickEl(getEl(createFoSelector), 1000);
  // }
})();
