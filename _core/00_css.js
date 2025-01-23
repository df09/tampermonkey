function injectCSS(css){
  if(!css||typeof css!=='string'){abort('injectCSS: Invalid css.')}
  const e=document.createElement('style');e.type='text/css';e.textContent=css;
  document.head.appendChild(e);
};injectCSS(`
/* ===== common ============================ */
.tm-dnone{display:none!important;}
.tm-dflex{display:flex;}
.tm-dblock{display:block;}
.tm-p10{padding:10px;} .tm-p5{padding:5px;} .tm-p0{padding:0;}
.tm-pt10{padding-top:10px;} .tm-pt5{padding-top:5px;} .tm-pt0{padding-top:0;}
.tm-pb10{padding-bottom:10px;} .tm-pb5{padding-bottom:5px;} .tm-pb0{padding-bottom:0;}
.tm-pl10{padding-left:10px;} .tm-pl5{padding-left:5px;} .tm-pl0{padding-left:0;}
.tm-pr10{padding-right:10px;} .tm-pr5{padding-right:5px;} .tm-pr0{padding-right:0;}
.tm-ph10{padding-left:10px; padding-right:10px;} .tm-ph5{padding-left:5px; padding-right:5px;} .tm-ph0{padding-left:0px; padding-right:0px;}
.tm-pv10{padding-top:10px; padding-bottom:10px;} .tm-pv5{padding-top:5px; padding-bottom:5px;} .tm-pv0{padding-top:0px; padding-bottom:0px;}
.tm-m10{margin:10px;} .tm-m5{margin:5px;} .tm-m0{margin:0;}
.tm-mt10{margin-top:10px;} .tm-mt5{margin-top:5px;} .tm-mt0{margin-top:0;}
.tm-mb10{margin-bottom:10px;} .tm-mb5{margin-bottom:5px;} .tm-mb0{margin-bottom:0;}
.tm-ml10{margin-left:10px;} .tm-ml5{margin-left:5px;} .tm-ml0{margin-left:0;}
.tm-mr10{margin-right:10px;} .tm-mr5{margin-right:5px;} .tm-mr0{margin-right:0;}
.tm-mh10{margin-left:10px; margin-right:10px;} .tm-mh5{margin-left:5px; margin-right:5px;} .tm-mh0{margin-left:0px; margin-right:0px;}
.tm-mv10{margin-top:10px; margin-bottom:10px;} .tm-mv5{margin-top:5px; margin-bottom:5px;} .tm-mv0{margin-top:0px; margin-bottom:0px;}
.tm-w{color:#ffffff;}
.tm-b{color:#007bff;}
.tm-g{color:#3fa356;}
.tm-y{color:#e6b114;}
.tm-r{color:#dc3545;}
.tm-gray{color:#111111;}
.tm-border-w{border:1px solid #cccccc;}
.tm-border-b{border:1px solid #007bff;}
.tm-border-g{border:1px solid #3fa356;}
.tm-border-y{border:1px solid #e6b114;}
.tm-border-r{border:1px solid #dc3545;}
.tm-border-gray{border:1px solid #111111;}

/* ===== common.elements ============================ */
.tm-col { display: flex; flex-direction: column; }
.tm-row { display: flex; flex-direction: row; align-items: center; justify-content: space-between; }
.tm-btn-b, .tm-btn-g, .tm-btn-y, .tm-btn-r, .tm-btn-gray {
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
}
.tm-btn-b { background-color: #007bff; color: #fff; }
.tm-btn-g { background-color: #3fa356; color: #fff; }
.tm-btn-y { background-color: #e6b114; color: #fff; }
.tm-btn-r { background-color: #dc3545; color: #fff; }
.tm-btn-b:hover { background-color: #0056b3; }
.tm-btn-g:hover { background-color: #42af5b; }
.tm-btn-y:hover { background-color: #ffbf00; }
.tm-btn-r:hover { background-color: #c82333; }
.tm-link { color: blue; text-decoration: underline; }
.tm-link:visited { color: purple; }
.tm-link:hover { color: darkblue; text-decoration: none; }
.tm-link:active { color: red; }
.tm-title {
  font-size: 16px;
  font-weight: normal;
  padding: 5px;
  margin: 0;
}
.tm-body {
  height: 100%;
  padding: 5px 10px 10px 10px;
  border: 1px solid #ccc;
  border-top: 0;
}

/* ===== container ============================ */
#tm-container * { font-family: monospace; }
#tm-container {
  z-index: 10000; position: fixed; bottom: 5px; right: 10px;
  background-color: #fff; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-height: 30px;
  transform: none; /* Сбрасываем смещение */
  transition: none; /* Убираем возможные анимации */
}

/* ===== header ============================ */
#tm-header { min-height: 30px; }
.tm-operation { width: 100%; height: 30px; padding: 5px;}
.tm-btn-header { font-size: 12px; height: 30px; border-radius: 0; }
.tm-btn-header-r { border: 1px solid #ff6666; background-color: #993333; }
.tm-btn-header-b { border: 1px solid #384489; background-color: #5d6ec7; }

/* ===== main ============================ */

/* ===== main.hotkeys ============================ */
.tm-group-hotkey {}
.tm-hotkey-title {
  font-size: 16px;
  font-weight: normal;
  width: 100%;
  padding: 5px 5px 5px 0;
  margin: 0;
}
.tm-hotkey-keys { color: #f14354; }
.tm-hotkey-switch {
  display: inline-block;
  position: relative;
  width: 42px; height: 24px;
}
.tm-hotkey-switch input { opacity: 0; width: 0; height: 0; }
.tm-hotkey-slider {
  cursor: pointer;
  transition: 0.1s;
  position: absolute; top: 0; left: 0; right: 0; bottom: 0;
  width: 40px;
  background-color: #ccc;
  border-radius: 24px;
}
.tm-hotkey-slider:before {
  content: "";
  transition: 0.1s;
  position: absolute; left: 3px; bottom: 3px;
  height: 18px; width: 18px;
  background-color: white;
  border-radius: 50%;
}
input:checked + .tm-hotkey-slider { background-color: #4caf50; }
input:checked + .tm-hotkey-slider:before { transform: translateX(17px); }

/* ===== main.prep ============================ */
#tm-prep-textarea {
  width: 100%;
  height: 100%;
}
/* ===== main.exec ============================ */

/* ===== main.storage ============================ */
#tm-main-storage-body > * {
  flex-grow: 1;
}

/* ===== prep ============================ */
.tm-prep-title {
  font-size: 16px;
  font-weight: normal;
  width: 100%;
  padding: 5px 5px 5px 0;
  margin: 0;
}
#tm-prep-exec {
  text-align: center;
}

/* ===== exec ============================ */

/* ===== modal ============================ */
#tm-modal-overlay {
  z-index: 9999;
  position: fixed; top: 0; left: 0;
  width: 100%; height: 100%;
  align-items: center; justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
}
#tm-modal {
  z-index: 10001;
  position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
  width: auto; height: auto; max-width: 90vw; max-height: 90vh; overflow-y: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  padding: 10px;
  background: #fff;
}

/* ===== modal.accent ============================ */
#tm-modal.tm-modal-info {}
#tm-modal.tm-modal-success {}
#tm-modal.tm-modal-warning {}
#tm-modal.tm-modal-error {}

/* === modal.storage ======================================== */
#tm-modal table {
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 20px;
}
#tm-modal th, .modal td {
  padding: 10px;
  border-bottom: 1px solid #444;
  text-align: left;
}
`);
