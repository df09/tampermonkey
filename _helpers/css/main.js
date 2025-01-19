injectCSS(`
/* ===== common ============================ */
.tm-hidden {display: none !important;}
.tm-block {display: block !important;}
.tm-flex {display: flex !important; }
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
.tm-col {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.tm-row {
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
}
.tm-b { color: #007bff; }
.tm-g { color: #28a745; }
.tm-y { color: #ffc107; }
.tm-r { color: #dc3545; }
.tm-border-b { border-color: #007bff !important; }
.tm-border-g { border-color: #28a745 !important; }
.tm-border-y { border-color: #ffc107 !important; }
.tm-border-r { border-color: #dc3545 !important; }
.tm-btn-b, .tm-btn-g, .tm-btn-y, .tm-btn-r {
  padding: 5px 12px;
  font-size: 12px;
  font-weight: bold;
  border: none;
  border-radius: 4px;
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

/* ===== container ============================ */
#tm-container {
  z-index: 10000;
  position: fixed;
  bottom: 10px;
  right: 10px;
  font-family: monospace;
  font-size: 1rem;
  padding: 0;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  min-width: 300px;
  min-height: 40px;
}

/* ===== header ============================ */
#tm-header {
  padding: 10px 10px 0 10px;
  justify-content: space-between;
}
#tm-operation {
  width: 100%; height: 100%;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

/* ===== main ============================ */
#tm-main {
  display: none;
  margin: 0;
  border: none;
}
#tm-main-readme {
  margin: 0;
  padding: 0;
  font-size: 16px;
  font-family: monospace;
  font-weight: normal;
}

/* ===== main.hotkeyPairs ============================ */
#tm-main-hotkey-pairs {
  display: none;
  border: none;
  padding: 0;
  margin: 0;
}
.tm-hotkey {
  color: #f14354;
}
.tm-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}
.tm-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.tm-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 24px;
}
.tm-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}
input:checked + .tm-slider {
  background-color: #4caf50;
}
input:checked + .tm-slider:before {
  transform: translateX(26px);
}

/* ===== main.prep ============================ */
#tm-prep {
  display: none;
  margin: 8px 0 0 0;
}
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

/* ===== main.execution ============================ */
#tm-execution {
  display: none;
  margin: 8px 0 0 0;
}
#tm-execution-continue {
  display: none;
}


/* ===== prep ============================ */
#tm-textarea {
  resize: none;
  width: 100%;
  height: auto;
  margin-bottom: 10px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  min-height: 100px;
}

/* ===== modal ============================ */
.tm-modal {
  display: none;
  z-index: 10001;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  overflow-y: auto;
  width: 80%;
  max-height: 80%;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  color: white;
  background-color: #1e1e1e;
  min-width: 300px;
  min-height: 150px;
}
.tm-modal table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}
.tm-modal th, .modal td {
  padding: 10px;
  border-bottom: 1px solid #444;
  text-align: left;
}
`)
