function orderHwAddToCart() {
  const data = tmsGet('tm_orderHw-data');
  const po = tmsGet('tm_orderHw-activePo');
  const sku = tmsGet('tm_orderHw-activeSku');
  const qty = tmsGet('tm_orderHw-activeQty');
  // check 404
  if (getEl('.error-404-wrapper', true)) tmUi.abort({msg: 'Product with SKU "'+sku+'" not found.'});

  // проверить что есть на стоке
  const eAvail = getEl('.pd__infospace__contractorinfo__availabilitystock__black');
  const availability = Number(eAvail.textContent.split(' ')[0]);
  if (availability - qty < 0) {
    // TODO: продолжать закупать hw, добавив заметку
    tmUi.abort({msg:'NA'});
  }

  // добавить в корзину
  // удалить этот товар из data
  // переключиться на следующий активный товар
  // if sku для этого PO еще есть:
    // redirect to productpage and repeat
  // else:
    // redirect to cart
}
