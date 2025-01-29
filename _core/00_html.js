function injectHTML(html){
  if(!html||typeof html!=='string'){throw new Error('injectHTML: Invalid html.')}
  const c = document.createElement('div');c.innerHTML=html;document.body.append(c);
};
injectHTML(`
  <!-- container -->
  <div id="tm-menu" class="tm-menu tm-col">
    <!-- header -->
    <div id="tm-header" class="tm-row">
      <h3 id="tm-operation" class="tm-p5 tm-title tm-border-y tm-operation">Operation:<span class="tm-y">Unknown</span></h3>
      <div id="tm-header-btns-wrap" class="tm-row">
        <button id="tm-abort" class="tm-dnone tm-btn-header tm-btn-r tm-header-btn-r">ABORT</button>
        <button id="tm-back" class="tm-dnone tm-btn-header tm-btn-b tm-header-btn-b">&lt;</button>
        <button id="tm-minimize" class="tm-dnone tm-btn-header tm-btn-r tm-header-btn-r tm-m0">X</button>
      </div>
    </div>
    <!-- main -->
    <div id="tm-main" class="tm-dnone tm-body tm-col tm-border-w">
      <div id="tm-readme"><a class="tm-link" href="[readme-url]" target="_blank">Readme</a></div>
      <div id="tm-hotkeys" class="tm-dnone tm-col tm-pt5">
        <!-- main-hotkeys.[hotkey] -->
      </div>
      <div id="tm-main-prep" class="tm-dnone tm-col tm-pt5">
        <!-- main-prep.[prep] -->
      </div>
      <div id="tm-main-exec" class="tm-dnone tm-col tm-pt5">
        <!-- main-exec.[exec] -->
      </div>
      <div id="tm-storage" class="tm-col tm-mt5 tm-border-w">
        <h3 id="tm-storage-title" class="tm-title">Storage</h3>
        <div id="tm-storage-body" class="tm-row">
          <button id="tm-storage-view" class="tm-btn-g tm-m5">View</button>
          <button id="tm-storage-reset" class="tm-btn-y tm-m5">Reset</button>
          <button id="tm-storage-clean" class="tm-btn-r tm-m5">CLEAN</button>
        </div>
      </div>
    </div>
    <!-- prep -->
    <div id="tm-prep" class="tm-dnone tm-body tm-col tm-border-w">
      <h3 id="tm-prep-title" class="tm-prep-title">[title]</h3>
      <textarea id="tm-prep-textarea" class="tm-mb5" spellcheck="false"></textarea>
      <!-- prep-exec.[exec] -->
    </div>
    <!-- exec -->
    <div id="tm-exec" class="tm-dnone tm-body tm-col tm-border-w">
      <button id="tm-exec-continue" class="tm-dnone tm-btn-y">Continue</button>
      <button id="tm-exec-cancel" class="tm-btn-r">CANCEL</button>
    </div>
  </div>
  <!-- modal -->
  <div id="tm-modal-overlay" class="tm-dnone tm-flex">
    <div id="tm-modal" class="tm-col">
      <div id="tm-modal-header" class="tm-row">
        <h3 id="tm-modal-title" class="tm-title">[title]</h3>
        <button id="tm-modal-close" class="tm-btn-gray">X</button>
      </div>
      <div id="tm-modal-body">
        <!-- modal.info -->
        <div id="tm-modal-info" class="tm-dnone tm-col">
          <div id="tm-modal-info-msg">[msg]</div>
          <button id="tm-modal-info-btn" class="tm-btn-gray">[ok]</button>
        </div>
        <!-- modal.yn -->
        <div id="tm-modal-yn" class="tm-dnone tm-col">
          <div id="tm-modal-yn-msg">[msg]</div>
          <button id="tm-modal-yn-btn-no" class="tm-btn-r">[no]</button>
          <button id="tm-modal-yn-btn-yes" class="tm-btn-g">[yes]</button>
        </div>
        <!-- modal.input -->
        <div id="tm-modal-input" class="tm-dnone tm-col">
          <div id="tm-modal-input-msg">[msg]</div>
          <input id="tm-modal-input-input" spellcheck="false"></input>
          <button id="tm-modal-input-submit" class="tm-btn-g">[submit]</button>
        </div>
        <!-- modal.content -->
        <div id="tm-modal-content" class="tm-dnone tm-col">
          <!-- modal.content.[content] -->
        </div>
      </div>
    </div>
  </div>
`);
// main.hotkeys.[hotkey]
const tmHTMLMainHotkey = `
  <div id="{{id}}" class="tm-row tm-group-main-hotkeys">
    <h3 class="tm-hotkey-title tm-row">
      <span class="tm-hotkey-title-name">{{name}}</span>
      <span class="tm-hotkey-title-keys tm-r">({{keys}})</span>
    </h3>
    <label class="tm-hotkey-switch tm-ml0 tm-mb0">
      <input type="checkbox">
      <span class="tm-hotkey-slider"></span>
    </label>
  </div>`;
// main.prep.[prep]
const tmHTMLMainPrep = `
  <button id="{{id}}" class="tm-group-main-prep tm-btn-g">{{title}} -&gt;</button>`;
// main.exec.[exec]
const tmHTMLMainExec = `
  <button id="{{id}}" class="tm-group-main-exec tm-btn-y">EXEC: {{title}}</button>`;
// prep.exec.[exec]
const tmHTMLPrepExec = `
  <button id="{{id}}" class="tm-group-prep-exec tm-btn-r">EXEC</button>`;
// modal.content.storageview
const tmHTMLModalStorageview = `
  <table>
    <thead><tr><th>Copy</th><th>Key</th><th>Value</th></tr></thead>
    <tbody>
      <!-- modal.content.storageview.[row] -->
    </tbody>
  </table>
  <button id="tm-modal-storageview-copyall" class="tm-btn-g">Copy All</button>
`;
// modal.content.storageview.row
const tmHTMLModalStorageviewRow = `
  <tr class="tm-modal-storageview-row">
    <td class="tm-modal-storageview-row-tdkey">{{key}}</td>
    <td class="tm-modal-storageview-row-tdval">
      <span class="tm-modal-storageview-row-value" data-value="{{value}}">{{value}}</span>
      <button class="tm-modal-storageview-row-copy tm-btn-g">Copy</button>
      <button class="tm-modal-storageview-row-delete tm-btn-g">Delete</button>
    </td>
  </tr>`;
