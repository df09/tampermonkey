(async function() {
  'use strict';

  if (tmsGetState() === 'createBarcodes:start') {
    const jobId = tmsGet('tm_jobId');
    const fosId = tmsGet('tm_fosId');
    const barcodesData = tmsGet('tm_barcodesData');
    if (barcodesData) {
      // redirect new_product
      redirect(`http://bravura-crm.com/fabrication_orders/${fosId}/new_product`);
    } else {
      // redirect sections_detail
      redirect(`http://bravura-crm.com/dashboard/sections_detail?job_id=${jobId}&status=N%2FA`);
    }
  }
})();
