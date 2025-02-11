// prefix/serialize/deserialize
const PREFIX = 'tm_';
function ensurePrefix(key) {
  if (!key.startsWith(PREFIX)){throw new Error('Key must start with '+PREFIX+': '+key)}
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
  throw new Error('Unsupported data type: '+type);
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
    if (!operationFormat.test(operation)) {throw new Error('Invalid operation ('+operation+'). must be "<action>/<step>" in camelCase.')}
    tmsSet('tm_operation', operation);
    console.log('tmsSetOperation:', operation);
};
function tmsGetOperation() {
  const operation = tmsGet('tm_operation', '');
  if (typeof operation !== 'string' || operation.trim() === '' || !operation.includes('/')) {
    return false;
  }
  return operation;
}
function tmsGetAction() {const op = tmsGetOperation(); return op ? op.split('/')[0] : false}
function tmsGetStep() {const op = tmsGetOperation(); return op ? op.split('/')[1] : false}
function tmsOperationsGetHandlers(config) {
  const fullHandlers = {};
  for (const [action, steps] of Object.entries(config)) {
    fullHandlers[action] = {};
    for (const step of steps) {
      const handlerName = camelCase(action + '/' + step);
      console.log('handlerName:', handlerName)
      if (typeof window[handlerName] !== 'function') {
        throw new Error('tmsOperationsGetHandlers: Handler function "'+handlerName+'" not found.');
      }
      fullHandlers[action][step] = window[handlerName];
    }
  }
  return fullHandlers;
}
function handleOperations(config) {
  const operation = tmsGetOperation();
  if (!operation) {
    console.log('handleOperations: no active operations.');
    return;
  }
  const handlers = tmsOperationsGetHandlers(config);
  const action = tmsGetAction();
  const step = tmsGetStep();
  if (!handlers[action]) { throw new Error(operation + ': unknown action "' + action + '"'); }
  if (!handlers[action][step]) { throw new Error(operation + ': unknown step "' + step + '"'); }
  handlers[action][step](); // вызов соответствующего обработчика
}
