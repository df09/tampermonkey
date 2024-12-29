// ==UserScript==
// @name         mini-view
// @namespace    http://tampermonkey.net/
// @description  try to take over the world!
// @version      29
// @author       You
// @match        https://lichess.org/opening/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lichess.org
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const style = document.createElement('style');
    style.innerHTML = `
#main-wrap {
  padding: 0 !important;
  margin: 0 !important;
}
.page.box.box-pad.opening {
  padding: 2rem !important;
}
.opening__title {
  margin-bottom: 2rem !important;
}
.opening__intro {
  margin-bottom: 0 !important;
}
.opening__nexts {
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)) !important;
}
    `;
    document.head.appendChild(style);
})();
