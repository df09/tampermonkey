function redirectToJobStart(hotkey) {
  if (getKey(hotkey,0) && getKey(hotkey,1)) {
    const userInput = prompt('jobId:');
    const jobId = Number(userInput);
    if (userInput && Number.isInteger(jobId) && jobId >= 0) {
      redirect('http://bravura-crm.com/jobs/' + jobId);
    } else {
      reset('invalid jobId.');
    }
  }
}
