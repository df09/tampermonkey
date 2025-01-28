function redirectToJobStart() {
  console.log('redirectToJobStart: start..');
  
  tmModal.input({
    accent: 'info',
    title: 'Redirect to Job by ID',
    msg: 'Please enter JobID:',
    actionClose: () => {
      console.log('Modal closed.');
    },
    actionSubmit: () => {
      const e = getEl('#tm-modal-input-input'); // Получаем элемент перед использованием
      const data = e.value.trim(); // Убираем лишние пробелы
      const jobId = Number(data);

      if (data && Number.isInteger(jobId) && jobId >= 0) {
        tmsReset();
        tmMenu.showMain();
        redirect('http://bravura-crm.com/jobs/' + jobId);
      } else {
        tmsReset('Invalid JobID.');
        tmMenu.showMain();
      }
    },
  });

  tmsSetOperation('redirectToJob/start');
  
  setTimeout(() => {
    const e = getEl('#tm-modal-input-input'); // Получаем элемент после рендера
    if (e) {
      e.focus(); // Устанавливаем фокус
      e.value = ''; // Очищаем поле ввода
    }
  }, 100);
}
