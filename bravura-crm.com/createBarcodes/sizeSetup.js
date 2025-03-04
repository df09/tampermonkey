function createBarcodesSizeSetup() {
  const jobId = tmsGet('tm_jobId');
  const fosId = tmsGet('tm_fosId');
  const barcodesData = tmsGet('tm_data-barcodes');
  console.log('sizeSetupPage - barcodesData:', barcodesData);
  if (Array.isArray(barcodesData) && barcodesData.length > 0) {
    // new_product
    tmsSetOperation('createBarcodes/newProduct');
    redirect(`http://bravura-crm.com/fabrication_orders/${fosId}/new_product`);
  } else {
    // sections_detail
    tmsSetOperation('createBarcodes/sectionsDetail');
    redirect(`http://bravura-crm.com/dashboard/sections_detail?job_id=${jobId}&status=N%2FA`);
  }
}
