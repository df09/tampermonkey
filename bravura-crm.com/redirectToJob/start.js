function redirectToJobStart() {
  console.log('redirectToJobStart: start..')
  let e = getEl('#tm-modal-input-input');
  tmModal.input({
    accent: 'info', title: 'Redirect to Job by ID', msg: 'Please enter JobID:',
    actionClose: ()=>{},
    actionSubmit: ()=>{
      const data = e.value;
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
  e.focus();
  e.value = '';
}
