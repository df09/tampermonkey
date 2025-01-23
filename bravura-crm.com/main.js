// === entrypoints =====================================
function redirectToJob(hotkey){tmsSetOperation('redirectToJob/start');redirectToJobStart(hotkey)}
function searchActiveJob(){tmsSetOperation('searchActiveJob/start');searchActiveJobStart()}
function createBarcodes(){tmsSetOperation('createBarcodes/start');createBarcodesStart()}
// === ui =====================================
const tmMap = {
  readme: 'https://github.com/df09/tampermonkey/blob/main/bravura-crm.com/readme.md',
  hotkeys: [
    ['redirect-to-job', 'Redirect to job', 'Shift+J', redirectToJob],
    ['search-active-job', 'Search Active Job', 'Shift+S', searchActiveJob],
  ],
  btnsPrep: [
    ['create-bcodes', 'Create Barcodes', createBarcodes],
  ],
  btnsExec: [],
}
tmUiInit(tmMap);
// === handle active operations =====================================
tmsOperationsHandle({
  redirectToJob: ['start'],
  searchActiveJob: ['start'],
  createBarcodes: ['start', 'createFo', 'newProduct', 'sizeSetup', 'sectionsDetail'],
});
