// abort
class AbortExecution extends Error{constructor(m){super(m);this.name="AbortExecution"}}
function abort(...args) {
  const pfx = 'abort: ';
  console.log(pfx+'init..');
  tmsDeleteAll();
  // Formulate message
  const joinedArgs=args.map(
    arg=>typeof arg==='object'?JSON.stringify(arg,null,2):String(arg)
  ).join('\n');
  const sfx = joinedArgs?joinedArgs:'done.';
  console.log(pfx+sfx);
  alert(pfx+sfx)
  throw new AbortExecution(joinedArgs);
}
// prefix/serialize/deserialize
const PREFIX = 'tm_';
function ensurePrefix(key) {
  if (!key.startsWith(PREFIX)){abort('Key must start with '+PREFIX+': '+key)}
  return key;
}
function serialize(value){return JSON.stringify({type:typeof value, value})}
function deserialize(serialized) {
  const {type, value} = JSON.parse(serialized);
  if (type === 'number') return Number(value);
  if (type === 'boolean') return Boolean(value);
  if (type === 'object') return value;
  if (type === 'string') return String(value);
  if (type === 'undefined') return undefined;
  abort('Unsupported data type: '+type);
}
// set
function tmsSet(key, value) {
  key = ensurePrefix(key);
  localStorage.setItem(key, serialize(value));
  console.log('tmsSet:', key, value);
}
function tmsSetMulti(data) {
  Object.entries(data).forEach(([key, value]) => { tmsSet(key, value); });
  console.log('tmsSetMulti:', data);
}
// get
function tmsGet(key, defaultValue) {
  key = ensurePrefix(key);
  const storedValue = localStorage.getItem(key);
  if (storedValue === null) { return defaultValue; }
  const value = deserialize(storedValue);
  console.log('tmsGet:', key, value);
  return value;
}
function tmsGetMulti(keys) {
  const result = {};
  keys.forEach(key => { result[key] = tmsGet(key, null); });
  console.log('tmsGetMulti:', result);
  return result;
}
function tmsGetFiltered(filter) {
  const keys = tmsGetAll().filter(key => filter.test(key));
  const result = tmsGetMulti(keys);
  console.log('tmsGetFiltered:', result);
  return result;
}
function tmsGetAll() {
  const keys = Object.keys(localStorage).filter(key => key.startsWith(PREFIX));
  console.log('tmsGetAll:', keys);
  return keys;
}
// delete
function tmsDelete(key) {
  key = ensurePrefix(key);
  localStorage.removeItem(key);
  console.log('tmsDelete: Key '+key+' was deleted');
}
function tmsDeleteMulti(keys) {
  keys.forEach(key => { tmsDelete(key); });
  console.log('tmsDeleteMulti: Keys were deleted', keys);
}
function tmsDeleteAll() {
  const keys = tmsGetAll();
  keys.forEach(key => localStorage.removeItem(key));
  console.log('tmsDeleteAll: All keys with prefix '+PREFIX+' were deleted');
}
function tmsReset() {
  const keys = tmsGetAll();
  keys.forEach(key=>{if(!key.startsWith('tm_keep_')){tmsDelete(key);}});
  console.log('tmsReset: done.');
};
// operations
function tmsSetOperation(operation) {
    const operationFormat = /^[a-zA-Z0-9]+\/[a-zA-Z0-9]+$/;
    if (!operationFormat.test(operation)) {abort('Invalid operation ('+operation+'). must be "<action>/<step>" in camelCase.')}
    const [action, step] = operation.split('/');
    tmsSet('tm_operation', operation); tmsSet('tm_action', action); tmsSet('tm_step', step);
    console.log('tmsSetOperation:', operation);
};
function tmsGetOperation() { return tmsGet('tm_operation'); };
function tmsGetAction() { return tmsGet('tm_action'); };
function tmsGetStep() { return tmsGet('tm_step'); };
function tmsOperationsGetHandlers(config) {
  const fullHandlers = {};
  for (const [action, steps] of Object.entries(config)) {
    fullHandlers[action] = {};
    for (const step of steps) {
      const handlerName = camelCase(action + '_' + step);
      if (typeof window[handlerName] !== 'function') {
        abort('tmsOperationsGetHandlers: Handler function "'+handlerName+'" not found.');
      }
      fullHandlers[action][step] = window[handlerName];
    }
  }
  return fullHandlers;
}
function tmsOperationsHandle(config) {
  const operation = tmsGetOperation();
  if (!operation){console.log('tmsOperationsHandle: no active operations.');return}
  const handlers = tmsOperationsGetHandlers(config);
  const action = tmsGetAction();
  if (!handlers[action]){abort(operation+': unknown action "'+action+'"')}
  const actionHandlers = handlers[action];
  const step = tmsGetStep();
  if (!actionHandlers[step]){abort(operation+': unknown step "'+step+'"')}
  actionHandlers[step]();
}
