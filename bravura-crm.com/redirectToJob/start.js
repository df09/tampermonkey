function redirectToJobStart() {
  ModalManager.buildDialog({
    kind: 'input',
    title: 'Redirect to Job by ID',
    msg: 'Please enter JobID:',
    actionClose: ()=>{
      tmUiReset();
    },
    actionSubmit: ()=>{
      const userInput = inputField.value;
      const jobId = Number(userInput);
      cleanup();
      if (userInput && Number.isInteger(jobId) && jobId >= 0) {
        tmUiReset();
        redirect('http://bravura-crm.com/jobs/' + jobId);
      } else {
        tmUiReset('Invalid jobId.');
      }
    },
  });
  inputField.focus();
}
