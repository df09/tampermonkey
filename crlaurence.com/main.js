(function(){'use strict';
    tmMenuInit();
    const operation = tmsGetOperation();
    const action = tmsGetAction();
    const step = tmsGetStep();
    // === orderHw =====================================
    tmMenuAdd('button', '#oder_hw', 'Order hw', ()=>orderHw());
    if (action === 'orderHw') {
        if (step === 'login') { orderHwLogin();
        } else if (step === 'addProducts') { orderHwAddProducts();
        } else if (step === 'checkout') { orderHwCheckout();
        } else {abort(operation+': unknown step "'+step+'"');}
    }
    // === ... =====================================
})();
