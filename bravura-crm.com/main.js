try {
  // === ui =====================================
  tmMenu.init({
    readme: 'https://github.com/df09/tampermonkey/blob/main/bravura-crm.com/readme.md',
    features: [],
    hotkeys: [
      ['redirectToJob', 'Redirect to job', 'Shift+J', redirectToJobStart],
      ['searchActiveJob', 'Search Active Job', 'Shift+S', searchActiveJobsStart],
    ],
    btnsPrep: [
      ['createBarcodes', 'Create Barcodes', createBarcodesStart],
    ],
    btnsExec: [],
  });
  // === handle active operations =====================================
  handleOperations({
    redirectToJob: ['start'],
    searchActiveJobs: ['start'],
    createBarcodes: ['start', 'createFo', 'checkExistingRooms', 'newProduct', 'sizeSetup', 'sectionsDetail'],
  });
} catch (err) {tmUi.abort({msg:['Error(main):',err.message]})}
