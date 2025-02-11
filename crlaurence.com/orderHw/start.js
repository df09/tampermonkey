function parseHwData(data) {
  const result = {};
  const lines = data.trim().split('\n');
  let po = null;
  lines.forEach((line) => {
    line = line.trim();
    if (!line) return; // Пропускаем пустые строки
    if (/^[\w\s.]+:$/.test(line)) {
      // Это название локации
      po = line.slice(0, -1).trim();
      result[po] = {};
    } else if (po) {
      // Это данные внутри локации
      const [sku, qty] = line.split(':').map((part) => part.trim());
      if (!sku || !qty) {
        tmUi.abort({msg: ['Некорректная строка:', line]})
      }
      const quantity = parseInt(qty, 10);
      if (isNaN(quantity) || quantity <= 0) {
        tmUi.abort({msg: ['Некорректное количество для продукта:', line]})
      }
      result[po][sku] = quantity;
    } else {
      tmUi.abort({msg: ['Неожиданный формат строки:', line]})
    }
  });
  console.log('parseHwData:', result);
  return result;
}

function orderHwStart() {
  tmUi.startOperation('orderHw/start');
  tmsSet('tm_data-orderHw', parseHwData(tmMenu.e.prepTextarea.value));
  // checkIsCartEmpty
  tmsSetOperation('orderHw/checkIsCartEmpty');
  redirect('https://www.crlaurence.com/cart');

  // for product in products:
    // check if product exist
    // redirect to product page
    // check availability
    // add to cart
  // redirect to checkout
  // make order
  // done, please confirm
  // or
  // done, these is not available
    // info about another stocks
    // text to copy for crm

  tmUi.done();
}
