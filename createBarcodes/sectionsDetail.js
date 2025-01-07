(async function() {
  'use strict';

  // === action =====================================
  if (tmsGetState() === 'createBarcodes:start') {
    // sections_detail
    const perPageSelector = '#dashboard_datatable_length select';
    const changeStatusesSelector = '#change_all_section';
    const materialHeaderSelector = 'th[aria-label="Material: activate to sort column ascending"]';
    const barcodesCheckboxSelector = '#select_all_section';
    await updValEl(getEl(perPageSelector), 100, 300);
    await updValEl(getEl(changeStatusesSelector), 'CUT', 300);
    await clickEl(getEl(materialHeaderSelector), 300);
    await clickEl(getEl(barcodesCheckboxSelector), 300);
    // === done ======================================
    tmsReset();
    alert('Done - please PRINT BARCODES and click "UPDATE STATUSES" if everything is ok');
  } else {
    // === clean ======================================
    tmsReset();
  }
})();
