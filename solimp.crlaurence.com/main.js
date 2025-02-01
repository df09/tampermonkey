// === entrypoints =====================================
function generateTwins(){tmsSetOperation('generateTwins/start');generateTwinsStart()}
// === ui =====================================
const map = {
  readme: 'https://github.com/df09/tampermonkey/blob/main/solimp.crlaurence.com/readme.md',
  hotkeys: [],
  btnsPrep: [
    ['generateTwins', 'Generate Twins', generateTwins],
  ],
  btnsExec: [],
}
tmMenu.init(tmMap);
// === handle active operations ========================
tmsOperationsHandle({
  generateTwins: ['start'],
});
