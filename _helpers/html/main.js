injectHTML(`
<!-- container -->
<div id="tm-container">
  <!-- header -->
  <div id="tm-header" class="tm-row">
    <h3 id="tm-operation" class="tm-title">Execution: <span class="tm-g">None</span></h3>
    <div id="tm-header-btn-wrap" class="tm-row">
      <button id="tm-abort" class="tm-btn-r">ABORT</button>
      <button id="tm-minimize" class="tm-btn-b">X</button>
    </div>
  </div>
  <!-- main -->
  <div id="tm-main" class="tm-col">
    <div id="tm-main-readme"><a class="tm-link" href="[readme-url]">Readme</a></div>
    <div id="tm-main-thumblers" class="tm-col"></div>
    <div id="tm-main-btns-prep" class="tm-col"></div>
    <div id="tm-main-btns-exec" class="tm-col"></div>
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
      <h3 id="tm-prep-title" class="tm-title">[title]</h3>
      <button id="tm-prep-back" class="tm-btn-b">&lt;</button>
    </div>
    <div id="tm-prep-body" class="tm-col">
      <textarea id="tm-prep-textarea" spellcheck="false"></textarea>
      <!--
      <button id="tm-prep-exec" class="tm-btn-r tm-prep-exec">EXEC</button>
      -->
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
<div id="tm-modal-storage-view" class="tm-modal">
  <button id="tm-storage-close" class="tm-btn-r">X</button>
  <table>
    <thead><tr><th>Copy</th><th>Key</th><th>Value</th></tr></thead>
    <tbody id="tm-modal-storage-view-content">
      <!-- Content will be dynamically inserted here -->
    </tbody>
  </table>
  <button id="tm-storage-copy-all" class="tm-btn-g">Copy All</button>
</div>
`)
