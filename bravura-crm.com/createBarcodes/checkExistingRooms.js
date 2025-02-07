async function createBarcodesCheckExistingRooms() {
  // Ждем, пока не исчезнет индикатор "Processing..."
  await waitFor('.dataTables_processing', e => e.style.display === 'none');
  const rooms = getEls('tr[id^="room_"]', true);
  if (rooms) {
    // Проверяем, какие комнаты из dataLocations уже существуют
    const dataLocations = tmsGet('tm_data-locations') || [];
    const existingRooms = Array.from(rooms).map(row => row.querySelectorAll('td')[2].textContent.trim());
    const duplicateRooms = dataLocations.filter(room => existingRooms.includes(room));
    if (duplicateRooms.length > 0) {
      tmUi.abort({msg: ['The following rooms already exist:', duplicateRooms.join(', ')]})
    }
  }
  // newProduct
  const fosId = tmsGet('tm_fosId');
  tmsSetOperation('createBarcodes/newProduct');
  redirect(`http://bravura-crm.com/fabrication_orders/${fosId}/new_product`);
}
