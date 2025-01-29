async function createBarcodesSectionsDetail() {
  const perPageSelector = '#dashboard_datatable_length select';
  const materialHeaderSelector = 'th[aria-label="Material: activate to sort column ascending"]';

  await updValEl(getEl(perPageSelector), 100, 300);
  await clickEl(getEl(materialHeaderSelector), 300);
  await sleep(500); // Ожидание обновления таблицы

  const dataLocations = tmsGet('tm_data-locations') || [];
  getEls('table#dashboard_datatable tbody tr').forEach(row => {
    const firstTd = row.querySelector('td:first-child');
    if (firstTd) {
      const match = dataLocations.some(loc => firstTd.textContent.includes(loc));
      if (match) {
        // Устанавливаем чекбокс
        const checkbox = row.querySelector('input[type="checkbox"]');
        if (checkbox) {
          checkbox.checked = true;
        }
        // Меняем статус на CUT
        const statusDropdown = row.querySelector('select.section_detail_select');
        if (statusDropdown) {
          statusDropdown.value = 'CUT';
          statusDropdown.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
    }
  });

  // === done ======================================
  tmModal.info({
    accent: 'success',
    title: 'Create Barcodes: Done',
    msg: 'please PRINT BARCODES and click "UPDATE STATUSES" if everything is ok.',
    actionClose: ()=>{
      tmsReset();
      tmMenu.showMain();
    },
  });
}
