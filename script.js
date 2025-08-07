const $modal = $('#modal');
const $modalWordDisplay = $('#modalWordDisplay');
const $bottomLine = $('.modal-bottom-line');
const $modalControls = $('#modalControls');
const $playPauseIcon = $('#playPauseIcon');
const $textInput = $('#textInput');
const $wpmInput = $('#wpmInput');
const $bgColorPicker = $('#bgColorPicker');
const $textColorPicker = $('#textColorPicker');
const $fontSizeSelect = $('#fontSizeSelect');
const $errorPopup = $('#errorPopup');
const $errorText = $('#errorText');
const $selectStartContainer = $('#selectStartContainer');
const $globalLoader = $('#globalLoader');
const $editTextBtn = $('#editTextBtn');
const $confirmModal = $('#confirmModal');
const $confirmYesBtn = $('#confirmYesBtn');
const $confirmCancelBtn = $('#confirmCancelBtn');

let words = [];
let index = 0;
let intervalId = null;
let isPaused = true;
let delay = 60000 / 150;
let isModalActive = false;
let controlsVisible = false;
let selectedStartIndex = 0;

function autoResizeTextarea($el) {
    $el.css('height', 'auto');
    $el.css('height', $el[0].scrollHeight + 'px');
}

$textInput.on('input', function () {
    autoResizeTextarea($(this));
    selectedStartIndex = 0;
    let saved = JSON.parse(localStorage.getItem('savedTexts')) || [];
    let item = saved.find(item => item.text === $(this).val().trim());
    if (item) {
        item.lastReadIndex = 0;
        item.lastReadAt = null;
        localStorage.setItem('savedTexts', JSON.stringify(saved));
    }
    $editTextBtn.addClass('hidden');
});

function startModalReading(text) {
    const wpm = parseInt($wpmInput.val());
    if (isNaN(wpm) || wpm < 50) {
        showErrorPopup('Please enter a valid WPM value (min 50).');
        return;
    }

    delay = 60000 / wpm;
    words = text.split(/\s+/);
    index = getLastReadIndex(text) || selectedStartIndex;
    isPaused = true;
    isModalActive = true;

    $modal.removeClass('hidden');
    $bottomLine.removeClass('hidden').addClass('visible');
    $modalControls.removeClass('hidden');
    showControls();

    $modalWordDisplay.text(words[index] || "");
    $playPauseIcon.attr('class', 'fas fa-play');
    $selectStartContainer.hide();
    $textInput.hide();
    $editTextBtn.addClass('hidden');

    saveTextToLocalStorage(text, index);
}

$('#startBtn').on('click', () => {
    const text = $textInput.val().trim();
    if (!text) {
        showErrorPopup();
        return;
    }

    saveTextToLocalStorage(text);

    if ($textInput.is(':visible')) {
        prepareWordSelection();
    } else {
        startModalReading(text);
    }
});

$('#editTextBtn').on('click', () => {
    $confirmModal.removeClass('hidden');
});

$confirmYesBtn.on('click', () => {
    $selectStartContainer.hide();
    $textInput.show();
    autoResizeTextarea($textInput);
    selectedStartIndex = 0;
    updateLastReadIndex($textInput.val(), 0);
    $editTextBtn.addClass('hidden');
    $confirmModal.addClass('hidden');
});

$confirmCancelBtn.on('click', () => {
    $confirmModal.addClass('hidden');
});

function saveLastReadIndex(text, index) {
    let saved = JSON.parse(localStorage.getItem('savedTexts')) || [];
    let item = saved.find(item => item.text === text);
    if (item) {
        item.lastReadIndex = index;
        item.lastReadAt = new Date().toISOString();
        localStorage.setItem('savedTexts', JSON.stringify(saved));
    }
}

function getLastReadIndex(text) {
    const saved = JSON.parse(localStorage.getItem('savedTexts')) || [];
    const item = saved.find(item => item.text === text);
    return item ? item.lastReadIndex || 0 : 0;
}

function startReading() {
    clearInterval(intervalId);
    intervalId = setInterval(() => {
        if (!isPaused && index < words.length) {
            $modalWordDisplay.text(words[index]);
            saveLastReadIndex($textInput.val(), index);
            index++;
        } else if (index >= words.length) {
            clearInterval(intervalId);
            isPaused = true;
            $playPauseIcon.attr('class', 'fas fa-play');
        }
    }, delay);
}

function showControls() {
    if (!controlsVisible && isModalActive) {
        controlsVisible = true;
        $modalControls.removeClass('hidden').addClass('visible');
        $bottomLine.addClass('fadeout');
        animateButtonsIn();
    }
}

function hideControls() {
    if (controlsVisible) {
        controlsVisible = false;
        $modalControls.removeClass('visible').addClass('hidden');
        $bottomLine.removeClass('fadeout');
        animateButtonsOut();
    }
}

function resetButtonAnimations() {
    $modalControls.children().each(function () {
        $(this).css({
            animation: 'none',
            opacity: 0,
            transform: 'translateY(20px)'
        });
        this.offsetWidth;
        $(this).css('animation', null);
    });
}

function animateButtonsIn() {
    resetButtonAnimations();
    $modalControls.children().each(function (i) {
        $(this).css({
            animation: `fadeSlideUp 0.4s forwards`,
            'animation-delay': `${0.1 + i * 0.1}s`
        });
    });
}

function animateButtonsOut() {
    $modalControls.children().each(function () {
        $(this).css({
            animation: `fadeSlideDown 0.3s forwards`,
            'animation-delay': '0s'
        });
    });
}

function checkMouseNearBottomLine(e) {
    if (!isModalActive) return;
    const rect = $bottomLine[0].getBoundingClientRect();
    if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top - 10 &&
        e.clientY <= rect.bottom + 55
    ) {
        showControls();
    }
}

$(window).on('mousemove', checkMouseNearBottomLine);
$bottomLine.on('mouseenter', () => isModalActive && showControls());
$modalControls.on('mouseenter', () => isModalActive && showControls());

$('#toggleBtn').on('click', () => {
    if (!isModalActive) return;
    isPaused = !isPaused;
    $playPauseIcon.attr('class', isPaused ? 'fas fa-play' : 'fas fa-pause');
    if (!isPaused) startReading();
});

$('#prevBtn').on('click', () => {
    if (!isModalActive) return;
    index = Math.max(index - 2, 0);
    $modalWordDisplay.text(words[index++] || "");
    saveLastReadIndex($textInput.val(), index - 1);
});

$('#nextBtn').on('click', () => {
    if (!isModalActive) return;
    if (index < words.length) {
        $modalWordDisplay.text(words[index++] || "");
        saveLastReadIndex($textInput.val(), index - 1);
    }
});

$('#hideControlsBtn').on('click', hideControls);

$('#fullscreenBtn').on('click', () => {
    if (!isModalActive) return;
    if (!document.fullscreenElement) {
        $modal[0].requestFullscreen();
    } else {
        document.exitFullscreen();
    }
});

$('#closeModalBtn').on('click', () => {
    clearInterval(intervalId);
    $modal.addClass('hidden');
    $bottomLine.removeClass('visible fadeout').addClass('hidden');
    $modalControls.addClass('hidden');
    isModalActive = false;
    hideControls();
    prepareWordSelection();
    $editTextBtn.removeClass('hidden');
});

$bgColorPicker.on('input', e => isModalActive && $modal.css('background-color', e.target.value));
$textColorPicker.on('input', e => {
    if (!isModalActive) return;
    $modalWordDisplay.css('color', e.target.value);
    $bottomLine.css('background-color', e.target.value);
});
$fontSizeSelect.on('change', e => isModalActive && $modalWordDisplay.css('font-size', `${e.target.value}px`));

function showErrorPopup(message = 'Please enter some text.') {
    $errorText.text(message);
    $errorPopup.addClass('visible');
    setTimeout(() => $errorPopup.removeClass('visible'), 3000);
}

$(document).on('keydown', e => {
    if (!isModalActive) return;
    switch (e.key.toLowerCase()) {
        case 'b': $bgColorPicker.click(); break;
        case 't': $textColorPicker.click(); break;
        case 'f': $fontSizeSelect.focus(); break;
        case 'arrowleft': $('#prevBtn').click(); break;
        case ' ': e.preventDefault(); $('#toggleBtn').click(); break;
        case 'arrowright': $('#nextBtn').click(); break;
        case 'enter': $('#fullscreenBtn').click(); break;
        case 'h': $('#hideControlsBtn').click(); break;
        case 'escape': $('#closeModalBtn').click(); break;
    }
});

function saveTextToLocalStorage(text, lastReadIndex = 0) {
    let saved = JSON.parse(localStorage.getItem('savedTexts')) || [];
    const id = Date.now().toString();

    let existing = saved.find(item => item.text === text);
    if (existing) {
        existing.lastReadIndex = lastReadIndex;
        existing.lastReadAt = new Date().toISOString();
    } else {
        saved.push({
            id: id,
            text: text,
            createdAt: new Date().toISOString(),
            lastReadIndex: lastReadIndex,
            lastReadAt: null
        });
    }

    localStorage.setItem('savedTexts', JSON.stringify(saved));
    renderSavedTexts();
}

function getLastReadIndex(text) {
    const saved = JSON.parse(localStorage.getItem('savedTexts')) || [];
    const item = saved.find(item => item.text === text);
    return item ? item.lastReadIndex || 0 : 0;
}

function updateLastReadIndex(text, index) {
    const saved = JSON.parse(localStorage.getItem('savedTexts')) || [];
    const item = saved.find(item => item.text === text);
    if (item) {
        item.lastReadIndex = index;
        item.lastReadAt = new Date().toISOString();
        localStorage.setItem('savedTexts', JSON.stringify(saved));
    }
}

function renderSavedTexts() {
    const saved = JSON.parse(localStorage.getItem('savedTexts')) || [];
    const $title = $('#savedTextsTitle');
    const $container = $('#savedTextsContainer');

    $container.empty();
    if (saved.length === 0) {
        $title.addClass('hidden');
        return;
    }

    $title.removeClass('hidden');
    saved.reverse().forEach(item => {
        const words = item.text ? item.text.split(/\s+/) : [];
        const readCount = item.lastReadIndex || 0;
        const readPercent = Math.floor((readCount / words.length) * 100);

        const $card = $('<div></div>').addClass('saved-text-card').css({
            position: 'relative',
            width: '100%',
            'min-height': '100px'
        });

        const $textContent = $('<div></div>')
            .addClass('text-content')
            .html(item.text && item.text.length > 300 ? item.text.substring(0, 300) + '...' : item.text)
            .css({
                'white-space': 'normal',
                'overflow': 'visible',
                'text-overflow': 'initial'
            });

        const $metadata = $(`
            <div class="metadata">
                Created: ${new Date(item.createdAt).toLocaleDateString()}<br>
                Last Read: ${item.lastReadAt ? new Date(item.lastReadAt).toLocaleString() : '-'}<br>
                Words: ${readCount}/${words.length} (${readPercent}%)
            </div>
        `);

        const $deleteBtn = $('<button>&times;</button>')
            .addClass('delete-btn')
            .attr('title', 'Delete')
            .on('click', e => {
                e.stopPropagation();
                deleteTextFromLocalStorage(item.id);
            });

        const $copyBtn = $('<button><i class="fas fa-copy"></i></button>')
            .addClass('copy-btn')
            .attr('title', 'Load Text')
            .on('click', e => {
                e.stopPropagation();
                $globalLoader.removeClass('hidden');
                setTimeout(() => {
                    deleteTextFromLocalStorage(item.id);
                    $textInput.val(item.text);
                    autoResizeTextarea($textInput);
                    selectedStartIndex = item.lastReadIndex || 0;
                    prepareWordSelection();
                    $modalWordDisplay.text(item.text.split(/\s+/)[selectedStartIndex] || '');
                    $globalLoader.addClass('hidden');
                    $editTextBtn.removeClass('hidden');
                }, 100);
            });

        $card.append($textContent, $metadata, $deleteBtn, $copyBtn);
        $container.append($card);
    });
}

function deleteTextFromLocalStorage(id) {
    let saved = JSON.parse(localStorage.getItem('savedTexts')) || [];
    saved = saved.filter(item => item.id !== id);
    localStorage.setItem('savedTexts', JSON.stringify(saved));
    renderSavedTexts();
}

$(document).ready(() => {
    renderSavedTexts();
    autoResizeTextarea($textInput);
});

const $overlay = $('#globalDropOverlay');
$(window).on('dragenter', e => { e.preventDefault(); $overlay.addClass('visible'); });
$(window).on('dragover', e => e.preventDefault());
$(window).on('dragleave', e => { if (e.originalEvent.clientX === 0 && e.originalEvent.clientY === 0) $overlay.removeClass('visible'); });
$(window).on('drop', e => {
    e.preventDefault();
    $overlay.removeClass('visible');
    const files = e.originalEvent.dataTransfer.files;
    if (!files.length) return;

    const file = files[0];
    if (file.type !== 'application/pdf') {
        showErrorPopup('Only PDF files are supported.');
        return;
    }

    $globalLoader.removeClass('hidden');
    const reader = new FileReader();
    reader.onload = function () {
        const typedArray = new Uint8Array(reader.result);
        pdfjsLib.getDocument({ data: typedArray }).promise.then(async pdf => {
            let fullText = '';
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const content = await page.getTextContent();
                fullText += content.items.map(item => item.str).join(' ') + '\n\n';
            }
            onPdfTextLoaded(fullText);
            $globalLoader.addClass('hidden');
        }).catch(() => {
            $globalLoader.addClass('hidden');
            showErrorPopup('Failed to load PDF.');
        });
    };
    reader.readAsArrayBuffer(file);
});

function onPdfTextLoaded(text) {
    $textInput.val(text);
    autoResizeTextarea($textInput);
    prepareWordSelection();
    $editTextBtn.removeClass('hidden');
}

function renderSelectableWords(text) {
    $selectStartContainer.empty();
    const ws = text.split(/\s+/);
    ws.forEach((word, i) => {
        const $span = $('<span></span>').text(word + ' ').css({
            cursor: 'pointer', 'user-select': 'none', padding: '2px 4px', 'border-radius': '4px'
        });
        if (i === selectedStartIndex) $span.css('background-color', '#90caf9');
        $span.on('click', () => {
            selectedStartIndex = i;
            highlightSelectedWord();
            saveLastReadIndex(text, i);
        });
        $selectStartContainer.append($span);
    });
}

function highlightSelectedWord() {
    $selectStartContainer.children('span').each(function (i) {
        $(this).css('background-color', i === selectedStartIndex ? '#90caf9' : '');
    });
}

function prepareWordSelection() {
    const text = $textInput.val().trim();
    if (!text) { showErrorPopup(); return; }
    $textInput.hide();
    $selectStartContainer.show();
    renderSelectableWords(text);
    highlightSelectedWord();
    $editTextBtn.removeClass('hidden');
}