// input:
//   SCU4CH: 2
//   SGC037CH: 20
//   ...
// output: { SCU4CH: 2, SGC037CH: 20, ... }
function getHwData(textarea) {
  const hwData = {};
  const lines = textarea.value.trim().split('\n');
  lines.forEach((line) => {
    line = line.trim();
    line = line.replace(/\s+/g, ' '); // Убираем лишние пробелы
    if (!line) return; // Пропускаем пустые строки
    const [productName, qty] = line.split(':').map((part) => part.trim());
    if (!productName || !qty) { throw new Error(`Некорректная строка: "${line}"`); }
    // Проверка и форматирование productName
    if (!/^[A-Z0-9]+$/.test(productName.toUpperCase())) {
      throw new Error(`Некорректное имя продукта: "${productName}"`);
    }
    // Проверка количества
    const quantity = parseInt(qty, 10);
    if (isNaN(quantity) || quantity <= 0) {
      throw new Error(`Некорректное количество для продукта "${productName}": "${qty}"`);
    }
    hwData[productName.toUpperCase()] = quantity;
  });
  console.log('Formatted Data:', hwData);
  return hwData;
}

function orderHw() {
    tmsReset();
    tmsSetOperation('orderHw:init');

    const hwData = getHwData(getEl(tmMenuTextareaSelector)); // data
    tmsSetOperation('orderHw:login');
    redirect('/login');

    // TODO: if creds incorrect

    // for product in products:
    //   redirect to product page
    //   add to card
    //
    // go to catd
    // continue
    // done. there is NA-list. press place order
    // add comment to CRM

    tmsReset();console.log('actions/initOrderHw: done.');
}

async function orderHwLogin() {
    await updValEl(getEl('#j_username'), tmsRequest('tm_keep_crlLogin'));
    await updValEl(getEl('#jpassword'), tmsReset('tm_keep_crlPassword'));
}
