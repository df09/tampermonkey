(function(){'use strict';
  // === entrypoints =====================================
  function generateTwins(){tmsSetOperation('generateTwins/start');generateTwinsStart()}
  // === ui =====================================
  const map = {
    thumblers: [],
    btnsPrep: [
      ['generateTwins', 'Generate Twins', generateTwins],
    ],
    btnsExec: [],
  }
  tmUiInit(map);
  // === handle active operations ========================
  tmsOperationsHandle({
    generateTwins: ['start'],
  });
})();
