// ==UserScript==
// @name         Analysis - Custom Style
// @namespace    Analysis - Custom Style
// @description  Custom styles for analysis
// @version      32
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chess.com
// @match        https://www.chess.com/analysis*
// @match        https://www.chess.com/a/*
// @exclude      https://www.chess.com/analysis/*
// ==/UserScript==

(function() {
    'use strict';

    // Create a style element
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
        @media (min-width: 960px) {
          body {
            overflow-x: hidden;
            grid-template-columns:
              [left-gutter] 10px
              [extra-left] var(--extraColumnLeftOfBoard, 0)
              [board-layout] min-content
              [sidebar] minmax(var(--sidebarMinWidth), var(--sidebarMaxWidth))
              [ad] var(--adWidth)
              [right-gutter] 10px !important;
          }
        }
        .board-layout-sidebar {
          width: 1250px !important;
          padding-right: 2rem !important;
        }

        .sidebar-view-header {
          min-height: 4rem !important;
          justify-content: start !important;
        }
        .board-tab-item-component {
          height: 4rem !important;
          padding: .7rem 15px !important;
          flex: initial !important;
          flex-direction: row !important;
        }
        .board-tab-item-label {
          width: auto !important;
        }
        .analysis-options-toggles {
          flex: initial !important;
          margin-right: 0 !important;
        }
        .analysis-options-bar {
          justify-content: start !important;
        }

        .analysis-view-scrollable {
          padding-bottom: 0 !important;
        }
        .analysis-view-buttons {
          justify-content: flex-start;
        }
        .analysis-view-button {
          margin: 0.5rem 0 0 1rem !important;
          width: 120px !important;
          min-height: 30px !important;
          padding: 0 !important;
        }
        .analysis-saved-game-link-component {
          margin: 0.5rem 1rem !important;
          text-align: left !important;
        }

        .game-controls-view-component {
          display: flex !important;
        }
        .game-controls-primary-component {
          padding: 0 1rem 0 0 !important;
        }
        .game-controls-secondary-component {
          justify-content: flex-start !important;
        }
        .game-controls-secondary-component > :first-child {
          padding-right: 1rem !important;
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
