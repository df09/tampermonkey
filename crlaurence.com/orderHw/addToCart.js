function extractLeadingNumber(str) {
  const match = str.trim().match(/^\d+/); // Ищем число в начале строки
  return match ? parseInt(match[0], 10) : null;
}

async function orderHwAddToCart() {
  let items = tmsGet('tm_orderHw-dataItems');
  let sku = Object.keys(items)[0];
  let qty = items[sku];
  let na = tmsGet('tm_orderHw-na') || tmsGet('tm_orderHw-dataPo')+':\n';
  // check 404
  if (getEl('.error-404-wrapper', true)) tmUi.abort({msg: 'Product with SKU "'+sku+'" not found.'});
  // check availability
  const eAvail = getEl('.pd__infospace__contractorinfo__availabilitystock__black');
  const availability = extractLeadingNumber(eAvail.textContent);
  if (availability - qty < 0) {
    // NA - skip
    na += sku+' '+qty+' - NA (available '+availability+')\n';
    tmsSet('tm_orderHw-isNa', 1);
  } else {
    // add to cart
    na += sku+' '+qty+'\n';
    getEl('#quantity').value = qty;
    await sleep(300);
    getEl('#quantity').dispatchEvent(new Event('change', { bubbles: true }));
    await sleep(300);
    getEl('#addToCartButton').click();
  }
  await sleep(300);
  tmsSet('tm_orderHw-na', na);
  delete items[sku];
  // если есть еще sku
  if (Object.keys(items).length > 0) {
    // repeat
    tmsSet('tm_orderHw-dataItems', items);
    sku = Object.keys(items)[0];
    redirect('https://www.crlaurence.com/p/'+sku);
  } else {
    // redirect to checkoutShipping
    tmsSetOperation('orderHw/checkoutShipping');
    redirect('https://www.crlaurence.com/checkout/multi/delivery-address/add');
  }
}
