injectHTML(`
<!-- container -->
<div id="tm-container" class="tm-col">
  <!-- header -->
  <div id="tm-header" class="tm-row">
    <h3 id="tm-operation" class="tm-title">Execution: <span class="tm-g">None</span></h3>
    <button id="tm-abort" class="tm-btn-r">ABORT</button>
    <button id="tm-minimize" class="tm-btn-b">X</button>
  </div>
  <!-- main -->
  <div id="tm-main" class="tm-col">
    <h3 id="tm-main-readme"><a href="[readme-url]">[readme]</a></h3>
    <div id="tm-main-thumblers" class="tm-col">[thumblers]</div>
    <div id="tm-main-buttons" class="tm-col">[buttons]</div>
    <div id="tm-main-storage" class="tm-col">
      <h3 id="tm-storage-title" class="tm-title">Storage</h3>
      <div id="tm-storage-buttons" class="tm-row">
        <button id="tm-storage-view" class="tm-btn-g">View</button>
        <button id="tm-storage-reset" class="tm-btn-y">Reset</button>
        <button id="tm-storage-clean" class="tm-btn-r">CLEAN</button>
      </div>
    </div>
  </div>
  <!-- prep -->
  <div id="tm-prep" class="tm-col">
    <div id="tm-prep-header" class="tm-row">
      <h3 id="tm-prep-action" class="tm-title">[action]</h3>
      <button id="tm-prep-back" class="tm-btn-b">&lt;-</button>
    </div>
    <div id="tm-prep-body" class="tm-col">
      <textarea id="tm-prep-textarea" spellcheck="false"></textarea>
      <button id="tm-prep-exec" class="tm-btn-r">EXEC</button>
    </div>
  </div>
  <!-- execution -->
  <div id="tm-execution" class="tm-col">
    <button id="tm-execution-continue" class="tm-btn-y">Continue</button>
    <button id="tm-execution-cancel" class="tm-btn-r">CANCEL</button>
  </div>
</div>

<!-- modals -->
<!-- modals.storage-view -->
<div id="modal-storage-view" class="modal">
  <button id="storage-close" class="tm-btn-r">X</button>
  <table>
    <thead><tr><th>Copy</th><th>Key</th><th>Value</th></tr></thead>
    <tbody id="modal-storage-view-content">
      <!-- Content will be dynamically inserted here -->
    </tbody>
  </table>
  <button id="storage-copy-all" class="tm-btn-g">Copy All</button>
</div>
`)
