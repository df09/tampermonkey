(function() {
  'use strict';

  // ==== load ============================================
  console.log('bc/12_newProduct: loaded.');

  // ==== start ============================================
  const existedRoomSelector = '#product_room_id';
  const existedRoomOptionSelector = '#product_room_id option';
  const newRoomSelector = '#product_room_name';
  const productTypeSelector = '#product_product_type_id';
  const productNameSelector = '#product_name';
  const numbersOfFoSelector = '#product_sections';
  const createFoSelector = '#createEditProductModalSaveButton';
  const perPageSelector = '#dashboard_datatable_length select';
  const changeStatusesSelector = '#change_all_section';
  const materialHeaderSelector = 'th[aria-label="Material: activate to sort column ascending"]';
  const barcodesCheckboxSelector = '#select_all_section';
  const glassMap = {
    '38cl': '5',
    '12cl': '1',
    '38sf': '16',
    '12sf': '14',
    '14mr': '4'
  };
  function roomExists(loc) {
    const options = getElAll(existedRoomOptionSelector);
    return Array.from(options).some(option => option.textContent.trim().toLowerCase() === loc.toLowerCase());
  }
  async function selectExistingRoom(loc, delay) {
    const existedRoomEl = getEl(existedRoomSelector);
    const matchingOption = Array.from(existedRoomEl.options).find(option => option.textContent.trim().toLowerCase() === loc.toLowerCase());
    if (!matchingOption) {
      abort('selectExistingRoom - Matching room option not found');
    }
    await updValEl(existedRoomEl, matchingOption.value, delay);
    console.log('selectExistingRoom:', loc);
  }
  async function selectProductType(glass, delay) {
    const glassValue = glassMap[glass];
    if (!glassValue) {
      abort(`selectProductType - Unsupported glass type: ${glass}`);
    }
    await updValEl(getEl(productTypeSelector), glassValue, delay);
    console.log('selectProductType:', glass);
  }

  async function proceedNewPeoduct() {
            for (const [loc, glasses] of Object.entries(barcodesData)) {
              for (const glassParams of glasses) {
                redirect(`${baseUrl}/fabrication_orders/${fosId}/new_product`);
              }
            }
            // await redirect(`${baseUrl}/dashboard/sections_detail?job_id=${jobId}&status=N%2FA`);
            // await updValEl(getEl(perPageSelector), '100', 1000);
            // await updValEl(getEl(changeStatusesSelector), 'CUT', 1000);
            // await clickEl(getEl(materialHeaderSelector), 1000);
            // await clickEl(getEl(barcodesCheckboxSelector), 1000);
            // alert('Done - please PRINT BARCODES and click "UPDATE STATUSES" if everything is ok');
    // get gata from storage
    const storage = JSON.parse(sessionStorage.getItem('tm_new_product'));
    const loc = storage.loc;
    const glassParams = storage.glassParams;
    sessionStorage.removeItem('tm_new_product');
    // proceed
    if (roomExists(loc)) {
      await selectExistingRoom(loc, 1000);
    } else {
      await updValEl(getEl(newRoomSelector), loc, 1000);
    }
    await selectProductType(glassParams.glass, 1000);
    await updValEl(getEl(productNameSelector), glassParams.fo, 1000);
    await updValEl(getEl(numbersOfFoSelector), '1', 1000);
    await sleep(3000);
    abort('todo..');
    await sleep(3000);
    await clickEl(getEl(createFoSelector), 1000);
  }
})();
