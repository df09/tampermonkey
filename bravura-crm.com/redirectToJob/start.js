function redirectToJobStart() {
  const operation = 'redirectToJob/start';
  tmsSetOperation(operation);
  console.log(operation);
  tmModal.input({
    accent: 'info',
    title: 'Redirect to Job by ID',
    msg: 'Please enter JobID:',
    actionClose: ()=>{tmsReset();tmMenu.showMain()},
    actionSubmit: () => {
      const e = getEl('#tm-modal-input-input');
      const jobId = e.value;
      console.log(e);
      console.log(e.value);
      console.log('JobId', jobId);
      if (/^\d+$/.test(jobId)) {
        tmsReset();
        tmMenu.showMain();
        redirect('http://bravura-crm.com/jobs/' + jobId);
      } else {
        tmsReset();
        tmModal.info({
          accent: 'error',
          title: 'Redirect to Job by ID',
          msg: 'Invalid JobID.',
          // actionPreOpen: ()=>{tmsReset();tmMenu.showMain()}
          actionClose: ()=>{tmsReset();tmMenu.showMain()}
        })
        tmMenu.showMain();
      }
    },
  });
}
