injectHTML(`
<!-- container -->
<div id="tm-container" class="tm-container">
  <!-- header -->
  <div id="tm-header" class="tm-row">
    <h3 id="tm-operation" class="tm-title tm-p5 tm-border-y">Operation:<span class="tm-y">Unknown</span></h3>
    <div id="tm-header-btn-wrap" class="tm-row">
      <button id="tm-abort" class="tm-dnone tm-btn-r">ABORT</button>
      <button id="tm-back" class="tm-dnone tm-btn-gray">&lt;</button>
      <button id="tm-minimize" class="tm-dnone tm-btn-gray">X</button>
    </div>
  </div>
  <!-- main -->
  <div id="tm-main" class="tm-dnone tm-col tm-border-w">
    <div id="tm-main-readme" class="tm-pt5"><a class="tm-link" href="[readme-url]" target="_blank">Readme</a></div>
    <div id="tm-main-hotkeys" class="tm-dnone tm-col tm-pt5"></div>
    <div id="tm-main-prep" class="tm-dnone tm-col tm-pt5">
      <!-- <button id="tm-main-prep+id">[title] -&gt;</button> -->
    </div>
    <div id="tm-main-exec" class="tm-dnone tm-col tm-pt5">
      <!-- <button id="tm-main-exec+id">EXEC: [title]</button> -->
    </div>
    <div id="tm-main-storage" class="tm-col tm-mt5 tm-border-w">
      <h3 id="tm-main-storage-title" class="tm-title">Storage</h3>
      <div id="tm-main-storage-body" class="tm-row">
        <button id="tm-main-storage-body-view" class="tm-btn-g tm-m5">View</button>
        <button id="tm-main-storage-body-reset" class="tm-btn-y tm-m5">Reset</button>
        <button id="tm-main-storage-body-clean" class="tm-btn-r tm-m5">CLEAN</button>
      </div>
    </div>
  </div>
  <!-- prep -->
  <div id="tm-prep" class="tm-dnone tm-col tm-border-w">
    <h3 id="tm-prep-title" class="tm-title">[title]</h3>
    <textarea id="tm-prep-textarea" spellcheck="false"></textarea>
    <!-- <button id="tm-prep-exec+id">EXEC</button>
  </div>
  <!-- exec -->
  <div id="tm-exec" class="tm-dnone tm-col tm-border-w">
    <button id="tm-exec-continue" class="tm-dnone tm-btn-y">Continue</button>
    <button id="tm-exec-cancel" class="tm-btn-r">CANCEL</button>
  </div>
</div>

<!-- modal overlay -->
<div id="tm-modal-overlay" class="tm-dnone tm-flex">
  <!-- modal -->
  <div id="tm-modal" class="tm-col">
    <div id="tm-modal-header" class="tm-row">
      <h3 id="tm-modal-header-title" class="tm-title">[title]</h3>
      <button id="tm-modal-header-close" class="tm-dnone tm-btn-gray">X</button>
    </div>
    <!-- modal.alert -->
    <div id="tm-modal-alert" class="tm-dnone tm-col">
      <div id="tm-modal-alert-msg" class="tm-col">[msg]</div>
      <button id="tm-modal-alert-ok" class="tm-btn-gray">OK</button>
    </div>
    <!-- modal.dialog -->
    <div id="tm-modal-dialog" class="tm-dnone tm-col">
      <div id="tm-modal-dialog-msg" class="tm-col">[msg]</div>
      <!-- modal.dialog.textarea/input -->
      <input id="tm-modal-dialog-input" class="tm-dnone" spellcheck="false"></input>
      <textarea id="tm-modal-dialog-textarea" class="tm-dnone" spellcheck="false"></textarea>
      <!-- modal.dialog.submit -->
      <button id="tm-modal-dialog-submit" class="tm-btn-g">Submit</button>
    </div>
    <!-- modal.content.storage-view -->
    <div id="tm-modal-content-storage-view" class="tm-dnone">
      <table>
        <thead><tr><th>Copy</th><th>Key</th><th>Value</th></tr></thead>
        <tbody id="tm-modal-storage-view-content">
          <!-- ... -->
        </tbody>
      </table>
      <button id="tm-storage-copy-all" class="tm-btn-g">Copy All</button>
    </div>
    <!-- modal.content.... -->
  </div>
</div>
`)
