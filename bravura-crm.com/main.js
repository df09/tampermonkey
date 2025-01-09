(function(){'use strict';
    // === ui =====================================
    tmUiInit();
    function createBarcodes(){tmsSetOperation('createBarcodes/job');createBarcodesJob()}
    function go2jobByJobId(){tmsSetOperation('go2jobByJobId/start');go2jobByjobIdStart()}
    tmUiAdd('button', '#createBarcodes', 'Create Barcodes', ()=>createBarcodes());
    tmUiAdd('toggler', '#go2jobByJobId', 'Go to Job by ID', ()=>go2jobByJobId());
    // === handle operations =====================================
    tmsOperationsHandle({
      createBarcodes: ['job', 'newProduct', 'sizeSetup', 'sectionsDetail'],
      go2jobByJobId: ['start']
    });
})();
