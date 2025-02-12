async function orderHwCheckIsCartEmpty() {
  const regex = /^https:\/\/www\.crlaurence\.com\/cart$/;
  if (!regex.test(window.location.href)) {
    await sleep(3000);
    redirect('https://www.crlaurence.com/cart');
  } else {
    let isEmpty = true;
    const e = getEl('#cartPage .container .yCmsComponent .content h2', true);
    if (!e) isEmpty = false;
    if (e.textContent !== "Your shopping cart is empty") isEmpty = false;
    if (!isEmpty) {
      tmUi.reset();
      tmModal.info({
        accent: 'r',
        msg:'The shopping cart must be empty before ordering hw.'
      });
    }
    // redirect
    const items = tmsGet('tm_orderHw-dataItems');
    const sku = Object.keys(items)[0];
    tmsSetOperation('orderHw/addToCart');
    redirect('https://www.crlaurence.com/p/'+sku);
  }
}
