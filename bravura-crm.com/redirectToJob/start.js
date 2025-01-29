function testModal(type,accent) {
  const data = {
    accent: accent,
    title: 'testModal',
    msg: [type, accent],
  };
  if (type === 'info')  tmModal.info(data);
  if (type === 'yn')    tmModal.yn(data);
  if (type === 'input') tmModal.input(data);
  if (type === 'content') {
      data.actionContent = ()=>{};
      tmModal.content(data);
  }
}

function redirectToJobStart() {
  const operation = 'redirectToJob/start';
  tmsSetOperation(operation);
  console.log(operation);

  testModal('info', 'w');
  // testModal('yn', 'w');
  // testModal('input', 'w');
  // testModal('content', 'w');
  //
  // testModal('info', 'g');
  // testModal('yn', 'g');
  // testModal('input', 'g');
  // testModal('content', 'g');

  // testModal('info', 'y');
  // testModal('yn', 'y');
  // testModal('input', 'y');
  // testModal('content', 'y');
  //
  // testModal('info', 'r');
  // testModal('yn', 'r');
  // testModal('input', 'r');
  // testModal('content', 'r');
  //
  // testModal('info', 'b');
  // testModal('yn', 'b');
  // testModal('input', 'b');
  // testModal('content', 'b');

  // tmMenu.showExec();
  //
  // tmModal.input({
  //   accent: 'info',
  //   title: 'Redirect to Job by ID',
  //   msg: 'Please enter JobID:',
  //   actionClose: ()=>{tmsReset();tmMenu.showMain()},
  //   actionSubmit: () => {
  //     const e = getEl('#tm-modal-input-input');
  //     const jobId = e.value;
  //     // rollback
  //     tmsReset();
  //     tmMenu.showMain();
  //     // redirect
  //     if (/^\d+$/.test(jobId)) {
  //       redirect('http://bravura-crm.com/jobs/' + jobId);
  //     // invalid
  //     } else {
  //       tmModal.info({
  //         accent: 'r',
  //         title: 'Redirect to Job by ID',
  //         msg: 'Invalid JobID.',
  //       })
  //     }
  //   },
  // });
}
