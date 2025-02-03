function redirectToJobStart() {
  // start
  tmsSetOperation('redirectToJob/start');
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
