function getBarcodesData(textarea) {
  const result = [];
  const lines = textarea.value.trim().split('\n');
  lines.forEach((line) => {
    line = line.trim();
    line = line.replace(/\s+/g, ' ');
    if (!line) return;
    const [locParams, locs] = line.split(':').map((part) => part.trim());
    if (!locParams || !locs) {
      tmMenu.abort('invalid data. line:', line);
    }
    const foParams = locParams.split('_').map((pair) => {
      const [fo, glass] = pair.split('-');
      if (!fo || !glass) {
        tmMenu.abort('invalid data. pair:', pair);
      }
      return { fo, glass };
    });
    locs.split(' ').forEach((loc) => {
      foParams.forEach(({ fo, glass }) => {
        console.log(loc, glass, fo)
        result.push([loc, glass, fo]);
      });
    });
  });
  console.log('Formatted Data:', result);
  return result;
}
function getJobId() {
  try {
    const match = window.location.href.match(/\/jobs\/(\d+)/);
    if (match && match[1]) {
      const jobId = match[1];
      console.log('getJobId:', jobId);
      return jobId;
    }
    tmMenu.abort('getJobId - Job ID not found in the URL');
  } catch (error) {
    tmMenu.abort('getJobId - Error extracting Job ID:', error.message);
  }
}
function getFosId() {
  const viewFoSelector = "a[href*='/fabrication_orders/'][href$='/edit']";
  const match = getEl(viewFoSelector).href.match(/\/fabrication_orders\/(\d+)\/edit/);
  if (match && match[1]) {
    const fosId = match[1];
    console.log('getFosId:', fosId);
    return fosId;
  }
  tmMenu.abort('getFosId - fosId not found in "View FO" button href');
}
function createBarcodesStart() {
  // check start url
  const regex = /^http:\/\/bravura-crm\.com\/jobs\/.*$/;
  if (!regex.test(window.location.href)) {
    tmMenu.abort('createBarcodes: URL mast be http://bravura-crm.com/jobs/*');
  }
  // get data
  const data = getBarcodesData(getEl('#tm-prep-textarea'));
  tmsSet('tm_barcodesData', data);
  tmsSet('tm_jobId', getJobId());

  // check/create fo
  const createFoSelector = "a[data-method='post'][href^='/jobs/'][href$='/fabrication_orders']";
  const eCreateFo = getEl(createFoSelector, pass=true);
  if (eCreateFo) {
    // redirect to create Fo
    tmsSetOperation('createBarcodes/createFo');
    clickEl(eCreateFo);
  }
  // checkExistingRooms
  const fosId = getFosId();
  tmsSet('tm_fosId', fosId);
  tmsSetOperation('createBarcodes/checkExistingRooms');
  redirect(`http://bravura-crm.com/fabrication_orders/${fosId}/edit?show_finished=true`);
}
