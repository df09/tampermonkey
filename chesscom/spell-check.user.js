// ==UserScript==
// @name         Disable Spellcheck on Chess.com
// @namespace    http://tampermonkey.net/
// @description  Disable spellcheck on chess.com analysis page
// @version      17
// @author       You
// @match        https://www.chess.com/analysis?tab=analysis
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chess.com
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// ==/UserScript==

(function() {
    // init
    'use strict';
    function addJQuery(callback) {
        var script = document.createElement('script');
        script.setAttribute('src', 'https://code.jquery.com/jquery-3.6.0.min.js');
        script.addEventListener('load', function() {
            var script = document.createElement('script');
            script.textContent = 'window.jQuery && (' + callback.toString() + ')();';
            document.body.appendChild(script);
        });
        document.body.appendChild(script);
    }
    // -----------------------------------

    // Main function to disable spellcheck
    function main() {
        function disableSpellcheck() {
            $('#analysis-hml-scroll-container .comment').each(function() {
                $(this).attr('spellcheck', false);
            });
            $('#analysis-hml-scroll-container .comment-row').each(function() {
                $(this).attr('spellcheck', false);
            });
        }

        // Run the function to disable spellcheck initially
        disableSpellcheck();

        // Observe the DOM for changes and disable spellcheck on new elements with class comment within the specified container
        const observer = new MutationObserver((mutationsList) => {
            setTimeout(() => {
                for (const mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType === 1) { // Check if it's an element node
                                if ($(node).hasClass('comment')) {
                                    $(node).attr('spellcheck', false);
                                }
                                $(node).find('.comment').each(function() {
                                    $(this).attr('spellcheck', false);
                                });
                            }
                        });
                    }
                }
            }, 0); // Delay execution to ensure all events have been processed
        });

        observer.observe(document.getElementById('analysis-hml-scroll-container'), { childList: true, subtree: true });
    }

    // Load jQuery and run the main function
    addJQuery(main);
})();
