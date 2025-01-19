(function(){'use strict';
  // === entrypoints =====================================
  function redirectToJob(hotkey){tmsSetOperation('redirectToJob/start');redirectToJobStart(hotkey)}
  function searchActiveJob(){tmsSetOperation('searchActiveJob/start');searchActiveJobStart()}
  function createBarcodes(){tmsSetOperation('createBarcodes/start');createBarcodesStart()}
  // === ui =====================================
  const map = {
    thumblers: [
      ['go-to-job-by-id', 'Go to Job by ID', 'Shift+J', redirectToJob],
      ['search-active-job', 'Search Active Job', 'Shift+S', searchActiveJob],
    ],
    btnsPrep: [
      ['create-barcodes', 'Create Barcodes', createBarcodes],
    ],
    btnsExec: [],
  }
  tmUiInit(map);
  // === handle active operations =====================================
  tmsOperationsHandle({
    redirectToJob: ['start'],
    searchActiveJob: ['start'],
    createBarcodes: ['start', 'createFo', 'newProduct', 'sizeSetup', 'sectionsDetail'],
  });
})();
