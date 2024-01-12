import themes, {colorVariables} from "./themes.js";
import * as Calc from "./calculator.js";

// TODO - each keyboard shortcut should be place in its own event listener in its respective section
// const keyboardShortcuts = ["N", "K", "H", "T"]

document.addEventListener("DOMContentLoaded", initApp);

function initApp() {

/**********************************************************************************/
/*                                     Themes                                     */
/**********************************************************************************/

initThemes();

function initThemes() {
    const themesButton = document.querySelector(".themes__btn");
    const themesPanel = document.querySelector(".themes__panel");
    const themesCloseButton = document.querySelector(`#close-themes`);

    let themeClicked = false;

    themesButton.addEventListener("click", toggleThemesPanel);

    //click away
    window.addEventListener("click", (event) => {
        if(themesPanel.classList[1] === "panel-active" && !themesPanel.contains(event.target) && !themesButton.contains(event.target)) {
            toggleThemesPanel();
        }
    })

    function toggleThemesPanel() {
        themesPanel.classList.toggle("panel-active");
        themesButton.classList.toggle("themes-active");

        if(themeClicked) {
            themesCloseButton.style.setProperty("animation", "fade-out 0.25s forwards");
            themeClicked = false;
        }
        else {
            themesCloseButton.style.setProperty("animation", "fade-in 0.5s forwards");
            themeClicked = true;
        }
    }

    setThemes(getTheme());
}

function getTheme() {
    return localStorage.getItem("theme") ?? "white";
}

function setThemes(themeStored) {
    const themesContainer = document.querySelector(".themes__panel");
    
    Object.keys(themes).forEach((theme) => {

        const newTheme = document.createElement("button");
        newTheme.id = theme;
        newTheme.title = theme;
        newTheme.classList.add("themes__panel-option");
        newTheme.style.backgroundColor = themes[theme][0];
        newTheme.addEventListener("click", () => {
            updateTheme(themes[theme], theme);
        });
        themesContainer.append(newTheme);

        if(theme === themeStored) updateTheme(themes[themeStored], theme);
    });

    function updateTheme(themeColors, incTheme) {
        for(let i = 0; i < colorVariables.length; i ++) {
            document.documentElement.style.setProperty(colorVariables[i], themeColors[i]);
        }
        const themeCurrent = document.querySelector(".themes__current");
        themeCurrent.style.setProperty("background-color", themeColors[0]);
        themeCurrent.title = incTheme;
        localStorage.setItem("theme", incTheme);
    }
}

/**********************************************************************************/
/*                                Background Image                                */
/**********************************************************************************/

// unsplash API
// on each new background request, update image and credits

//for each image, check size
//if less than window width or height, you can do one of two things
// 1) set backgroun-size to cover
// 2) search for the next image

// ACTUALLY, I think you can search for a specific widthxhieght in the get req

/**********************************************************************************/
/*                                   Calculator                                   */
/**********************************************************************************/

//i tried to make sure each section has its variable scoped correctly, but these have to be global for history entries
const panelOutputPrev = document.querySelector(".calculator__panel-output-prev");
const panelOutputMain = document.querySelector(".calculator__panel-output-main");

const calcButtons = [
    document.getElementsByClassName("btn-operand"),
    document.getElementsByClassName("btn-operator"),
    document.getElementsByClassName("btn-special")
];

const errorMessage = document.querySelector(".calculator-error");
let fadeError = undefined;
let justSubmitted = false;
let exponentialStopPoint = -1;

initCalc();

function initCalc() {

    //operands & operators buttons
    for(let i = 0; i < 2; i++) {
        for(let j = 0; j < calcButtons[i].length; j++) {
            calcButtons[i][j].addEventListener("click", (event) => {
                handleCalcInput(event.target.textContent);
            });
        }
    }

    //delete button
    calcButtons[2][0].addEventListener("click", handleCalcDelete);

    //clear button
    calcButtons[2][1].addEventListener("click", handleCalcClear);

    //equals button
    calcButtons[2][2].addEventListener("click", handleCalcSubmit);

    //TODO
    //keyboard integration
    // multiplication is * => make sure to pass \u00D7
    // division is / => make sure to pass \u00F7
    // nbsp is \u00A0
    const validOperands = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."];
    const validOperators = ["(", ")", "%", "-", "^", "*", "/", "+"];
    const specialCalcKeys = ["Enter", "backspace", "Esc"];


    //calculator operands & operators
    function handleCalcInput(btn) {
        if(exponentialStopPoint !== -1 && panelOutputMain.textContent.length === exponentialStopPoint && ["(", "%", "-", "^", "\u00D7", "\u00F7", "+"].includes(btn)) {
            panelOutputMain.textContent = "(" + panelOutputMain.textContent + ")";
            exponentialStopPoint += 2;
        }

        panelOutputMain.textContent = Calc.handleInput(btn, panelOutputMain.textContent, justSubmitted);

        if(panelOutputMain.textContent.length < exponentialStopPoint) {
            exponentialStopPoint = -1;
        }
        if(justSubmitted && !(panelOutputMain.textContent.length === exponentialStopPoint && btn === ")")) {
            panelOutputPrev.textContent = "\u00A0";
            justSubmitted = false;
        }
        checkCalcPanelScroll();
    }

    //calculator delete
    function handleCalcDelete() {
        if(panelOutputMain.textContent.length <= 1 || justSubmitted) {
            panelOutputMain.textContent = "\u00A0";
        }
        else {
            if(panelOutputMain.textContent.includes("e") && panelOutputMain.textContent.length === exponentialStopPoint) {
                panelOutputMain.textContent = "\u00A0";
                exponentialStopPoint = -1;
            }
            else if(panelOutputMain.textContent[panelOutputMain.textContent.length - 2] === ' ') {
                panelOutputMain.textContent = panelOutputMain.textContent.slice(0, panelOutputMain.textContent.length - 2);
            }
            else {
                panelOutputMain.textContent = panelOutputMain.textContent.slice(0, panelOutputMain.textContent.length - 1);
            }
        }
        if(justSubmitted) {
            panelOutputPrev.textContent = "\u00A0";
            justSubmitted = false;
        }
        checkCalcPanelScroll();
    }

    //calculator clear
    function handleCalcClear() {
        panelOutputMain.textContent = "\u00A0";
        panelOutputPrev.textContent = "\u00A0";
        exponentialStopPoint = -1;
        justSubmitted = false;
        checkCalcPanelScroll();
    }

    //calculator submit
    function handleCalcSubmit() {
        clearTimeout(fadeError);
        errorMessage.style.setProperty("animation", "unset");
        void errorMessage.offsetWidth;

        if(Calc.validateExpression(panelOutputMain.textContent)) {
            panelOutputPrev.textContent = panelOutputMain.textContent;
            panelOutputMain.textContent = Calc.handleSubmit(panelOutputMain.textContent);
            justSubmitted = true;

            //fit width
            if(panelOutputMain.scrollWidth > panelOutputMain.clientWidth && panelOutputMain.textContent.includes(".")) {
                let resizedMain = new Big(panelOutputMain.textContent);
                
                while(panelOutputMain.scrollWidth > panelOutputMain.clientWidth) {
                    resizedMain = new Big(resizedMain.toPrecision(resizedMain.c.length - 1));
                    panelOutputMain.textContent = resizedMain.toString();
                    console.log(resizedMain);
                }
            }

            if(panelOutputMain.textContent.includes("e")) {
                exponentialStopPoint = panelOutputMain.textContent.length;
            }
            else {
                exponentialStopPoint = -1;
            }

            //add to history
            let time = new Date();
            addHistoryEntry({
                id: time.getTime(), 
                date: time, 
                input: panelOutputPrev.textContent, 
                output: panelOutputMain.textContent
            }, true);
        }
        else {
            errorMessage.style.setProperty("animation", "fade-out 2.25s ease-in");
            fadeError = setTimeout(() => errorMessage.style.setProperty("animation", "unset"), 2250);
        }
        checkCalcPanelScroll();
    }
}

// check to see if horizontal scrollbar is visible
function checkCalcPanelScroll() {
    if(panelOutputPrev.scrollWidth > panelOutputPrev.clientWidth) {
        panelOutputPrev.style.setProperty("margin-bottom", "0.25px");
    }
    else {
        panelOutputPrev.style.setProperty("margin-bottom", "3px");
    }

    if(panelOutputMain.scrollWidth > panelOutputMain.clientWidth) {
        panelOutputMain.style.setProperty("margin-bottom", "0.25px");
    }
    else {
        panelOutputMain.style.setProperty("margin-bottom", "3px");
    }
}

/**********************************************************************************/
/*                                History Entries                                 */
/**********************************************************************************/

initHistory();

function initHistory() {
    
    if(localStorage.getItem("history")) {
        let entries = JSON.parse(localStorage.getItem("history"));
        for(let i = 0; i < entries.length; i++) {
            entries[i].date = new Date(entries[i].id);
            addHistoryEntry(entries[i], false);
        }
        initHistoryButtons();
    }
    else {
        localStorage.setItem("history", "");
        const historyPanelEntries = document.querySelector(".calculator__history-entries");
        historyPanelEntries.innerHTML = `<p class="calculator__history-empty">Your history log is empty!</p>`;
    }
}

/*  
    newEntry = {
        id: number,
        date: new Date(), 
        input: string, 
        output: string
    } 

    addToLocalStorage = boolean; 
    - if true, add to local storage, else skip error checking and add to DOM
*/
function addHistoryEntry(newEntry, addToLocalStorage) {
    const currentEntries = document.querySelector(".calculator__history-entries");
    let loggedEntries;
    try {
        loggedEntries = JSON.parse(localStorage.getItem("history"));
    }
    catch {
        loggedEntries = [];
    }

    //check if empty
    if(addToLocalStorage) {
        if(currentEntries.firstElementChild.textContent === "Your history log is empty!") currentEntries.innerHTML = "";
        else { //check if duplicate
            let prevInput = currentEntries.lastElementChild.querySelector(".entry-input").textContent;
            let prevOutput = currentEntries.lastElementChild.querySelector(".entry-output").textContent;
            if(newEntry.input === prevInput && newEntry.output === prevOutput) return;
        }
    }

    const entryTemplate = `
        <div id="entry${newEntry.id}" class="calculator__history-entry">
            <div class="entry-header">
                <p class="entry-header-time">${newEntry.date.toLocaleString()}</p>
                <button class="entry-header-copy" title="copy"><i class="fa-regular fa-copy"></i></button>
                <button class="entry-header-delete" title="delete"><i class="fa-regular fa-trash-can"></i></but>
            </div>
            <div class="entry-body">
                <p class="entry-input">${newEntry.input}</p>
                <p class="entry-output">${newEntry.output}</p>
            </div>
        </div>`;
    
    //append entry to local storage
    if(addToLocalStorage) {
        loggedEntries.push(newEntry);
        localStorage.setItem("history", JSON.stringify(loggedEntries));
    }

    //append entry to document
    currentEntries.innerHTML += entryTemplate;
    const newEntryElement = document.querySelector(`#entry${newEntry.id}`);
    
    //check for overflow/scrollbar
    const newEntryInput = newEntryElement.querySelector(".entry-input");
    if(newEntryInput.scrollWidth > newEntryInput.clientWidth) {
        newEntryInput.style.setProperty("margin-bottom", "0.25px");
    }
    else {
        newEntryInput.style.setProperty("margin-bottom", "3px");
    }

    if(addToLocalStorage) initHistoryButtons();
}

function initHistoryButtons() {
    const entries = document.getElementsByClassName("calculator__history-entry");

    for(let i = 0; i < entries.length; i++) {
        
        entries[i].querySelector(".entry-header-copy").addEventListener("click", (event) => {
            let entry = event.target.parentElement.parentElement;
            if(entry.classList[0] === "entry-header") entry = entry.parentElement;

            panelOutputPrev.textContent = entry.querySelector(".entry-input").textContent;
            panelOutputMain.textContent = entry.querySelector(".entry-output").textContent;
            justSubmitted = true;
            if(panelOutputMain.textContent.includes("e")) {
                exponentialStopPoint = panelOutputMain.textContent.length;
            }
            else {
                exponentialStopPoint = -1;
            }
        });

        entries[i].querySelector(".entry-header-delete").addEventListener("click", (event) => {
            let entry = event.target.parentElement.parentElement;
            if(entry.classList[0] === "entry-header") entry = entry.parentElement;

            entry.remove();

            const entriesContainer = document.querySelector(".calculator__history-entries")

            if(entriesContainer.children.length === 0) {
                entriesContainer.innerHTML = `<p class="calculator__history-empty">Your history log is empty!</p>`;
                localStorage.setItem("history", "");
            }
            else {
                const loggedEntries = JSON.parse(localStorage.getItem("history"));
                loggedEntries.splice(binarySearchForID(Number(entry.id.slice(5))), 1);
                localStorage.setItem("history", JSON.stringify(loggedEntries));
            }
        });
    }
}

function binarySearchForID(targetID) {
    const loggedEntries = JSON.parse(localStorage.getItem("history"));
    let low = 0;
    let high = loggedEntries.length - 1;
    let mid = undefined;

    while(high >= low) {
        mid = low + Math.floor((high - low) / 2);

        if(loggedEntries[mid].id === targetID) {
            return mid;
        }
        
        if(loggedEntries[mid].id < targetID) {
            low = mid + 1;
        }
        else if(loggedEntries[mid].id > targetID) {
            high = mid - 1;
        }
    }

    return -1;
}

/**********************************************************************************/
/*                                 History Panel                                  */
/**********************************************************************************/

initHistoryPanel();

function initHistoryPanel() {
    const historyButton = document.querySelector("#calculator-history-btn");
    const historyCloseButton = document.querySelector("#close-history");
    const historyPanel = document.querySelector(".calculator__history");
    const historyPanelEntries = document.querySelector(".calculator__history-entries");
    const historyPanelHeader = document.querySelector(".calculator__history-header");
    const historyClearBtn = historyPanelHeader.querySelector("button");
    let historyClicked = false;

    historyClearBtn.addEventListener("click", clearHistory);
    historyButton.addEventListener("click", toggleHistoryPanel);
    if(JSON.parse(sessionStorage.getItem("HistoryPanelOpen"))) toggleHistoryPanel(); // TODO - disable this for mobile && window.innerWidth >= ___px

    function toggleHistoryPanel() {
        historyButton.classList.toggle("history-active");
        historyPanel.classList.toggle("history-panel-active");
        historyPanelEntries.classList.toggle("entries-active");
        historyPanelHeader.classList.toggle("history-header-active");

        if(historyClicked) {
            historyCloseButton.style.setProperty("animation", "fade-out 0.25s forwards");
            historyClicked = false;
            sessionStorage.setItem("HistoryPanelOpen", false);
        }
        else {
            historyCloseButton.style.setProperty("animation", "fade-in 0.5s forwards");
            historyClicked = true;
            sessionStorage.setItem("HistoryPanelOpen", true);
        }
    }

    function clearHistory() {
        localStorage.setItem("history", "");
        historyPanelEntries.innerHTML = `<p class="calculator__history-empty">Your history log is empty!</p>`;
    }
}

/**********************************************************************************/
/*                                Button Navigation                               */
/**********************************************************************************/

// TODO - navigation.js - 2D array of stuff - also search up HTML tabindex
// For all buttons, Remove the fact that you can hit enter and it clicks (only spacebar and click to hit a button)
// instead, enter will submit the current expression at all times

/**********************************************************************************/
/*                            Keyboard Shortcuts Panel                            */
/**********************************************************************************/

//TODO - this will be diplay:none on mobile, so make a condition (window.innerWidth) to see if you should execute this function
initKeyboardShortcuts();

function initKeyboardShortcuts() {
    const keyboardShortcutsButton = document.querySelector(".keyboard-shortcuts__btn");
    const keyboardShortcutsPanel = document.querySelector(".keyboard-shortcuts__panel");
    const keyboardShortcutsCloseButton = document.querySelector(`#close-keyboard-shortcuts`);

    let keyboardShortcutsClicked = false;
    let linesDrawn = false;

    if(JSON.parse(sessionStorage.getItem("KeyboardShortcutsOpen"))) toggleKeyboardShortcuts();
    keyboardShortcutsButton.addEventListener("click", toggleKeyboardShortcuts);

    function toggleKeyboardShortcuts() {
        keyboardShortcutsPanel.classList.toggle("panel-active");
        keyboardShortcutsButton.classList.toggle("keyboard-shortcuts-active");

        if(keyboardShortcutsClicked) {
            keyboardShortcutsCloseButton.style.setProperty("animation", "fade-out 0.25s forwards");
            keyboardShortcutsClicked = false;
            sessionStorage.setItem("KeyboardShortcutsOpen", false);
        }
        else {
            keyboardShortcutsCloseButton.style.setProperty("animation", "fade-in 0.5s forwards");
            keyboardShortcutsClicked = true;
            sessionStorage.setItem("KeyboardShortcutsOpen", true);
        }

        if(!linesDrawn) {
            drawKeyboardShortcutLines();
            linesDrawn = true;
        }
    }
}

function drawKeyboardShortcutLines() {
    const shortcutKeys = document.querySelectorAll(".kbd");
    const shortcutLines = document.querySelectorAll("td .line");

    for(let i = 0; i < shortcutKeys.length; i++) {
        const spacing_md = getComputedStyle(document.documentElement).getPropertyValue("--SPACING-MD");
        let stopLength = 
            shortcutKeys[i].offsetLeft + 
            shortcutKeys[i].offsetWidth + 
            (Number(spacing_md.substring(0, spacing_md.indexOf('r'))) * 16 * 2);

        const newWidth = shortcutLines[i].offsetLeft - stopLength;
        shortcutLines[i].style.setProperty("width", newWidth + "px");
    }
}
} // initApp()'s closing bracket