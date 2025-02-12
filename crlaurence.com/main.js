try {
  // ui
  tmMenu.init({
    readme: 'https://github.com/df09/tampermonkey/blob/main/crlaurence.com/readme.md',
    features: [['autoLogin', 'Auto Login']],
    hotkeys:  [],
    btnsPrep: [['orderHw', 'Order HW', orderHwStart]],
    btnsExec: [],
  });
  // auto operations
  fAutoLogin('autoLogin');
  // active operations
  handleOperations({orderHw: [
    'start', 'checkIsCartEmpty', 'addToCart',
    'checkoutShipping', 'checkoutPayment', 'checkoutFinal'
  ]});
} catch (err) {tmUi.abort({msg:['Error(main):',err.message, err.stack]})}
