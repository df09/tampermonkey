function createBarcodesCheckExistingRooms() {
  pause(3000);

  const data = tmsGet('tm_barcodesData');
  const rows = document.querySelectorAll('tr[id^="room_"]');
  const existingRooms = Array.from(rows).map(
    row => row.querySelectorAll('td')[2].textContent.trim()
  );

  console.log('data', data);
  console.log('existingRooms', existingRooms);
  tmMenu.abort('test');

  data.forEach(([room]) => {
    if (existingRooms.includes(room)) {
      tmMenu.abort('The room already exists:', room);
    }
  });

  // newProduct
  const fosId = tm fjлsGet('tm_fosId');
  tmsSetOperation('createBarcodes/newProduct');
  redirect(`http://bravura-crm.com/fabrication_orders/${fosId}/new_product`);
}
