function normalizeText(text) {
    if (!text) return "";
    return text
        .replace(/[^a-zA-Zа-яА-Я0-9]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

async function expandDescription() {
    console.log("Нажатие кнопки '...more' в описании видео...");
    const descriptionButton = document.querySelector('tp-yt-paper-button#expand[aria-expanded="false"]');
    if (descriptionButton) descriptionButton.click();
}

async function expandButtons() {
    console.log("Нажатие кнопок 'Read more' и '...more'...");

    const readMoreButtons = document.querySelectorAll('tp-yt-paper-button#more[aria-expanded="false"]');
    readMoreButtons.forEach(button => button.click());

    const moreButtons = document.querySelectorAll('tp-yt-paper-button#expand-sizer');
    moreButtons.forEach(button => button.click());
}

async function loadComments(limit = 500) {
    console.log("Запуск загрузки комментариев...");
    const commentsSection = document.querySelector('#comments');
    if (!commentsSection) {
        console.error("Комментарии не найдены.");
        return;
    }

    let loadedComments = 0;
    let lastScrollHeight = 0;
    while (loadedComments < limit) {
        commentsSection.scrollIntoView({ behavior: 'smooth', block: 'end' });
        console.log(`Прогресс: ${loadedComments} комментариев загружено...`);
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const comments = [...document.querySelectorAll('#content-text')];
        loadedComments = comments.length;

        if (document.documentElement.scrollHeight === lastScrollHeight) {
            break;
        }

        lastScrollHeight = document.documentElement.scrollHeight;
    }

    console.log(`Загрузка комментариев завершена. Всего загружено: ${loadedComments}`);
}

function expandMatch(match, text) {
    const normalizedText = normalizeText(text);
    const normalizedMatch = normalizeText(match);
    const matchIndex = normalizedText.indexOf(normalizedMatch);
    if (matchIndex === -1) return "";

    const startIndex = normalizedText.lastIndexOf(" ", matchIndex - 1) + 1;
    const endIndex = normalizedText.indexOf(" ", matchIndex + normalizedMatch.length);

    return normalizedText.substring(startIndex, endIndex > -1 ? endIndex : undefined).trim();
}

function findMatches() {
    console.log("Поиск совпадений...");
    function processText(sourceText, sourceType) {
        const normalizedText = normalizeText(sourceText);
        console.log(`search:`);
        console.log(`...${sourceType}:${sourceText} (${normalizedText})`);
        keywords.forEach(keyword => {
            const normalizedKeyword = normalizeText(keyword);
            const isCaseInsensitive = keyword === keyword.toLowerCase();
            const matchCondition = isCaseInsensitive
                ? normalizedText.toLowerCase().includes(normalizedKeyword.toLowerCase())
                : normalizedText.includes(normalizedKeyword);
            if (matchCondition) {
                console.log(`...... [+] ${keyword}(${normalizedKeyword})`);
                matches.push({
                    keyword,
                    phrase: expandMatch(keyword, sourceText),
                    fullText: sourceText
                });
            }
        });
    }
    // Описание видео
    const descriptionElement = document.querySelector('#description');
    const descriptionText = descriptionElement ? descriptionElement.innerText : "";
    if (descriptionText) {
        processText(descriptionText, "description");
    }
    // Комментарии
    const comments = document.querySelectorAll('#content-text');
    comments.forEach(commentElement => {
        const commentText = commentElement.innerText;
        processText(commentText, "comments");
    });
    console.log(`\ntotal matches: ${matches.length}`);
}

function saveToLocalStorage() {
    const filteredMatches = matches.filter(entry => entry.phrase && entry.fullText);
    if (filteredMatches.length === 0) {
        console.log("Нет совпадений для сохранения.");
        return;
    }

    const previousMatches = JSON.parse(localStorage.getItem('youtube_chess_matches')) || [];
    const updatedMatches = [...previousMatches, ...filteredMatches];
    localStorage.setItem('youtube_chess_matches', JSON.stringify(updatedMatches));
    console.log("Сохранение завершено.");
}

function showModal() {
    const filteredMatches = matches.filter(entry => entry.phrase && entry.fullText);
    if (filteredMatches.length === 0) {
        console.log("Нет данных для отображения.");
        return;
    }

    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.backgroundColor = '#1e1e1e';
    modal.style.color = 'white';
    modal.style.padding = '20px';
    modal.style.borderRadius = '10px';
    modal.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    modal.style.zIndex = '10000';
    modal.style.width = '80%';
    modal.style.maxHeight = '80%';
    modal.style.overflowY = 'auto';

    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.fontFamily = 'monospace';

    const headerRow = document.createElement('tr');
    const headers = ['Keyword', 'Normalized phrase', 'Text'];
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        th.style.padding = '10px';
        th.style.borderBottom = '1px solid #444';
        th.style.textAlign = 'left';
        table.appendChild(th);
    });
    table.appendChild(headerRow);

    filteredMatches.forEach(entry => {
        const row = document.createElement('tr');
        row.style.borderBottom = '1px solid #444';

        const cellKeyword = document.createElement('td');
        cellKeyword.textContent = entry.keyword;
        cellKeyword.style.padding = '8px';
        row.appendChild(cellKeyword);

        const cellPhrase = document.createElement('td');
        cellPhrase.textContent = entry.phrase;
        cellPhrase.style.padding = '8px';
        row.appendChild(cellPhrase);

        const cellFullText = document.createElement('td');
        cellFullText.textContent = entry.fullText;
        cellFullText.style.padding = '8px';
        row.appendChild(cellFullText);

        table.appendChild(row);
    });

    modal.appendChild(table);

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Закрыть';
    closeButton.style.marginTop = '20px';
    closeButton.style.padding = '10px';
    closeButton.style.backgroundColor = '#4CAF50';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '5px';
    closeButton.style.cursor = 'pointer';
    closeButton.addEventListener('click', () => {
        modal.remove();
    });

    modal.appendChild(closeButton);
    document.body.appendChild(modal);
}

async function main() {
    console.log("main...");
    await expandDescription();
    await loadComments(500);
    await expandButtons();
    findMatches();
    saveToLocalStorage();
    showModal();
    console.log("main: done.");
}

function addButtons() {
    const buttonContainer = document.createElement('div');
    buttonContainer.style.position = 'fixed';
    buttonContainer.style.bottom = '10px';
    buttonContainer.style.left = '10px';
    buttonContainer.style.zIndex = '9999';

    const runButton = document.createElement('button');
    runButton.textContent = 'Run Script';
    runButton.style.margin = '5px';
    runButton.style.padding = '10px';
    runButton.style.backgroundColor = '#2196F3';
    runButton.style.color = 'white';
    runButton.style.border = 'none';
    runButton.style.borderRadius = '5px';
    runButton.style.cursor = 'pointer';
    runButton.addEventListener('click', main);

    const viewButton = document.createElement('button');
    viewButton.textContent = 'View Saved Data';
    viewButton.style.margin = '5px';
    viewButton.style.padding = '10px';
    viewButton.style.backgroundColor = '#4CAF50';
    viewButton.style.color = 'white';
    viewButton.style.border = 'none';
    viewButton.style.borderRadius = '5px';
    viewButton.style.cursor = 'pointer';
    viewButton.addEventListener('click', showModal);

    buttonContainer.appendChild(runButton);
    buttonContainer.appendChild(viewButton);
    document.body.appendChild(buttonContainer);
}
function parseCommentsDo() {
    const keywords = [
        "1.e4,c5",
        "pgn",
        "FEN",
        "SAN",
        "LAN",
        "notation",
        "moves",
        "analys",
        "analysis",
        "00 stuck playin"
    ];
    let matches = [];

    console.log("loded.");
    addButtons();
}

function parseComments() {
    const keywords = [
        "1.e4,c5",
        "pgn",
        "FEN",
        "SAN",
        "LAN",
        "notation",
        "moves",
        "analys",
        "analysis",
        "00 stuck playin"
    ];
    addButtons();
}
