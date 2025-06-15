function injectHTML(html){
  if(!html||typeof html!=='string'){throw new Error('injectHTML: Invalid html.')}
  const c = document.createElement('div'); c.innerHTML = html; document.body.append(c);
}
injectHTML(`
<!-- контейнер для GUI -->
<div id="playlist-gui-log"></div>
`);

