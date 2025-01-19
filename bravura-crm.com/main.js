// === entrypoints =====================================
async function redirectToJob(hotkey){await tmStart('redirectToJob');redirectToJobStart(hotkey)}
async function searchActiveJob(){await tmStart('searchActiveJob');searchActiveJobStart()}
async function createBarcodes(){await tmStart('createBarcodes');createBarcodesStart()}
// === ui =====================================
const tmMap = {
  readme: 'https://github.com/df09/tampermonkey/blob/main/bravura-crm.com/readme.md',
  hotkeyPairs: [
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
