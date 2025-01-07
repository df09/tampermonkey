(async function() {
  'use strict';

  // === action =====================================
  if (tmsGetState() === 'orderHw:start') {
    // login
    await updValEl(getEl('#j_username'), tmsRequest('tm_keep_crlLogin'));
    await updValEl(getEl('#jpassword'), tmsReset('tm_keep_crlPassword'));
  } else {
    // === clean ======================================
    tmsReset();
  }
})();
