function redirectToJobStart() {
  let eInput = getEl('.tm-modal-body-dialog-input');
  ModalManager.buildDialog({
    kind: 'input',
    title: 'Redirect to Job by ID',
    msg: 'Please enter JobID:',
    actionClose: ()=>{
      tmUiReset();
      tmUiShowMain();
    },
    actionSubmit: ()=>{
      const data = eInput.value;
      const jobId = Number(data);
      if (data && Number.isInteger(jobId) && jobId >= 0) {
        tmUiReset();
        tmUiShowMain();
        redirect('http://bravura-crm.com/jobs/' + jobId);
      } else {
        tmUiReset('Invalid jobId.');
        tmUiShowMain();
      }
    },
  });
  setTimeout(() => {
    eInput.focus();
  }, 300);
}
