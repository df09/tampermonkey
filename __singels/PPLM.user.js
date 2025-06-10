// ==UserScript==
// @name         PPLM
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  PLM under each video. Add/del/apply. Dark theme, GUI log, devtools accessible.
// @match        https://www.pornhub.com/*
// ==/UserScript==

(function () {
    'use strict';

    const PLAYLISTS = [
        { id: 'watchlater',display: 'WLater', state: 'unk' },
        { id: 'favorites', display: 'Favorites', state: 'unk' },
        { id: '344049241', display: '00-Regular', state: 'unk' },
        { id: '344050541', display: '03-Fetish', state: 'unk' },
        { id: '344050271', display: '04-BDSM', state: 'unk' },
        { id: '344050081', display: '05-Perversion', state: 'unk' },
        { id: '343004211', display: '06-Wierd', state: 'unk' },
        { id: '344049361', display: '08-EGirls', state: 'unk' },
        { id: '344049991', display: '09-CGIAI', state: 'unk' },
        { id: '343991972', display: '20-1825', state: 'unk' },
        { id: '344050041', display: '29-Milfs', state: 'unk' },
        { id: '344051461', display: '40-BJob', state: 'unk' },
        { id: '344051431', display: '41-Anal', state: 'unk' },
        { id: '344051591', display: '42-TitF', state: 'unk' },
        { id: '344050521', display: '30-F', state: 'unk' },
        { id: '344079601', display: '31-FF', state: 'unk' },
        { id: '344050791', display: '32-mF', state: 'unk' },
        { id: '344050031', display: '33-mFF', state: 'unk' },
        { id: '344050161', display: '34-mmF', state: 'unk' },
        { id: '344079911', display: '35-nBi', state: 'unk' },
        { id: '344080451', display: '35-mlt', state: 'unk' },
    ];

const STYLE = `
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
        color: #dedede;
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
    .playlist-popup { margin-bottom: 4px; color: #aaa; }
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
    .plm-close {width: 40px; color: #ca3342;border: 1px solid #600009; }
    `;


    const styleTag = document.createElement('style');
    styleTag.textContent = STYLE;
    document.head.appendChild(styleTag);

    function consoleLog(msg) {
        console.log(`[PH PLM] ${msg}`);
    }

    function getToken() {
        const input = document.querySelector('#searchInput[data-token]');
        return input ? input.getAttribute('data-token') : '';
    }

    function guiLog(playlistName, title, action) {
        const logBox = document.getElementById('playlist-gui-log') || (() => {
            const box = document.createElement('div');
            box.id = 'playlist-gui-log';
            document.body.appendChild(box);
            return box;
        })();

        const entry = document.createElement('div');
        const shortTitle = title.length > 50 ? title.slice(0, 47) + '...' : title;

        const prefix = document.createElement('span');
        const name = document.createElement('span');
        name.textContent = shortTitle;
        name.style.color = '#ccc';

        if (action === 'apply') {
            prefix.textContent = '[>] ';
            prefix.style.color = '#e6b114';
        } else {
            prefix.textContent = `${action}${playlistName}: `;
            prefix.style.color =
                action === '[+] ' ? '#3fa356' :
                action === '[-] ' ? '#dc3545' : '#999';
        }

        entry.appendChild(prefix);
        entry.appendChild(name);

        while (logBox.children.length >= 10) logBox.removeChild(logBox.firstChild);
        logBox.appendChild(entry);
    }

    function logChange(videoId, title, actionType, playlistId) {
        const playlist = PLAYLISTS.find(p => p.id === playlistId);
        const name = playlist ? playlist.display : playlistId;
        const actionSymbol = actionType === 'add' ? '[+] ' :
                             actionType === 'del' ? '[-] ' : '[?] ';
        guiLog(name, title, actionSymbol);
        consoleLog(`${actionSymbol} ${name}: "${title}"`);
    }

    function addToPlaylist(playlistId, videoId, title) {
        const token = getToken();
        const isFavorites = playlistId === 'favorites';
        const isWatchLater = playlistId === 'watchlater';

        const url = isFavorites
            ? '/video/favourite'
            : isWatchLater
            ? '/api/v1/playlist/video_add_watchlater'
            : '/api/v1/playlist/video';

        const body = isFavorites
            ? `toggle=1&id=${videoId}&token=${encodeURIComponent(token)}`
            : `pid=${playlistId}&vid=${videoId}&token=${encodeURIComponent(token)}`;

        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Requested-With': 'XMLHttpRequest'
        };

        consoleLog(`Add ${videoId} to ${playlistId} via ${url}`);

        fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers,
            body
        })
        .then(res => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            logChange(videoId, title, 'add', playlistId);
        })
        .catch(err => consoleLog(`Add error: ${err.message}`));
    }

function removeFromPlaylist(playlistId, videoId, title) {
    const token = getToken();
    const isFavorites = playlistId === 'favorites';
    const isWatchLater = playlistId === 'watchlater';

    let url;
    if (isFavorites) {
        // favorites всё ещё через POST toggle=0
        url = '/video/favourite';
        const body = `toggle=0&id=${videoId}&token=${encodeURIComponent(token)}`;
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Requested-With': 'XMLHttpRequest'
        };

        fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers,
            body
        })
        .then(res => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            logChange(videoId, title, 'del', playlistId);
        })
        .catch(err => consoleLog(`Remove error: ${err.message}`));

    } else {
        // watchlater и обычные — DELETE с параметрами
        url = isWatchLater
            ? `/api/v1/playlist/video_remove_watchlater?vid=${videoId}&token=${encodeURIComponent(token)}`
            : `/api/v1/playlist/${playlistId}/video_remove/${videoId}?token=${encodeURIComponent(token)}`;

        fetch(url, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(res => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            logChange(videoId, title, 'del', playlistId);
        })
        .catch(err => consoleLog(`Remove error: ${err.message}`));
    }
}




    function applyChanges(videoId, title, states) {
        consoleLog(`Apply changes to ${videoId}`);
        guiLog('', 'apply...', 'apply');
        states.forEach(p => {
            if (p.state === 'add') {
                addToPlaylist(p.id, videoId, title);
            } else if (p.state === 'del') {
                removeFromPlaylist(p.id, videoId, title);
            }
        });
    }

function openPlaylistMenu(buttonEl, container, videoId, title) {
    if (container.querySelector('.playlist-popup')) return;

    const popup = document.createElement('div');
    popup.className = 'playlist-popup';

    const localStates = PLAYLISTS.map(p => ({ ...p }));

    // === Header Row: del4all | Apply | Close (×)
    const headerRow = document.createElement('div');
    headerRow.style.display = 'flex';
    headerRow.style.gap = '6px';
    headerRow.style.marginBottom = '4px';

    const delAllBtn = document.createElement('button');
    delAllBtn.textContent = 'del4all';
    delAllBtn.className = 'plm-btn';
    delAllBtn.onclick = () => {
        localStates.forEach(p => { p.state = 'del'; });
        popup.querySelectorAll('.playlist-item span:last-child').forEach(span => {
            span.textContent = 'del';
            span.className = 'state-del';
        });
    };

    const applyBtnTop = document.createElement('button');
    applyBtnTop.textContent = 'Apply';
    applyBtnTop.className = 'plm-btn mini-apply';
    applyBtnTop.onclick = () => {
        applyChanges(videoId, title, localStates);
        popup.remove();
    };

    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'x';
    closeBtn.className = 'plm-btn plm-close';
    closeBtn.onclick = () => popup.remove();

    headerRow.appendChild(delAllBtn);
    headerRow.appendChild(applyBtnTop);
    headerRow.appendChild(closeBtn);
    popup.appendChild(headerRow);

    // === Quick Access Row: watchlater + favorites
    const quickRow = document.createElement('div');
    quickRow.className = 'plm-quickrow';


    ['watchlater', 'favorites'].forEach(id => {
        const p = localStates.find(x => x.id === id);
        const btn = document.createElement('div');
        btn.className = 'playlist-item';
        const label = document.createElement('span');
        label.textContent = p.display;
        const state = document.createElement('span');
        state.textContent = p.state;
        state.className = `state-${p.state}`;
        btn.appendChild(label);
        btn.appendChild(state);
        btn.onclick = () => {
            p.state = (p.state === 'unk') ? 'add' : (p.state === 'add') ? 'del' : 'add';
            state.textContent = p.state;
            state.className = `state-${p.state}`;
            consoleLog(`${p.display} → ${p.state}`);
        };
        quickRow.appendChild(btn);
    });

    popup.appendChild(quickRow);

    // === Grouped Columns (col1 / col2)
    const groups = {
        col1: {
            'Main': ['344049241','344050541','344050271','344050081','343004211','344049361','344049991'],
            'Ages': ['343991972','344050041']
        },
        col2: {
            'Formats': ['344050521','344079601','344050791','344050031','344050161','344079911','344080451'],
            'Acts': ['344051461','344051431','344051591']
        }
    };

    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.marginTop = '4px';

    const makeColumn = (colGroup) => {
        const col = document.createElement('div');
        col.style.flex = '1';

        Object.entries(colGroup).forEach(([groupName, idList]) => {
            const groupBox = document.createElement('div');
            groupBox.className = 'group-box';

            idList.forEach(id => {
                const p = localStates.find(x => x.id === id);
                if (!p) return;

                const item = document.createElement('div');
                item.className = 'playlist-item';
                const label = document.createElement('span');
                label.textContent = p.display;
                const state = document.createElement('span');
                state.textContent = p.state;
                state.className = `state-${p.state}`;
                item.appendChild(label);
                item.appendChild(state);

                item.onclick = () => {
                    p.state = (p.state === 'unk') ? 'add' : (p.state === 'add') ? 'del' : 'add';
                    state.textContent = p.state;
                    state.className = `state-${p.state}`;
                    consoleLog(`${p.display} → ${p.state}`);
                };

                groupBox.appendChild(item);
            });

            col.appendChild(groupBox);
        });

        return col;
    };

    row.appendChild(makeColumn(groups.col1));
    row.appendChild(makeColumn(groups.col2));
    popup.appendChild(row);

    // === Bottom Apply
    const applyBtnBottom = document.createElement('button');
    applyBtnBottom.className = 'apply-btn';
    applyBtnBottom.innerText = 'Apply';
    applyBtnBottom.onclick = () => {
        applyChanges(videoId, title, localStates);
        popup.remove();
    };
    popup.appendChild(applyBtnBottom);

    buttonEl.insertAdjacentElement('afterend', popup);
}


function insertButtons() {
    consoleLog('Inserting buttons...');

    // === 1. Кнопки под превьюшками видео (на главной, поиске и т.д.)
    const blocks = document.querySelectorAll('[data-video-id]');
    blocks.forEach(el => {
        const videoId = el.getAttribute('data-video-id');
        let title = 'Untitled';
        const titleA = el.querySelector('.thumbnail-info-wrapper .title a');
        if (titleA) {
            title = titleA.textContent.trim() || titleA.getAttribute('title')?.trim() || title;
        }

        const infoWrapper = el.querySelector('.thumbnail-info-wrapper');
        if (!infoWrapper || el.querySelector('.custom-playlist-btn')) return;

        const btn = document.createElement('button');
        btn.textContent = '> PLM';
        btn.className = 'plm-btn-main custom-playlist-btn';
        btn.onclick = (e) => {
            e.stopPropagation();
            openPlaylistMenu(btn, el, videoId, title);
        };

        infoWrapper.parentNode.insertBefore(btn, infoWrapper);
    });

    // === 2. Кнопка на странице видео (в player секции рядом с h1.title)
    const videoWrapper = document.querySelector('.video-wrapper.modelInfo');

    if (videoWrapper && !videoWrapper.querySelector('.title-container .title .custom-playlist-btn')) {
        const videoId = videoWrapper.querySelector('#player')?.getAttribute('data-video-id');
        const h1 = videoWrapper.querySelector('.title-container .title');
        const titleSpan = h1?.querySelector('span');
        const title = titleSpan?.textContent.trim() || 'Untitled';
        if (videoId && h1) {
            const btn = document.createElement('button');
            btn.textContent = '> PLM';
            btn.className = 'plm-btn custom-playlist-btn';
            btn.onclick = (e) => {
                e.stopPropagation();
                openPlaylistMenu(btn, videoWrapper, videoId, title);
            };

            h1.appendChild(btn);
            consoleLog(`Button inserted (player): ${videoId}`);
        }
    }

}

 // === Init ===
function observeAndInsert() {
    insertButtons(); // начальная вставка
    const observer = new MutationObserver(() => {
        insertButtons(); // повторная вставка при любом DOM изменении
    });
    observer.observe(document.body, { childList: true, subtree: true });
}
observeAndInsert();

})();
