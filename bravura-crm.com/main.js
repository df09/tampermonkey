// === entrypoints =====================================
function redirectToJob(hotkey){tmStart('redirectToJob');redirectToJobStart(hotkey)}
function searchActiveJob(){tmStart('searchActiveJob');searchActiveJobStart()}
function createBarcodes(){tmStart('createBarcodes');createBarcodesStart()}
// === ui =====================================
const tmMap = {
  readme: 'https://github.com/df09/tampermonkey/blob/main/bravura-crm.com/readme.md',
  hotkeys: [
    ['redirect-to-job', 'Redirect to job', 'Shift+J', redirectToJob],
    ['search-active-job', 'Search Active Job', 'Shift+S', searchActiveJob],
  ],
  btnsPrep: [
    ['create-barcodes', 'Create Barcodes', createBarcodes],
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
