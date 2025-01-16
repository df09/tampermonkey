(function(){'use strict';
  // === entrypoints =====================================
  function go2jobById(){tmsSetOperation('go2jobById/start');go2jobByIdStart()}
  function searchActiveJob(){tmsSetOperation('searchActiveJob/start');searchActiveJobStart()}
  function createBarcodes(){tmsSetOperation('createBarcodes/job');createBarcodesJob()}
  // === ui =====================================
  const map = {
    readme: 'https://example.com',
    thumblers: [
      ['go-to-job-by-id', 'Go to Job by ID', 'shift+j', go2jobById],
      ['search-active-job', 'Search Active Job', 'shift+s', searchActiveJob],
    ],
    btnsPrep: [
      ['create-barcodes', 'Create Barcodes', createBarcodes],
    ],
    btnsExec: [
    ],
  }
  tmUiInit(map);

  // === handle active operations =====================================
  tmsOperationsHandle({
    go2jobById: ['start'],
    searchActiveJob: ['start'],
    createBarcodes: ['job', 'newProduct', 'sizeSetup', 'sectionsDetail'],
  });
})();
