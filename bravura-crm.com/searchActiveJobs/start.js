async function fetchJobsData() {
  try {
    const response = await fetch("http://bravura-crm.com/jobs/?filter=all&scroll=true", {
      credentials: "include",
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Cache-Control": "no-cache"
      },
      referrer: "http://bravura-crm.com/jobs",
      method: "GET",
      mode: "cors"
    });
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return await response.text();
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

function parseActiveJobs(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const table = doc.querySelector('#jobs_datatable');
  if (!table) return [];
  const rows = table.querySelectorAll('tr.pointer');
  const data = [];
  rows.forEach(row => {
    const jobElement = row.querySelector("td:nth-child(1) span");
    const customerElement = row.querySelector("td:nth-child(2) span");
    const statusElement = row.querySelector("td:nth-child(3) select");
    const assignToElement = row.querySelector("td:nth-child(4) select");
    const job = jobElement ? jobElement.textContent.trim() : '';
    const customer = customerElement ? customerElement.textContent.trim() : '';
    const status = statusElement ? statusElement.value.trim() : '';
    const assignTo = assignToElement ? assignToElement.value.trim() : '';
    data.push({ job, customer, status, assignTo });
  });
  return data;
}

async function searchActiveJobsStart() {
  // start
  tmsSetOperation('searchActiveJobs/start');
  tmMenu.showExec();
  // exec
  let activeJobs = tmsGet('tm_searchActiveJob-jobs');
  // TODO: или эти данные лежат в localstorage дольше 24ч
  if (!activeJobs) {
    const html = await fetchJobsData();
    activeJobs = parseActiveJobs(html);
    tmsSet('tm_searchActiveJob-jobs', activeJobs);
  }
  tmUi.abort({
    title: 'TODO',
    msg: ['TODO', activeJobs]
  });
  // // show modal-content
  // tmModal.content({
  //   accent: 'w',
  //   title: 'Active Jobs',
  //   actionContent: ()=>{
  //     // add refresh button
  //     // insert html
  //     // inmplement filter by texting
  //       // enter:
  //         // if only one left: redirect
  //         // if more: by number row
  //   }
  // });
}
