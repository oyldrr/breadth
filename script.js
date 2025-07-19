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

let words = [];
let index = 0;
let intervalId = null;
let isPaused = false;
let delay = 60000 / 150;
let isModalActive = false;
let controlsVisible = false;

$textInput.val("With breadth, you can read quickly without losing focus! Paste your text to start reading now.");

function autoResizeTextarea($el) {
    $el.css('height', 'auto');
    $el.css('height', $el[0].scrollHeight + 'px');
}

$('#textInput').on('input', function () {
    autoResizeTextarea($(this));
});



$('#startBtn').on('click', () => {
    const text = $textInput.val().trim();
    if (!text) {
        showErrorPopup();
        return;
    }
    saveTextToLocalStorage(text);
    const wpm = parseInt($wpmInput.val());
    if (isNaN(wpm) || wpm < 50) {
        showErrorPopup('Please enter a valid WPM value (min 50).');
        return;
    }
    delay = 60000 / wpm;
    words = text.split(/\s+/);
    index = 0;
    isPaused = false;
    isModalActive = true;

    $modalWordDisplay.text(words[index]);
    $modal.removeClass('hidden');
    $bottomLine.removeClass('hidden').addClass('visible');
    $modalControls.removeClass('hidden');
    showControls();
    isPaused = true;
    $playPauseIcon.attr('class', 'fas fa-play');
});

function startReading() {
    clearInterval(intervalId);
    intervalId = setInterval(() => {
        if (!isPaused && index < words.length) {
            $modalWordDisplay.text(words[index++]);
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
});

$('#nextBtn').on('click', () => {
    if (!isModalActive) return;
    if (index < words.length) {
        $modalWordDisplay.text(words[index++] || "");
    }
});

$('#hideControlsBtn').on('click', () => {
    if (!isModalActive) return;
    hideControls();
});

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
});

$bgColorPicker.on('input', (e) => {
    if (!isModalActive) return;
    $modal.css('background-color', e.target.value);
});

$textColorPicker.on('input', (e) => {
    if (!isModalActive) return;
    $modalWordDisplay.css('color', e.target.value);
    $bottomLine.css('background-color', e.target.value);
});

$fontSizeSelect.on('change', (e) => {
    if (!isModalActive) return;
    $modalWordDisplay.css('font-size', `${e.target.value}px`);
});

function showErrorPopup(message = 'Please enter some text.') {
    $errorText.text(message);
    $errorPopup.addClass('visible');
    setTimeout(() => {
        $errorPopup.removeClass('visible');
    }, 3000);
}

$(document).on('keydown', (e) => {
    if (!isModalActive) return;
    switch (e.key.toLowerCase()) {
        case 'b':
            $bgColorPicker.click();
            break;
        case 't':
            $textColorPicker.click();
            break;
        case 'f':
            $fontSizeSelect.focus();
            break;
        case 'arrowleft':
            $('#prevBtn').click();
            break;
        case ' ':
            e.preventDefault();
            $('#toggleBtn').click();
            break;
        case 'arrowright':
            $('#nextBtn').click();
            break;
        case 'enter':
            $('#fullscreenBtn').click();
            break;
        case 'h':
            $('#hideControlsBtn').click();
            break;
        case 'escape':
            $('#closeModalBtn').click();
            break;
    }
});

function saveTextToLocalStorage(text) {
    let saved = JSON.parse(localStorage.getItem('savedTexts')) || [];
    if (!saved.includes(text)) {
        saved.push(text);
        localStorage.setItem('savedTexts', JSON.stringify(saved));
        renderSavedTexts();
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

    saved.reverse().forEach((txt, i) => {
        const $card = $('<div></div>').addClass('saved-text-card').css('position', 'relative');

        const $textContent = $('<div></div>')
            .text(txt.length > 150 ? txt.substring(0, 150) + '...' : txt)
            .css('padding-right', '32px')
            .on('click', () => {
                $textInput.val(txt);
                $('html, body').animate({ scrollTop: $textInput.offset().top - 50 }, 300);
                autoResizeTextarea($textInput);
            });

        const $deleteBtn = $('<button>&times;</button>')
            .attr('title', 'Sil')
            .css({
                position: 'absolute',
                top: '8px',
                right: '12px',
                border: 'none',
                background: 'transparent',
                color: '#888',
                fontSize: '20px',
                cursor: 'pointer'
            })
            .on('click', (e) => {
                e.stopPropagation();
                deleteTextFromLocalStorage(txt);
            });

        $card.append($textContent, $deleteBtn);
        $container.append($card);
    });
}

function deleteTextFromLocalStorage(text) {
    let saved = JSON.parse(localStorage.getItem('savedTexts')) || [];
    saved = saved.filter(item => item !== text);
    localStorage.setItem('savedTexts', JSON.stringify(saved));
    renderSavedTexts();
}

$(document).ready(() => {
    renderSavedTexts();
    autoResizeTextarea($textInput);
});
