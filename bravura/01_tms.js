// ==UserScript==
// @name         bc
// @namespace    bc
// @description  bc
// @version      18
// @author       anon
// @match        http://bravura-crm.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=glasscompanyny.com
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
  'use strict';

  // tms.prefix/serialize/deserialize
  const PREFIX = 'tm_';
  function ensurePrefix(key) {
      if (!key.startsWith(PREFIX)) {
          msg = `Key must start with '${PREFIX}': ${key}`;
          alert(msg);
          throw new Error(msg);
      }
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
      throw new Error(`Unsupported data type: ${type}`);
  }
  // tms.set
  window.tmsSet = function(key, value) {
      key = ensurePrefix(key);
      sessionStorage.setItem(key, serialize(value));
      console.log(`tmsSet: Key '${key}' was set to`, value);
  }
  window.tmsSetMulti = function(data) {
      Object.entries(data).forEach(([key, value]) => { tmsSet(key, value); });
      console.log(`tmsSetMulti: Keys were set`, data);
  }
  // tms.get
  window.tmsGet = function(key, defaultValue) {
      key = ensurePrefix(key);
      const storedValue = sessionStorage.getItem(key);
      if (storedValue === null) {
          return defaultValue;
      }
      const value = deserialize(storedValue);
      console.log(`tmsGet: Retrieved key '${key}' with value`, value);
      return value;
  }
  window.tmsGetMilti = function(keys) {
      const result = {};
      keys.forEach(key => { result[key] = tmsGet(key, null); });
      console.log(`tmsGetMilti: Retrieved data`, result);
      return result;
  }
  window.tmsGetFiltered = function(filter) {
      const keys = tmsGetAll().filter(key => filter.test(key));
      const result = tmsGetMilti(keys);
      console.log(`tmsGetFiltered: Filtered keys`, result);
      return result;
  }
  window.tmsGetAll = function() {
      const keys = Object.keys(sessionStorage).filter(key => key.startsWith(PREFIX));
      console.log(`tmsGetAll: Listed keys`, keys);
      return keys;
  }
  // tms.delete
  window.tmsDelete = function(key) {
      key = ensurePrefix(key);
      sessionStorage.removeItem(key);
      console.log(`tmsDelete: Key '${key}' was deleted`);
  }
  window.tmsDeleteMulti = function(keys) {
      keys.forEach(key => { tmsDelete(key); });
      console.log(`tmsDeleteMulti: Keys were deleted`, keys);
  }
  window.tmsDeleteAll = function() {
      const keys = tmsGetAll();
      keys.forEach(key => sessionStorage.removeItem(key));
      console.log(`tmsDeleteAll: All keys with prefix '${PREFIX}' were deleted`);
  }
  // tms.state
  window.tmsState = function(sate) {
      tmsSet('tm_state', state);
      console.log('tmsState: "'+state+'"');
  }

  // ==== load ============================================
  window.bc_01_tms = true;
  console.log('bc/01_tms: loaded.');
})();
