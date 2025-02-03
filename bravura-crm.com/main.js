// === ui =====================================
const tmMap = {
  readme: 'https://github.com/df09/tampermonkey/blob/main/bravura-crm.com/readme.md',
  hotkeys: [
    ['redirect-to-job', 'Redirect to job', 'Shift+J', redirectToJobStart],
    ['search-active-job', 'Search Active Job', 'Shift+S', searchActiveJobsStart],
  ],
  btnsPrep: [
    ['create-bcodes', 'Create Barcodes', createBarcodesStart],
  ],
  btnsExec: [],
}
tmMenu.init(tmMap);
// === handle active operations =====================================
tmsOperationsHandle({
  redirectToJob: ['start'],
  searchActiveJobs: ['start'],
  createBarcodes: ['start', 'createFo', 'checkExistingRooms', 'newProduct', 'sizeSetup', 'sectionsDetail'],
});
