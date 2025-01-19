function redirectToJobStart() {
  const userInput = prompt('jobId:');
  tmUiReset();
  // none
  if (userInput === null) { return; }
  // validate
  const jobId = Number(userInput);
  if (userInput && Number.isInteger(jobId) && jobId >= 0) {
    redirect('http://bravura-crm.com/jobs/' + jobId);
  } else {
    tmUiReset('invalid jobId.');
  }
}
