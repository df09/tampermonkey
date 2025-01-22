// prefix/serialize/deserialize
const PREFIX = 'tm_';
function ensurePrefix(key) {
  if (!key.startsWith(PREFIX)) { tmUiAbort(`Key must start with '${PREFIX}': ${key}`); }
  return key;
}
function serialize(value) {
  return JSON.stringify({ type: typeof value, value });
}
function deserialize(serialized) {
  const { type, value } = JSON.parse(serialized);
  if (type === 'number') return Number(value);
  if (type === 'boolean') return Boolean(value);
  if (type === 'object') return value;
  if (type === 'string') return String(value);
  if (type === 'undefined') return undefined;
  tmUiAbort(`Unsupported data type: ${type}`);
}
// set
function tmsSet(key, value) {
  key = ensurePrefix(key);
  localStorage.setItem(key, serialize(value));
  console.log(`tmsSet: Key '${key}' was set to`, value);
}
function tmsSetMulti(data) {
  Object.entries(data).forEach(([key, value]) => { tmsSet(key, value); });
  console.log(`tmsSetMulti: Keys were set`, data);
}
// get
function tmsGet(key, defaultValue) {
  key = ensurePrefix(key);
  const storedValue = localStorage.getItem(key);
  if (storedValue === null) { return defaultValue; }
  const value = deserialize(storedValue);
  console.log(`tmsGet: Retrieved key '${key}' with value`, value);
  return value;
}
function tmsGetMilti(keys) {
  const result = {};
  keys.forEach(key => { result[key] = tmsGet(key, null); });
  console.log(`tmsGetMilti: Retrieved data`, result);
  return result;
}
function tmsGetFiltered(filter) {
  const keys = tmsGetAll().filter(key => filter.test(key));
  const result = tmsGetMilti(keys);
  console.log(`tmsGetFiltered: Filtered keys`, result);
  return result;
}
function tmsGetAll() {
  const keys = Object.keys(localStorage).filter(key => key.startsWith(PREFIX));
  console.log(`tmsGetAll: Listed keys`, keys);
  return keys;
}
// delete
function tmsDelete(key) {
  key = ensurePrefix(key);
  localStorage.removeItem(key);
  console.log(`tmsDelete: Key '${key}' was deleted`);
}
function tmsDeleteMulti(keys) {
  keys.forEach(key => { tmsDelete(key); });
  console.log(`tmsDeleteMulti: Keys were deleted`, keys);
}
function tmsDeleteAll() {
  const keys = tmsGetAll();
  keys.forEach(key => localStorage.removeItem(key));
  console.log(`tmsDeleteAll: All keys with prefix '${PREFIX}' were deleted`);
}
function tmsReset() {
  const keys = tmsGetAll();
  keys.forEach(key=>{if(!key.startsWith('tm_keep_')){tmsDelete(key);}});
  console.log('tmsReset: done');
};
// operations
function tmsSetOperation(operation) {
    const operationFormat = /^[a-zA-Z0-9]+\/[a-zA-Z0-9]+$/;
    if (!operationFormat.test(operation)) {tmUiAbort('Invalid operation ('+operation+'). must be "<action>/<step>" in camelCase.')}
    const [action, step] = operation.split('/');
    tmsSet('tm_operation', operation); tmsSet('tm_action', action); tmsSet('tm_step', step);
    console.log('tmsSetOperation: "'+operation+'".');
};
function tmsGetOperation() { return tmsGet('tm_operation'); };
function tmsGetAction() { return tmsGet('tm_action'); };
function tmsGetStep() { return tmsGet('tm_step'); };
function camelCase(input){return input.split('_').map((w, i)=>i===0?w:w.charAt(0).toUpperCase()+w.slice(1)).join('');}
function tmsOperationsGetHandlers(config) {
  const fullHandlers = {};
  for (const [action, steps] of Object.entries(config)) {
    fullHandlers[action] = {};
    for (const step of steps) {
      const handlerName = camelCase(action + '_' + step);
      if (typeof window[handlerName] === 'function') {
        fullHandlers[action][step] = window[handlerName];
      } else {
        tmUiAbort(`Handler function "${handlerName}" not found`);
      }
    }
  }
  return fullHandlers;
}
function tmsOperationsHandle(config) {
  const operation = tmsGetOperation();
  if (!operation) {
    console.log('tmsOperationsHandle: no active operations.')
    return
  }
  const action = tmsGetAction();
  const step = tmsGetStep();
  const handlers = tmsOperationsGetHandlers(config);
  if (handlers[action]) {
    const actionHandlers = handlers[action];
    if (actionHandlers[step]) {
      actionHandlers[step]();
    } else {
      tmUiAbort(operation+': unknown step "'+step+'"');
    }
  } else {
    tmUiAbort(operation+': unknown action "'+action+'"');
  }
}
function tmStart(actionName) {
  tmsSetOperation(actionName+'/start');
  tmUiShowExec();
}
