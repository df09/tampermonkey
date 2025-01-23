function injectHTML(html){
  if(!html||typeof html!=='string'){abort('injectHTML: Invalid html.')}
  const c = document.createElement('div');c.innerHTML=html;document.body.append(c);
};injectHTML(`
  <!-- container -->
  <div id="tm-container" class="tm-container tm-col">
    <!-- header -->
    <div id="tm-header" class="tm-row">
      <h3 id="tm-operation" class="tm-p5 tm-title tm-border-y tm-operation">Operation:<span class="tm-y">Unknown</span></h3>
      <div id="tm-header-btns-wrap" class="tm-row">
        <button id="tm-abort" class="tm-dnone tm-btn-header tm-btn-r tm-header-btn-r">ABORT</button>
        <button id="tm-back" class="tm-dnone tm-btn-header tm-btn-b tm-header-btn-b">&lt;</button>
        <button id="tm-minimize" class="tm-dnone tm-btn-header tm-btn-r tm-header-btn-r">X</button>
      </div>
    </div>
    <!-- main -->
    <div id="tm-main" class="tm-dnone tm-body tm-col tm-border-w">
      <div id="tm-main-readme"><a class="tm-link" href="[readme-url]" target="_blank">Readme</a></div>
      <div id="tm-main-hotkeys" class="tm-dnone tm-col tm-pt5">
        <!-- tm-main-hotkeys.[hotkey] -->
      </div>
      <div id="tm-main-prep" class="tm-dnone tm-col tm-pt5">
        <!-- tm-main-prep.[prep] -->
      </div>
      <div id="tm-main-exec" class="tm-dnone tm-col tm-pt5">
        <!-- tm-main-exec.[exec] -->
      </div>
      <div id="tm-main-storage" class="tm-col tm-mt5 tm-border-w">
        <h3 id="tm-main-storage-title" class="tm-title">Storage</h3>
        <div id="tm-main-storage-body" class="tm-row">
          <button id="tm-main-storage-view" class="tm-btn-g tm-m5">View</button>
          <button id="tm-main-storage-reset" class="tm-btn-y tm-m5">Reset</button>
          <button id="tm-main-storage-clean" class="tm-btn-r tm-m5">CLEAN</button>
        </div>
      </div>
    </div>
    <!-- prep -->
    <div id="tm-prep" class="tm-dnone tm-body tm-col tm-border-w">
      <h3 id="tm-prep-title" class="tm-prep-title">[title]</h3>
      <textarea id="tm-prep-textarea" class="tm-mb5" spellcheck="false"></textarea>
      <!-- tm-prep-exec.[exec] -->
    </div>
    <!-- exec -->
    <div id="tm-exec" class="tm-dnone tm-body tm-col tm-border-w">
      <button id="tm-exec-continue" class="tm-dnone tm-btn-y">Continue</button>
      <button id="tm-exec-cancel" class="tm-btn-r">CANCEL</button>
    </div>
  </div>

  <!-- modal overlay -->
  <div id="tm-modal-overlay" class="tm-dnone tm-flex">
    <div id="tm-modal" class="tm-col">
      <div id="tm-modal-header" class="tm-row">
        <h3 id="tm-modal-header-title" class="tm-title">[title]</h3>
        <button id="tm-modal-header-close" class="tm-dnone tm-btn-gray">X</button>
      </div>
      <div id="tm-modal-body">
        <!-- modal.alert -->
        <div id="tm-modal-alert" class="tm-dnone tm-col">
          <div id="tm-modal-alert-msg" class="tm-col">[msg]</div>
          <button id="tm-modal-alert-ok" class="tm-btn-gray">[ok]</button>
        </div>
        <!-- modal.dialog -->
        <div id="tm-modal-dialog" class="tm-dnone tm-col">
          <div id="tm-modal-dialog-msg" class="tm-col">[msg]</div>
          <input id="tm-modal-dialog-input" class="tm-dnone" spellcheck="false"></input>
          <textarea id="tm-modal-dialog-textarea" class="tm-dnone" spellcheck="false"></textarea>
          <div id="tm-modal-dialog-yesno" class="tm-dnone tm-col">
            <button id="tm-modal-dialog-yesno-no" class="tm-dnone tm-btn-r">[no]</button>
            <button id="tm-modal-dialog-yesno-yes" class="tm-dnone tm-btn-g">[yes]</button>
          </div>
          <button id="tm-modal-dialog-submit" class="tm-dnone tm-btn-g">[submit]</button>
        </div>
        <!-- modal.content -->
        <div id="tm-modal-content" class="tm-dnone">
          <!-- modal.content.[content] -->
        </div>
    </div>
  </div>
`);
// main.hotkeys.[hotkey]
const tmHTMLMainHotkeysHotkey = `
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
  <div id="tm-modal-content-storageview">
    <table>
      <thead><tr><th>Copy</th><th>Key</th><th>Value</th></tr></thead>
      <tbody>
        <!-- modal.content.storageview.[row] -->
      </tbody>
    </table>
    <button id="tm-modal-storageview-copyall" class="tm-btn-g">Copy All</button>
  </div>`;
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
