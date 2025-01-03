(async function() {
  'use strict';

  // ==== start ============================================
  const existedRoomSelector = '#product_room_id';
  const existedRoomOptionSelector = '#product_room_id option';
  const newRoomSelector = '#product_room_name';
  const productTypeSelector = '#product_product_type_id';
  const productNameSelector = '#product_name';
  const numberOfSectionsSelector = '#product_sections';
  const createFoSelector = '#createEditProductModalSaveButton';
  const perPageSelector = '#dashboard_datatable_length select';
  const changeStatusesSelector = '#change_all_section';
  const materialHeaderSelector = 'th[aria-label="Material: activate to sort column ascending"]';
  const barcodesCheckboxSelector = '#select_all_section';
  async function selectProductType(productType, delay) {
    const glassMap = {
      '38cl': '5',
      '12cl': '1',
      '38sf': '16',
      '12sf': '14',
      '14mr': '4'
    };
    const glassValue = glassMap[productType];
    if (!glassValue) {
      abort(`selectProductType - Unsupported productType type: ${productType}`);
    }
    await updValEl(getEl(productTypeSelector), glassValue, delay);
    console.log('selectProductType:', productType);
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
  function roomExists(loc) {
    const options = getElAll(existedRoomOptionSelector);
    return Array.from(options).some(option => option.textContent.trim().toLowerCase() === loc.toLowerCase());
  }

  // === action =====================================
  if (tmsGetState() === 'createBarcodes:start') {
    // get and upd storage data
    const barcodesData = tmsGet('tm_barcodesData');
    const [loc, productType, productName] = barcodesData.shift();
    tmsSet('tm_barcodesData', barcodesData);
    // createBarcode.room
    if (roomExists(loc)) {
      await selectExistingRoom(loc);
    } else {
      await updValEl(getEl(newRoomSelector), loc);
    }
    // createBarcode.productType/productName/numberOfSections
    await selectProductType(productType);
    await updValEl(getEl(productNameSelector), productName);
    await updValEl(getEl(numberOfSectionsSelector), 1);
    // redirect to sizeSetupPage
    clickEl(getEl(createFoSelector));
  } else {
    // === clean ======================================
    tmsDeleteAll();
  }
})();
