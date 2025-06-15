function injectCSS(css){
  if(!css||typeof css!=='string'){throw new Error('injectCSS: Invalid css.')}
  const e=document.createElement('style');e.type='text/css';e.textContent=css;
  document.head.appendChild(e);
}
injectCSS(`
.plm-btn-main {
  background: #222;
  color: #ffd700;
  border: 1px solid #555;
  padding: 5px 10px;
  font-size: 12px;
  cursor: pointer;
  border-radius: 4px;
  display: inline-block;
  font-family: monospace;
  margin: 3px 0;
  user-select: none;
  width: 100%;
  text-align: left;
}
.plm-btn-main:hover { background: #333; border-color: #888; }
.plm-btn {
  background: #111;
  color: #eee;
  border: 1px solid #444;
  padding: 4px;
  font-size: 12px;
  cursor: pointer;
  border-radius: 4px;
  font-family: monospace;
  user-select: none;
  width: 100%;
  text-align: center;
}
.plm-btn:hover { background: #000; }
.playlist-popup {
  position: absolute;
  background: #1c1c1c;
  color: #eee;
  border: 1px solid #444;
  font-family: monospace;
  font-size: 12px;
  padding: 4px;
  z-index: 9999;
  box-shadow: 0 2px 6px rgba(0,0,0,0.5);
  border-radius: 5px;
  max-height: 80vh;
  overflow-y: auto;
}
.playlist-popup .playlist-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px;
  margin-bottom: 3px;
  cursor: pointer;
  background: #2a2a2a;
  border-radius: 3px; min-width: 140px;
}
.playlist-popup .playlist-item:hover { background: #3a3a3a; }
.playlist-popup .state-unk { color: #666; }
.playlist-popup .state-add { color: #3fa356; }
.playlist-popup .state-del { color: #dc3545; }
.playlist-popup .group-box { padding: 4px; }
.playlist-popup > div:nth-child(3) { display: flex; background: #111; border-radius: 4px; }
.playlist-popup .apply-btn {
  font-family: monospace;
  display: block;
  width: 100%;
  text-align: center;
  font-weight: bold;
  padding: 6px;
  background-color: #e6b114;
  color: black;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  margin-top: 4px;
}
.playlist-popup .apply-btn:hover { background-color: #ffcc00; }
#playlist-gui-log {
  position: fixed;
  bottom: 10px;
  right: 10px;
  background: #000;
  color: #0f0;
  padding: 10px;
  z-index: 9999;
  max-width: 600px;
  font-size: 12px;
  font-family: monospace;
  overflow: hidden;
  max-height: 200px;
  text-align: left;
  white-space: nowrap;
}
#playlist-gui-log div {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 2px;
  text-align: left;
}
.mini-apply { background-color: #e6b114; color: #000; }
.mini-apply:hover { background-color: #ffcc00; }
.plm-close { width: 40px; color: #ca3342; border: 1px solid #600009; }
`);
