try {
  // === ui =====================================
  const tmMap = {
    readme: 'https://github.com/df09/tampermonkey/blob/main/solimp.crlaurence.com/readme.md',
    hotkeys: [],
    btnsPrep: [
      ['generateTwins', 'Generate Twins', generateTwinsStart],
    ],
    btnsExec: [],
  }
  tmMenu.init(tmMap);
  // === handle active operations ========================
  tmsOperationsHandle({
    generateTwins: ['start'],
  });
} catch (e) {tmUi.abort({msg:['Error:',e]})}
