function redirectToJobStart() {
  const operation = 'redirectToJob/start';
  tmsSetOperation(operation);
  console.log(operation);
  tmMenu.showExec();

  tmModal.input({
    accent: 'w',
    title: 'Redirect to Job by ID',
    msg: 'Please enter JobID:',
    actionClose: ()=>{tmsReset();tmMenu.showMain()},
    actionSubmit: () => {
      const e = getEl('#tm-modal-input-input');
      const jobId = e.value;
      // rollback
      tmsReset();
      tmMenu.showMain();
      // redirect
      if (/^\d+$/.test(jobId)) {
        redirect('http://bravura-crm.com/jobs/' + jobId);
      // invalid
      } else {
        tmModal.info({
          accent: 'r',
          title: 'Redirect to Job by ID',
          msg: 'Invalid JobID.',
        })
      }
    },
  });
}
