(function() {
  'use strict';

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
    tmsState('createBarcodes:start');
    // get data
    const barcodesData = getBarcodesData(getEl(tmMenuTextareaSelector));
    const jobId = getJobId();
    const fosId = getFosId();
    sessionStorage.setItem('tm_barcodesData', barcodesData);
    sessionStorage.setItem('tm_jobId', jobId);
    sessionStorage.setItem('tm_fosId', fosId);
    // proceed
    redirect(`http://bravura-crm.com/fabrication_orders/${fosId}/new_product`);
  }

  tmMenuAdd();
  getEl(tmMenuStartSelector).addEventListener('click', () => start());
})();
