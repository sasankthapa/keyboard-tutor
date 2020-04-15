
KEYS = {
    BACKSPACE: 8,
    TAB: 9,
    ENTER: 13,
    SHIFT: 16,
    CTRL: 17,
    ALT: 18,
    PAUSE: 19,
    CAPS_LOCK: 20,
    ESCAPE: 27,
    SPACE: 32,
    PAGE_UP: 33,
    PAGE_DOWN: 34,
    END: 35,
    HOME: 36,
    LEFT_ARROW: 37,
    UP_ARROW: 38,
    RIGHT_ARROW: 39,
    DOWN_ARROW: 40,
    INSERT: 45,
    DELETE: 46,
    KEY_0: 48,
    KEY_1: 49,
    KEY_2: 50,
    KEY_3: 51,
    KEY_4: 52,
    KEY_5: 53,
    KEY_6: 54,
    KEY_7: 55,
    KEY_8: 56,
    KEY_9: 57,
    KEY_A: 65,
    KEY_B: 66,
    KEY_C: 67,
    KEY_D: 68,
    KEY_E: 69,
    KEY_F: 70,
    KEY_G: 71,
    KEY_H: 72,
    KEY_I: 73,
    KEY_J: 74,
    KEY_K: 75,
    KEY_L: 76,
    KEY_M: 77,
    KEY_N: 78,
    KEY_O: 79,
    KEY_P: 80,
    KEY_Q: 81,
    KEY_R: 82,
    KEY_S: 83,
    KEY_T: 84,
    KEY_U: 85,
    KEY_V: 86,
    KEY_W: 87,
    KEY_X: 88,
    KEY_Y: 89,
    KEY_Z: 90,
    LEFT_META: 91,
    RIGHT_META: 92,
    SELECT: 93,
    NUMPAD_0: 96,
    NUMPAD_1: 97,
    NUMPAD_2: 98,
    NUMPAD_3: 99,
    NUMPAD_4: 100,
    NUMPAD_5: 101,
    NUMPAD_6: 102,
    NUMPAD_7: 103,
    NUMPAD_8: 104,
    NUMPAD_9: 105,
    MULTIPLY: 106,
    ADD: 107,
    SUBTRACT: 109,
    DECIMAL: 110,
    DIVIDE: 111,
    F1: 112,
    F2: 113,
    F3: 114,
    F4: 115,
    F5: 116,
    F6: 117,
    F7: 118,
    F8: 119,
    F9: 120,
    F10: 121,
    F11: 122,
    F12: 123,
    NUM_LOCK: 144,
    SCROLL_LOCK: 145,
    SEMICOLON: 186,
    EQUALS: 187,
    COMMA: 188,
    DASH: 189,
    PERIOD: 190,
    FORWARD_SLASH: 191,
    GRAVE_ACCENT: 192,
    OPEN_BRACKET: 219,
    BACK_SLASH: 220,
    CLOSE_BRACKET: 221,
    SINGLE_QUOTE: 222
};
const right_shift_letters = "qazwsxedcrfvtgb"

var start_time;
var results_set = false;
var word_count = 0;
var mistakes = 0;

var left_upper = false;
var right_upper = false;

var completed;
var cursor;
var uncompleted;

const requestText = async () => {
    const response = await fetch('https://www.randomtext.me/api/gibberish/h1/50');
    const json = await response.json();
    text=json.text_out
        .replace("<h1>","") // randomtext.me only outputs "HTML" text
        .replace("<h1/>","")
        .replace(/\b\w/g, l => l.toUpperCase()) // Words will begin with capitals
        .replace(/\s+/g, ' ') // collapse whitespace just in case.
        .trim()
        
    setText(text);
    // Hardcoded text for unittests.
    // setText("hello world YHNUJM QAZWSXEDCRFVTGB")
}

function setText(text) {
    completed.innerHTML = ""
    cursor.innerHTML = text.charAt(0)
    uncompleted.innerHTML = text.substring(1)
    word_count = text.split(" ").length;
}

document.addEventListener("DOMContentLoaded", function (event) {
    completed = document.getElementById("tutor-completed");
    cursor = document.getElementById("tutor-cursor");
    uncompleted = document.getElementById("tutor-uncompleted");
    requestText();
});

document.addEventListener('keyup', function (event) {
    if (event.location === KeyboardEvent.DOM_KEY_LOCATION_LEFT) {
        left_upper = false
    } else if (event.location === KeyboardEvent.DOM_KEY_LOCATION_RIGHT) {
        right_upper = false
    }
});
document.addEventListener('keydown', function (event) {
    if (!start_time) {
        start_time = new Date().getTime()
    }

    var key = '';

    switch (event.keyCode) {
        case KEYS.SPACE:
            event.preventDefault();
            key = ' ';
            break;
        case KEYS.FORWARD_SLASH:
            event.preventDefault();
            key = '/';
            break;
        case KEYS.COMMA:
            key = ',';
            break;
        case KEYS.PERIOD:
            key = '.';
            break;
        case 173:
            key = '-';
            break;
        case KEYS.SHIFT:
            if (event.location === KeyboardEvent.DOM_KEY_LOCATION_LEFT) {
                left_upper = true
                return
            } else if (event.location === KeyboardEvent.DOM_KEY_LOCATION_RIGHT) {
                right_upper = true
                return
            }
        case KEYS.BACKSPACE:
            uncompleted.innerHTML = cursor.innerHTML + uncompleted.innerHTML;
            cursor.innerHTML = completed.innerHTML.slice(-1);
            completed.innerHTML = completed.innerHTML.slice(0, -1);
            console.log("BACKSPACED");
            break;
        default:
            if (KEYS.KEY_0 <= event.keyCode && event.keyCode <= KEYS.KEY_Z) {
                key = String.fromCharCode(event.keyCode);
                key = key.toLowerCase();
                if (right_upper && right_shift_letters.includes(key)) {
                    key = key.toUpperCase();
                }
                else if (left_upper && !right_shift_letters.includes(key)) {
                    key = key.toUpperCase();
                }
                break;
            }
    }
    if (key == cursor.innerHTML) {
        completed.innerHTML += key;
        cursor.innerHTML = (uncompleted.innerHTML.charAt(0));
        uncompleted.innerHTML = uncompleted.innerHTML.substr(1);
    }
    else {
        mistakes++;
    }
    if (uncompleted.innerHTML.length == 0 && cursor.innerHTML.length == 0 && !results_set) {
        var stop_time = new Date().getTime();
        var result = document.getElementById("result");
        var wpm = word_count / (((stop_time - start_time) / 1000) / 60);
        var mpw = mistakes/word_count;
        result.innerHTML = `WPM:${wpm.toFixed(2)}; MPW:${mpw.toFixed(2)}; Words:${word_count}; Mistakes:${mistakes};`;
        results_set = true

    }
});