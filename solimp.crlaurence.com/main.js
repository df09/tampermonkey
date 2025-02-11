try {
  // === ui =====================================
  tmMenu.init({
    readme: 'https://github.com/df09/tampermonkey/blob/main/solimp.crlaurence.com/readme.md',
    features: [],
    hotkeys: [],
    btnsPrep: [
      ['generateTwins', 'Generate Twins', generateTwinsStart],
    ],
    btnsExec: [],
  });
  // === handle active operations ========================
  handleOperations({generateTwins: ['start']});
} catch (err) {tmUi.abort({msg:['Error(main):',err.message]})}
