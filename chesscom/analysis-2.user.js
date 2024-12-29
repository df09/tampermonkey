// ==UserScript==
// @name         Analysis - Custom Style
// @namespace    Custom styles for analysis
// @description  Custom styles for analysis
// @version      11
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lichess.org
// @match        https://lichess.org/analysis
// ==/UserScript==

(function() {
    'use strict';
    // Create a style element
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
      #main-wrap {
        padding: 1rem;
        margin: 0;
        grid-template-areas: "main";
        grid-template-columns: minmax(auto, var(---main-max-width));
      }
      .analyse {
        grid-template-columns: minmax(250px, 350px) var(---block-gap) var(---col3-uniboard-width) var(---block-gap);
      }
      .analyse__tools {
        min-height: 800px;
      }
      .explorer-box {
        flex: 8 1 0px;
      }
    `;
    style.id = 'customSidebarStyle';

    // Function to toggle styles
    function toggleStyles() {
        var existingStyle = document.getElementById('customSidebarStyle');
        if (existingStyle) {
            existingStyle.remove();
        } else {
            document.head.appendChild(style);
        }
    }

    // Create a button to toggle the styles
    var button = document.createElement('button');
    button.textContent = 'Toggle Sidebar Style';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '10px';
    button.style.zIndex = 1000;
    button.onclick = toggleStyles;

    // Append the button to the body
    document.body.appendChild(button);
})();
