(function(){'use strict';
    tmMenuInit();
    const operation = tmsGetOperation();
    const action = tmsGetAction();
    const step = tmsGetStep();
    // === parseComments =====================================
    tmMenuAdd('button', '#parse_comments', 'Parse Comments', ()=>parseComments());
    if (action === 'parseComments') {
        if (step === 'do') { parseCommentsDo(); }
        else { abort(operation+': unknown step "'+step+'"'); }
    }
})();
