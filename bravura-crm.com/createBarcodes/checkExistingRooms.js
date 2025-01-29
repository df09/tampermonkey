async function createBarcodesCheckExistingRooms() {
  await waitFor('tr[id^="room_"]', e => !!e);

  const dataLocations = tmsGet('tm_data-locations') || [];
  const rows = getEls('tr[id^="room_"]');
  const existingRooms = Array.from(rows).map(
    row => row.querySelectorAll('td')[2].textContent.trim()
  );

  console.log('dataLocations', dataLocations);
  console.log('existingRooms', existingRooms);

  // Проверяем, какие комнаты из dataLocations уже существуют
  const duplicateRooms = dataLocations.filter(room => existingRooms.includes(room));

  if (duplicateRooms.length > 0) {
    tmMenu.abort(`The following rooms already exist: ${duplicateRooms.join(', ')}`);
    return;
  }

  // newProduct
  const fosId = tmsGet('tm_fosId');
  tmsSetOperation('createBarcodes/newProduct');
  redirect(`http://bravura-crm.com/fabrication_orders/${fosId}/new_product`);
}
