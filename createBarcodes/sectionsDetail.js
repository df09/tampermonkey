(async function() {
  'use strict';

  // === action =====================================
  if (tmsGetState() === 'createBarcodes:start') {
    // sections_detail
    abort('todo..');
    const perPageSelector = '#dashboard_datatable_length select';
    const changeStatusesSelector = '#change_all_section';
    const materialHeaderSelector = 'th[aria-label="Material: activate to sort column ascending"]';
    const barcodesCheckboxSelector = '#select_all_section';
    // await redirect(`${baseUrl}/dashboard/sections_detail?job_id=${jobId}&status=N%2FA`);
    // await updValEl(getEl(perPageSelector), '100', 1000);
    // await updValEl(getEl(changeStatusesSelector), 'CUT', 1000);
    // await clickEl(getEl(materialHeaderSelector), 1000);
    // await clickEl(getEl(barcodesCheckboxSelector), 1000);
    // alert('Done - please PRINT BARCODES and click "UPDATE STATUSES" if everything is ok');
  }

  // === save exit ==================================
  tmsDeleteAll();
})();
