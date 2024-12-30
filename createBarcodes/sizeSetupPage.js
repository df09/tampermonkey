(async function() {
  'use strict';

  // === action =====================================
  if (tmsGetState() === 'createBarcodes:start') {
    const jobId = tmsGet('tm_jobId');
    const fosId = tmsGet('tm_fosId');
    const barcodesData = tmsGet('tm_barcodesData');
    console.log('sizeSetupPage - barcodesData:', barcodesData);
    if (Array.isArray(barcodesData) && barcodesData.length > 0) {
      // redirect new_product
      redirect(`http://bravura-crm.com/fabrication_orders/${fosId}/new_product`);
    } else {
      // redirect sections_detail
      redirect(`http://bravura-crm.com/dashboard/sections_detail?job_id=${jobId}&status=N%2FA`);
    }
  }

  // === save exit ==================================
  tmsDeleteAll();
})();
