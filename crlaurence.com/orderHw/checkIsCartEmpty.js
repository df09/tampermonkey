function orderHwCheckIsCartEmpty() {
  let isEmpty = true;
  const e = getEl('#cartPage .container .yCmsComponent .content h2', true);
  if (!e) isEmpty = false;
  if (e.textContent !== "Your shopping cart is empty") isEmpty = false;
  if (!isEmpty) tmUi.abort({msg:'The shopping cart must be empty before ordering hw.'});
  // addToCart
  tmsSetOperation('orderHw/addToCart');
  const data = tmsGet('tm_data-orderHw');
  tmUi.abort({msg:data});
  // const sku =
  // redirect('https://www.crlaurence.com/p/'+sku);
}
