(function(){'use strict';
    // === ui =====================================
    tmUiInit();
    function createBarcodes(){tmsSetOperation('createBarcodes/job');createBarcodesJob()}
    function go2jobByJobId(){tmsSetOperation('go2jobByJobId/start');go2jobByjobIdStart()}
    // === init ui =====================================
    const map = {
      readme: 'https://example.com',
      thumblers: [
        ['go-to-job-by-id', 'Go to Job by ID', 'shift+j', go2jobByJobId()],
        ['search-active-job', 'Search Active Job', 'shift+s', searchActiveJob()],
      ],
      btnsPrep: [
        ['create-barcodes', 'Create Barcodes', createBarcodes()],
        ['test-prep-1', 'Test prep 1', testPrep1()],
        ['test-prep-2', 'Test prep 2', testPrep2()],
      ],
      btnsExec: [
        ['test-exec-1', 'Test exec 1', testExec1()],
        ['test-exec-2', 'Test exec 2', testExec2()],
      ],
    }
    tmUiInit(map);
    // === handle active operations =====================================
    tmsOperationsHandle({
      go2jobByJobId: ['start'],
      searchActiveJob: ['start'],
      createBarcodes: ['job', 'newProduct', 'sizeSetup', 'sectionsDetail'],
      testPrep1: ['start'],
      testPrep2: ['start'],
      testExec1: ['start'],
      testExec2: ['start'],
    });
})();
