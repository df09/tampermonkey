function getUniqueLocations(data) {
  const locations = new Set();
  const lines = data.trim().split('\n');
  lines.forEach((line) => {
    line = line.trim().replace(/\s+/g, ' ');
    if (!line) return;
    const parts = line.split(':').map((part) => part.trim());
    if (parts.length !== 2) {
      tmUi.rollback('invalid data. line:', line);
    }
    const locParams = parts[0];
    const locs = parts[1].split(' ');
    locParams.split('_').forEach((pair) => {
      if (!pair.includes('-')) {
        tmUi.rollback('invalid data. pair:', pair);
      }
    });
    locs.forEach((loc) => {
      if (locations.has(loc)) {
        tmUi.rollback('duplicate location found:', loc);
      }
      locations.add(loc);
    });
  });
  console.log('Unique Locations:', Array.from(locations));
  return Array.from(locations);
}
function getDataBarcodes(data) {
  const result = [];
  const lines = data.trim().split('\n');
  lines.forEach((line) => {
    line = line.trim();
    line = line.replace(/\s+/g, ' ');
    if (!line) return;
    const [locParams, locs] = line.split(':').map((part) => part.trim());
    if (!locParams || !locs) {
      tmUi.rollback('invalid data. line:', line);
    }
    const foParams = locParams.split('_').map((pair) => {
      const [fo, glass] = pair.split('-');
      if (!fo || !glass) {
        tmUi.rollback('invalid data. pair:', pair);
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
    tmUi.rollback('getJobId - Job ID not found in the URL');
  } catch (error) {
    tmUi.rollback('getJobId - Error extracting Job ID:', error.message);
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
  tmUi.rollback('getFosId - fosId not found in "View FO" button href');
}
function createBarcodesStart() {
  // check start url
  const regex = /^http:\/\/bravura-crm\.com\/jobs\/.*$/;
  if (!regex.test(window.location.href)) {
    tmUi.abort({
      title: 'createBarcodes',
      msg: 'URL mast be http://bravura-crm.com/jobs/*',
    });
  }
  // get data
  const data = tmMenu.e.prepTextarea.value;
  tmsSet('tm_data-barcodes', getDataBarcodes(data));
  tmsSet('tm_data-locations', getUniqueLocations(data));
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
