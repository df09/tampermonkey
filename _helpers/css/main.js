injectCSS(`
/* ===== common ============================ */
.tm-hidden {display: none !important;}
.tm-block {display: block !important;}
.tm-flex {display: flex !important; }
.tm-col { display: flex; flex-direction: column; }
.tm-row { display: flex; flex-direction: row; align-items: center; justify-content: space-between; }
.tm-p10 { padding: 10px; } .tm-p5 { padding: 5px; } .tm-p0 { padding: 0; }
.tm-pt10 { padding-top: 10px; } .tm-pt5 { padding-top: 5px; } .tm-pt0 { padding-top: 0; }
.tm-pb10 { padding-bottom: 10px; } .tm-pb5 { padding-bottom: 5px; } .tm-pb0 { padding-bottom: 0; }
.tm-m10 { margin: 10px; } .tm-m5 { margin: 5px; } .tm-m0 { margin: 0; }
.tm-mt10 { margin-top: 10px; } .tm-mt5 { margin-top: 5px; } .tm-mt0 { margin-top: 0; }
.tm-mb10 { margin-bottom: 10px; } .tm-mb5 { margin-bottom: 5px; } .tm-mb0 { margin-bottom: 0; }
.tm-b { color: #007bff; }
.tm-g { color: #28a745; }
.tm-y { color: #ffc107; }
.tm-r { color: #dc3545; }
.tm-gray { color: #111111; }
.tm-border-b { border-color: #007bff !important; }
.tm-border-g { border-color: #28a745 !important; }
.tm-border-y { border-color: #ffc107 !important; }
.tm-border-r { border-color: #dc3545 !important; }
.tm-border-gray { border-color: #111111 !important; }
.tm-btn-b, .tm-btn-g, .tm-btn-y, .tm-btn-r, .tm-btn-gray {
  padding: 5px 10px;
  font-size: 12px;
  font-weight: bold;
  border: none;
  cursor: pointer;
  font-family: monospace;
}
.tm-btn-b { background-color: #007bff; color: #fff; }
.tm-btn-g { background-color: #28a745; color: #fff; }
.tm-btn-y { background-color: #ffc107; color: #fff; }
.tm-btn-r { background-color: #dc3545; color: #fff; }
.tm-btn-b:hover { background-color: #0056b3; }
.tm-btn-g:hover { background-color: #1e7e34; }
.tm-btn-y:hover { background-color: #e0a800; }
.tm-btn-r:hover { background-color: #c82333; }

/* ===== common.elements ============================ */
.tm-link { color: blue; text-decoration: underline; }
.tm-link:visited { color: purple; }
.tm-link:hover { color: darkblue; text-decoration: none; }
.tm-link:active { color: red; }
.tm-title {
  margin: 0;
  font-size: 16px;
  font-family: monospace;
  font-weight: normal;
}
.tm-textarea {
  resize: none;
  width: 100%;
  height: auto;
  min-height: 100px;
}

/* ===== container ============================ */
#tm-container {
  z-index: 10000; position: fixed; bottom: 10px; right: 10px;
  min-width: 300px; min-height: 20px;
  font-family: monospace; font-size: 1rem;
  background-color: #fff;
  border: 1px solid #ccc;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 0;
  margin: 0;
}

/* ===== header ============================ */
#tm-header {
  justify-content: space-between;
  padding: 0;
  margin: 0;
}
#tm-operation {
  width: 100%; height: 100%;
  border: 1px solid #ccc;
  padding: 5px;
  margin: 0;
}
#tm-minimize {
  font-size: 13px;
}

/* ===== main ============================ */
#tm-main {
  display: none;
  border: none;
  padding: 0 10px 10px 10px;
  margin: 0;
}
#tm-main-readme {
  padding: 0;
  margin: 0;
}

/* ===== main.hotkeyPairs ============================ */
#tm-main-hotkey-pairs {
  display: none;
  border: none;
  padding: 0;
  margin: 0;
}
.tm-hotkey-title {
  width: 100%;
}
.tm-hotkey {
  color: #f14354;
}
.tm-switch {
  position: relative;
  display: inline-block;
  width: 63px; height: 24px;
  padding: 0;
  margin: 0;
}
.tm-switch input {
  opacity: 0;
  width: 0; height: 0;
}
.tm-slider {
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: #ccc;
  border-radius: 24px;
  transition: 0.4s;
}
.tm-slider:before {
  position: absolute;
  content: "";
  height: 18px; width: 18px;
  left: 3px; bottom: 3px;
  background-color: white;
  border-radius: 50%;
  transition: 0.4s;
}
input:checked + .tm-slider {
  background-color: #4caf50;
}
input:checked + .tm-slider:before {
  transform: translateX(26px);
}

/* ===== main.prep ============================ */
#tm-main-btns-prep {
  display: none;
  border: none;
  padding: 0;
  margin: 0;
}

/* ===== main.exec ============================ */
#tm-exec {
  display: none;
  margin: 8px 0 0 0;
}
#tm-main-btns-exec {
  display: none;
  border: none;
  padding: 0;
  margin: 0;
}

/* ===== main.storage ============================ */
#tm-storage-buttons > * {
  flex-grow: 1;
}

/* ===== prep ============================ */
#tm-prep {
  display: none;
  border: none;
  padding: 0 10px 10px 10px;
  margin: 0;
}
#tm-prep-body {
  padding: 0;
  margin: 0;
  border: none;
}
#tm-prep-btn-exec {
  text-align: center;
}

/* ===== execution ============================ */
#tm-execution {
  display: none;
  border: none;
  padding: 0 10px 10px 10px;
  margin: 0;
}
#tm-execution-continue {
  display: none;
}

/* ===== modal ============================ */
.tm-modal {
  display: none;
  z-index: 10001; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); overflow-y: auto;
  width: 80%; max-height: 80%;
  min-width: 300px; min-height: 150px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  padding: 10px;
  margin: 0;
  background: #fff;
}
.tm-modal-header {}
.tm-modal-body {}
.tm-modal-body-alert { display: none; }
.tm-modal-body-dialog { display: none; }
.tm-modal-body-dialog-input { display: none; }
.tm-modal-body-dialog-textarea { display: none; }
.tm-modal-body-dialog-submit { max-width: 100px; }
.tm-modal-body-content { display: none; }

/* ===== modal.accent ============================ */
.tm-modal.tm-modal-info {}
.tm-modal.tm-modal-success {}
.tm-modal.tm-modal-warning {}
.tm-modal.tm-modal-error {}
.tm-modal.tm-modal-info .tm-modal-header {}
.tm-modal.tm-modal-success .tm-modal-header {}
.tm-modal.tm-modal-warning .tm-modal-header {}
.tm-modal.tm-modal-error .tm-modal-header {}

/* === modal.storage ======================================== */
#tm-modal-storage-view { display: none; }
.tm-modal table {
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 20px;
}
.tm-modal th, .modal td {
  padding: 10px;
  border-bottom: 1px solid #444;
  text-align: left;
}
`)




