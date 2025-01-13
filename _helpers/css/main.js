injectCSS(`
// ======================== menu ===================================
// general
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
}
.tm-title {
  margin: 0;
  font-size: 1.2rem;
  font-weight: bold;
  color: #444;
}
.tm-btn-b, .tm-btn-g, .tm-btn-y, .tm-btn-r {
  padding: 8px 12px;
  font-size: 0.9rem;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.tm-b { color: #007bff; } .tm-g { color: #28a745; }
.tm-y { color: #ffc107; } .tm-r { color: #dc3545; }
.tm-btn-b { background-color: #007bff; color: #fff; }
.tm-btn-g { background-color: #28a745; color: #fff; }
.tm-btn-y { background-color: #ffc107; color: #fff; }
.tm-btn-r { background-color: #dc3545; color: #fff; }
.tm-btn-b:hover { background-color: #0056b3; }
.tm-btn-g:hover { background-color: #1e7e34; }
.tm-btn-y:hover { background-color: #e0a800; }
.tm-btn-r:hover { background-color: #c82333; }
// ids
#tm-container {
  z-index: 10000;
  display: block; position: fixed; bottom: 10px; right: 10px;
  font-family: monospace; font-size: 1rem;
  width: 500px;
  margin: 5px; padding: 5px;
  background-color: white;
  border: 1px solid #ccc; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}
#tm-textarea {
  resize: none;
  width: 100%; height: 150px;
  margin-bottom: 10px; padding: 8px;
  border: 1px solid #ccc; border-radius: 4px;
}
#tm-abort { display: none; }
#tm-minimize { display: none; }
#tm-main { display: none; }
#tm-prep { display: none; }
#tm-execution { display: none; }
#tm-execution-continue { display: none; }

// ======================== modals ===================================
.modal {
  display: none;
  z-index: 10001;
  position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); overflow-y: auto;
  width: 80%; max-height: 80%; padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  color: white; background-color: #1e1e1e;
}
.modal table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}
.modal th, .modal td {
  padding: 10px;
  border-bottom: 1px solid #444;
  text-align: left;
}
`)
