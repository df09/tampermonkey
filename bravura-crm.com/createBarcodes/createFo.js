function createBarcodesCreateFo() {
  // fosId
  const match = window.location.href.match(/fabrication_orders\/(\d+)\/edit/);
  fosId = match ? match[1] : null; // Возвращает ID или null, если не найдено
  tmsSet('tm_fosId', fosId);
  // newProduct
  tmsSetOperation('createBarcodes/newProduct');
  redirect(`http://bravura-crm.com/fabrication_orders/${fosId}/new_product`);
}
