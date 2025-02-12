function orderHwDone() {
  if (tmsGet('tm_orderHw-isNa')) {
    tmUi.done({accent:'y', msg:[ 'Done! Please concider NA:', '', tmsGet('tm_orderHw-na')]});
  } else {
    tmUi.done({msg:['Done!','','Please check SHIPPING METHOD and all details before place order.']});
  }
}
async function orderHwCheckoutShipping() {
  // check if cart empty
  const regex = /^https:\/\/www\.crlaurence\.com\/cart$/;
  if (regex.test(window.location.href)) {
    let isEmpty = true;
    const e = getEl('#cartPage .container .yCmsComponent .content h2', true);
    if (!e) isEmpty = false;
    if (e.textContent !== "Your shopping cart is empty") isEmpty = false;
    if (isEmpty) {
      orderHwDone();
      return;
    }
  }
  // continue checkout
  await sleep(1000);
  getEl('.shippingMethod-option[data-value="crlPickup"]').click();
  await sleep(1000);
  getEl('#shipAddress.firstName').value = 'Ilia';
  await sleep(1000);
  // redirect to checkoutPayment
  tmsSetOperation('orderHw/checkoutPayment');
  getEl('#addressSubmit').click();
}
async function orderHwCheckoutPayment() {
  await sleep(1000);
  getEl('#poNumber').value = tmsGet('tm_orderHw-dataPo').slice(0, 15);
  // redirect to checkoutFinal
  tmsSetOperation('orderHw/checkoutFinal');
  getEl('button.checkout-next').click();
}
async function orderHwCheckoutFinal() {
  await sleep(1000);
  orderHwDone();
}
