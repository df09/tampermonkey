(function(){'use strict';
  // === entrypoints =====================================
  function go2jobById(){tmsSetOperation('go2jobById/start');go2jobByIdStart()}
  function searchActiveJob(){tmsSetOperation('searchActiveJob/start');searchActiveJobStart()}
  function createBarcodes(){tmsSetOperation('createBarcodes/job');createBarcodesJob()}
  function testPrep1(){tmsSetOperation('testPrep1/start');testPrep1Start()}
  function testPrep2(){tmsSetOperation('testPrep2/start');testPrep2Start()}
  function testExec1(){tmsSetOperation('testExec1/start');testExec1Start()}
  function testExec2(){tmsSetOperation('testExec2/start');testExec2Start()}
  // === ui =====================================
  const map = {
    readme: 'https://example.com',
    thumblers: [
      ['go-to-job-by-id', 'Go to Job by ID', 'shift+j', go2jobById],
      ['search-active-job', 'Search Active Job', 'shift+s', searchActiveJob],
    ],
    btnsPrep: [
      ['create-barcodes', 'Create Barcodes', createBarcodes],
      ['test-prep-1', 'Test prep 1', testPrep1],
      ['test-prep-2', 'Test prep 2', testPrep2],
    ],
    btnsExec: [
      ['test-exec-1', 'Test exec 1', testExec1],
      ['test-exec-2', 'Test exec 2', testExec2],
    ],
  }
  tmUiInit(map);

  // // === handle active operations =====================================
  // tmsOperationsHandle({
  //   go2jobById: ['start'],
  //   searchActiveJob: ['start'],
  //   createBarcodes: ['job', 'newProduct', 'sizeSetup', 'sectionsDetail'],
  //   testPrep1: ['start'],
  //   testPrep2: ['start'],
  //   testExec1: ['start'],
  //   testExec2: ['start'],
  // });
})();
