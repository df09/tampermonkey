function parseHwData(data) {
  const result = {};
  const lines = data.trim().split('\n');
  let po = null;
  lines.forEach((line) => {
    if (!line.trim()) return; // Пропускаем пустые строки
    if (!line.startsWith(' ')) {
      // Это название po (начинается не с пробела)
      po = line.slice(0, -1).trim();
      result[po] = {};
    } else {
      // Данные внутри po (начинаются с пробела)
      const [sku, qty] = line.trim().split(':').map((part) => part.trim());
      if (!sku || !qty) {
        tmUi.abort({msg: ['Incorrect line:', line]});
      }
      const quantity = parseInt(qty, 10);
      if (isNaN(quantity) || quantity <= 0) {
        tmUi.abort({ msg: ['Incorrect quantity:', line] });
      }
      result[po][sku] = quantity;
    }
  });
  console.log('parseHwData:', result);
  return result;
}

function orderHwStart() {
  tmUi.startOperation('orderHw/start');
  tmsSet('tm_orderHw-data', parseHwData(tmMenu.e.prepTextarea.value));
  // checkIsCartEmpty
  tmsSetOperation('orderHw/checkIsCartEmpty');
  redirect('https://www.crlaurence.com/cart');
}
