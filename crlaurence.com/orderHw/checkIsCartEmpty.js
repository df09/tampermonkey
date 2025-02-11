function orderHwCheckIsCartEmpty() {
  let isEmpty = true;
  const e = getEl('#cartPage .container .yCmsComponent .content h2', true);
  if (!e) isEmpty = false;
  if (e.textContent !== "Your shopping cart is empty") isEmpty = false;
  if (!isEmpty) tmUi.abort({msg:'The shopping cart must be empty before ordering hw.'});
  // addToCart
  const data = tmsGet('tm_orderHw-data');
  const po = Object.keys(data)[0]; 
  const sku = Object.keys(data[po])[0]; 
  const qty = data[po][sku]; 
  tmsSet('tm_orderHw-activePo', po);
  tmsSet('tm_orderHw-activeSku', sku);
  tmsSet('tm_orderHw-activeQty', qty);
  // redirect
  tmsSetOperation('orderHw/addToCart');
  redirect('https://www.crlaurence.com/p/'+sku);
}
