function parseHwData(data) {
  const lines = data.trim().split('\n');
  if (lines.length === 0) {tmUi.abort({msg:['Empty data']})}
  const po = lines[0].trim();
  const items = {};
  lines.slice(1).forEach((line) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) return; // Пропускаем пустые строки
    const parts = trimmedLine.split(/\s+/);
    if (parts.length !== 2) { tmUi.abort({ msg: ['Incorrect line format:', line] })}
    const [qty, sku] = parts;
    const quantity = parseInt(qty, 10);
    if (isNaN(quantity) || quantity <= 0) { tmUi.abort({ msg: ['Incorrect quantity:', line] })}
    items[sku] = quantity;
  });
  console.log('parseHwData:', { po, items });
  return { po, items };
}

function orderHwStart() {
  tmUi.startOperation('orderHw/start');
  const data = parseHwData(tmMenu.e.prepTextarea.value);
  tmsSet('tm_orderHw-dataPo', data.po);
  tmsSet('tm_orderHw-dataItems', data.items);
  // checkIsCartEmpty
  tmsSetOperation('orderHw/checkIsCartEmpty');
  redirect('https://www.crlaurence.com/cart');
}
