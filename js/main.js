import themes, {colorVariables} from "./themes.js";
import * as Calc from "./calculator.js";

document.addEventListener("DOMContentLoaded", initApp);

function initApp() {

//disable keyboard shortcuts for mobile devices
const keyboardShortcutsHead = document.querySelector(".keyboard-shortcuts__panel thead");
const keyboardShortcutsBody = document.querySelector(".keyboard-shortcuts__panel tbody");
let keyboardShortcutsOpen = false;
let isDesktop = false;
if(window.innerWidth >= 768) {
    isDesktop = true;
    initKeyboardShortcuts();
}
else {
    sessionStorage.setItem("KeyboardShortcutsOpen", false);
}

let delay = 250;
let linesResize = false;

const historyPanel = document.querySelector(".calculator__history");
const calculator = document.querySelector(".calculator");
let prevWidth = window.innerWidth;
window.addEventListener("resize", () => {

    //enable keyboard shortcuts only if desktop
    if(window.innerWidth >= 768 || isDesktop) {
        isDesktop = true;

        if(!keyboardShortcutsOpen) initKeyboardShortcuts();

        document.documentElement.style.setProperty("--KEYBOARD-SHORTCUTS-HEIGHT", 
        `${keyboardShortcutsBody.offsetHeight + keyboardShortcutsHead.offsetHeight + 2 * getRealValue("", "var(--SPACING-MD)")}px`);

        if (!linesResize) {
            drawKeyboardShortcutLines();
            linesResize = true;
            setTimeout(() => {
                linesResize = false;
            }, delay);
        }  
    }

    //adjust history panel mobile height
    if(prevWidth < 768) {
        document.documentElement.style.setProperty("--HISTORY-PANEL-MOBILE-HEIGHT", 
        `${calculator.offsetHeight - calcPanel.offsetHeight + getRealValue("", "var(--SPACING-MD)")}px`);
    }

    if(prevWidth < 768 && window.innerWidth >= 768) {
        //remove mobile cover is opened
        if(mobileOptionsPanel.classList.contains("panel-active")) toggleMobileOptions();

        //remove animation from calculator
        calculator.style.setProperty("animation", "none");

        //remove history panel mobile animations
        historyPanel.classList.remove("history-panel-mobile-fade-in");
        historyPanel.classList.remove("history-panel-mobile-fade-out");
    }
    else if(prevWidth >= 768 && window.innerWidth < 768) {
        if(themeClicked) calculator.style.setProperty("animation", "fade-out 0.25s forwards");
        document.documentElement.style.setProperty("--HISTORY-PANEL-MOBILE-HEIGHT", 
        `${calculator.offsetHeight - calcPanel.offsetHeight + getRealValue("", "var(--SPACING-MD)")}px`);
    }

    //restyle the history panel upon the breakpoint of 768px
    if(((prevWidth < 768 && window.innerWidth >= 768) || (prevWidth >= 768 && window.innerWidth < 768)) && historyClicked) {
        toggleHistoryAnimation(true);
        toggleHistoryPanel();
    }
    else if(((prevWidth < 768 && window.innerWidth >= 768) || (prevWidth >= 768 && window.innerWidth < 768))) {
        toggleHistoryAnimation(true);
    }

    prevWidth = window.innerWidth;
})

//reset for keyboard integration
window.addEventListener("keydown", (event) => {
    if(event.key === "Enter") event.preventDefault();
})

/**********************************************************************************/
/*                                     Themes                                     */
/**********************************************************************************/

const themesButton = document.querySelector(".themes__btn");
const themesPanel = document.querySelector(".themes__panel");
const themesCloseButton = document.querySelector(`#close-themes`);
let themeClicked = false;

initThemes();

function initThemes() {
    const mobileOptionsThemes = document.querySelector(".mobile-options__themes-btn");
    const mobileOptionsClose = document.querySelector(".themes__panel-mobile-close");

    themesButton.addEventListener("click", toggleThemesPanel);
    mobileOptionsThemes.addEventListener("click", toggleThemesPanel);
    mobileOptionsClose.addEventListener("click", toggleThemesPanel);

    //keyboard integration
    window.addEventListener("keydown", (event) => {
        if(isDesktop && !event.repeat && event.key.toUpperCase() === "T") {
            themesButton.classList.add("pressed");
            toggleThemesPanel();
        }
    });

    window.addEventListener("keyup", (event) => {
        if(event.key.toUpperCase() === "T") {
            themesButton.classList.remove("pressed");
        }
    });

    //click away
    window.addEventListener("click", (event) => {
        if(window.innerWidth >= 768 && themesPanel.classList.contains("panel-active") && !themesPanel.contains(event.target) && !themesButton.contains(event.target)) {
            toggleThemesPanel();
        }
    });

    setThemes(getTheme());
}

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

    if(window.innerWidth < 768) {
        if(themeClicked) {
            calculator.style.setProperty("animation", "fade-out 0.25s forwards");
            historyPanel.classList.add("history-panel-mobile-fade-out");
            historyPanel.classList.remove("history-panel-mobile-fade-in");
        }
        else {
            calculator.style.setProperty("animation", "fade-in 0.25s forwards");
            historyPanel.classList.add("history-panel-mobile-fade-in");
            historyPanel.classList.remove("history-panel-mobile-fade-out");
        }
    }
}

function getTheme() {
    if(localStorage.getItem("theme")) {
        return localStorage.getItem("theme");
    }
    
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return "black";
    } else {
        return "white";
    }
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
            newBackgroundImage();
            if(window.innerWidth < 768) toggleThemesPanel();
        });
        themesContainer.append(newTheme);

        if(theme === themeStored) updateTheme(themes[themeStored], theme);
    });

    function updateTheme(themeColors, incTheme) {
        for(let i = 0; i < colorVariables.length; i ++) {
            document.documentElement.style.setProperty(colorVariables[i], themeColors[i]);
        }
        const themeCurrent = document.getElementsByClassName("themes__current");
        for(let j = 0; j < themeCurrent.length; j++) {
            themeCurrent[j].style.setProperty("background-color", themeColors[0]);
            themeCurrent[j].title = incTheme;
        }
        localStorage.setItem("theme", incTheme);
    }
}

/**********************************************************************************/
/*                                Background Image                                */
/**********************************************************************************/

const backgroundContainer = document.querySelector("#outer-container");

initBackgroundImage();

function initBackgroundImage() {
    const newBackgroundButton = document.querySelector("#calculator__theme-header");

    newBackgroundButton.addEventListener("click", newBackgroundImage);

    setDefaultImage();

    //keyboard integration
    window.addEventListener("keydown", (event) => {
        if(isDesktop && !event.repeat && event.key.toUpperCase() === "N") {
            newBackgroundButton.classList.add("pressed");
            newBackgroundImage();
        }
    });

    window.addEventListener("keyup", (event) => {
        if(event.key.toUpperCase() === "N") {
            newBackgroundButton.classList.remove("pressed");
        }
    });
}

async function newBackgroundImage() {
    try {
        let currTheme = getTheme();
        if(currTheme === "limeGreen") currTheme = "lime green";
        const response = await fetch(`https://source.unsplash.com/random/${window.innerWidth}x${window.innerHeight}/?${currTheme}`);

        if(!response.ok) {
            throw new Error();
        }
        
        backgroundContainer.style.setProperty("background-image", `url("${response.url}")`);
        if(currTheme === "lime green") currTheme = "limeGreen";
        localStorage.setItem("image", JSON.stringify([response.url, currTheme]));
    }
    catch {
        console.error("Couldn't Get Image");
    }
}

function setDefaultImage() {
    let currImage = JSON.parse(localStorage.getItem("image"));
    if(currImage && currImage[1] === getTheme()) {
        backgroundContainer.style.setProperty("background-image", `url("${currImage[0]}")`);
    }
    else {
        switch(getTheme()) {
            case "white":
                backgroundContainer.style.setProperty("background-image", `url("https://images.unsplash.com/photo-1596367407372-96cb88503db6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")`);
                break;
            case "gray":
                backgroundContainer.style.setProperty("background-image", `url("https://images.unsplash.com/photo-1623212209063-a1295bdb54fc?q=80&w=1999&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")`);
                break;
            case "black":
                backgroundContainer.style.setProperty("background-image", `url("https://images.unsplash.com/photo-1478034460338-249ef2da6c0f?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")`);
                break;
            case "brown":
                backgroundContainer.style.setProperty("background-image", `url("https://images.unsplash.com/photo-1576899244078-180364e39ca1?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")`);
                break;
            case "maroon":
                backgroundContainer.style.setProperty("background-image", `url("https://images.unsplash.com/photo-1595502427603-3a6b5077ab78?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")`);
                break;
            case "red":
                backgroundContainer.style.setProperty("background-image", `url("https://images.unsplash.com/photo-1589592800927-a46aad4abd82?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")`);
                break;
            case "orange":
                backgroundContainer.style.setProperty("background-image", `url("https://images.unsplash.com/photo-1548504769-900b70ed122e?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")`);
                break;
            case "yellow":
                backgroundContainer.style.setProperty("background-image", `url("https://images.unsplash.com/photo-1523111104692-1def874394b6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")`);
                break;
            case "limeGreen":
                backgroundContainer.style.setProperty("background-image", `url("https://images.unsplash.com/photo-1497211419994-14ae40a3c7a3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")`);
                break;
            case "green":
                backgroundContainer.style.setProperty("background-image", `url("https://images.unsplash.com/photo-1488330890490-c291ecf62571?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")`);
                break;
            case "teal":
                backgroundContainer.style.setProperty("background-image", `url("https://images.unsplash.com/photo-1521080755838-d2311117f767?q=80&w=1924&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")`);
                break;
            case "blue":
                backgroundContainer.style.setProperty("background-image", `url("https://images.unsplash.com/photo-1523633589114-88eaf4b4f1a8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")`);
                break;
            case "purple":
                backgroundContainer.style.setProperty("background-image", `url("https://images.unsplash.com/photo-1482686115713-0fbcaced6e28?q=80&w=2067&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")`);
                break;
            case "pink":
                backgroundContainer.style.setProperty("background-image", `url("https://images.unsplash.com/photo-1520052205864-92d242b3a76b?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")`);
                break;
        }
    }
}

/**********************************************************************************/
/*                                   Calculator                                   */
/**********************************************************************************/

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

    // multiplication is * => make sure to pass \u00D7
    // division is / => make sure to pass \u00F7
    // nbsp is \u00A0
    const validOperands = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."];
    const validOperators = ["(", ")", "%", "-", "^", "*", "/", "+"];

    //keyboard integration
    window.addEventListener("keydown", (event) => {
        if(isDesktop) {
            
            let key = event.key;
            if(key === "*") key = "\u00D7";
            if(key === "/") key = "\u00F7";

            if(validOperands.includes(event.key) || validOperators.includes(event.key)) {
                handleCalcInput(key)
            }
            else if(key === "Enter") {
                handleCalcSubmit();
                key = "=";
            }
            else if(key === "Backspace") {
                handleCalcDelete();
            }
            else if(key === "Escape") {
                handleCalcClear();
                key = "Clear";
            }

            //apply pressed class
            if(key === "Backspace") {
                for(let i = 0; i < calcButtons[2].length; i++) {
                    if(calcButtons[2][i].id === "btn-del") {
                        calcButtons[2][i].classList.add("pressed");
                        break;
                    }
                }
            }
            else {
                for(let i = 0; i < 3; i++) {
                    for(let j = 0; j < calcButtons[i].length; j++) {
                        if(calcButtons[i][j].textContent === key) {
                            calcButtons[i][j].classList.add("pressed");
                            break;
                        }
                    }
                }
            }
        }
    });

    //remove pressed class
    window.addEventListener("keyup", (event) => {
        let key = event.key;
        if(key === "*") key = "\u00D7";
        if(key === "/") key = "\u00F7";
        if(key === "Enter") key = "=";
        if(key === "Escape") key = "Clear";

        if(key === "Backspace") {
            for(let i = 0; i < calcButtons[2].length; i++) {
                if(calcButtons[2][i].id === "btn-del") {
                    calcButtons[2][i].classList.remove("pressed");
                    break;
                }
            }
        }
        else {
            let found = false;
            for(let i = 0; i < 3; i++) {
                if(found) break;
                for(let j = 0; j < calcButtons[i].length; j++) {
                    if(calcButtons[i][j].textContent === key) {
                        calcButtons[i][j].classList.remove("pressed");
                        found = true;
                        break;
                    }
                }
            }
        }
    });

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
                    // console.log(resizedMain);
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
                id: String(time.getTime()), 
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
            entries[i].date = new Date(entries[i].date);
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
        id: string,
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

    //reapply event listeners
    if(addToLocalStorage) initHistoryButtons();
}

function initHistoryButtons() {
    const entries = document.getElementsByClassName("calculator__history-entry");

    for(let i = 0; i < entries.length; i++) {
        
        //copy btn
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
            checkCalcPanelScroll();
        });

        //delete btn
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
                loggedEntries.splice(binarySearchForID(entry.id.slice(5)), 1);
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

let historyClicked = false;
const historyButton = document.querySelector("#calculator-history-btn");
const historyCloseButton = document.querySelector("#close-history");
const historyPanelEntries = document.querySelector(".calculator__history-entries");
const historyPanelHeader = document.querySelector(".calculator__history-header");
const historyClearBtn = historyPanelHeader.querySelector("button");
const calcButtonsContainer = document.querySelector(".calculator__btns"); 
const calcPanel = document.querySelector(".calculator__panel"); 

initHistoryPanel();

function initHistoryPanel() {

    document.documentElement.style.setProperty("--HISTORY-PANEL-MOBILE-HEIGHT", 
    `${calculator.offsetHeight - calcPanel.offsetHeight + getRealValue("", "var(--SPACING-MD)")}px`);

    historyClearBtn.addEventListener("click", clearHistory);
    historyButton.addEventListener("click", () => {
        toggleHistoryAnimation();
        toggleHistoryPanel();
    });
    if(JSON.parse(sessionStorage.getItem("HistoryPanelOpen")) && window.innerWidth > 768) toggleHistoryPanel();

    //keyboard integration
    window.addEventListener("keydown", (event) => {
        if(isDesktop && !event.repeat && event.key.toUpperCase() === "H") {
            historyButton.classList.add("pressed");
            toggleHistoryAnimation();
            toggleHistoryPanel();
        }
    });

    window.addEventListener("keyup", (event) => {
        if(event.key.toUpperCase() === "H") {
            historyButton.classList.remove("pressed");
        }
    });

    function clearHistory() {
        localStorage.setItem("history", "");
        historyPanelEntries.innerHTML = `<p class="calculator__history-empty">Your history log is empty!</p>`;
    }
}

function toggleHistoryPanel() {
    historyButton.classList.toggle("history-active");
    historyPanel.classList.toggle("history-panel-active");
    historyPanelEntries.classList.toggle("entries-active");
    historyPanelHeader.classList.toggle("history-header-active");
    calcButtonsContainer.classList.toggle("mobile-active");
    calcPanel.classList.toggle("mobile-active");

    if(historyClicked) {
        historyCloseButton.style.setProperty("animation", "fade-out 0.25s forwards");
        historyClicked = false;
        sessionStorage.setItem("HistoryPanelOpen", false);

        historyPanel.classList.remove("history-panel-mobile-fade-in");
        historyPanel.classList.remove("history-panel-mobile-fade-out");
    }
    else {
        historyCloseButton.style.setProperty("animation", "fade-in 0.5s forwards");
        historyClicked = true;
        sessionStorage.setItem("HistoryPanelOpen", true);
    }
}

function toggleHistoryAnimation(resize = false) {

    if(resize) {
        historyPanel.style.setProperty("animation", "none");
        calcPanel.style.setProperty("animation", "none");
        calcButtonsContainer.style.setProperty("animation", "none");
        return;
    }

    if(window.innerWidth < 768) {
        if(historyClicked) {
            historyPanel.style.setProperty("animation", "hide-history-panel-mobile 0.75s forwards");
            calcPanel.style.setProperty("animation", "slide-up 0.85s forwards");
            calcButtonsContainer.style.setProperty("animation", "show-buttons-mobile 0.85s forwards");
        }
        else {
            historyPanel.style.setProperty("animation", "show-history-panel-mobile 0.75s forwards");
            calcPanel.style.setProperty("animation", "slide-down 0.75s forwards");
            calcButtonsContainer.style.setProperty("animation", "hide-buttons-mobile 0.75s forwards");
        }
    }
    else {
        calcPanel.style.setProperty("animation", "none");
        calcButtonsContainer.style.setProperty("animation", "none");
        if(historyClicked) {
            historyPanel.style.setProperty("animation", "hide-history-panel 0.35s 0.05s backwards");
        }
        else {
            historyPanel.style.setProperty("animation", "show-history-panel 0.35s forwards");
        }
    }
}

/**********************************************************************************/
/*                            Keyboard Shortcuts Panel                            */
/**********************************************************************************/

function initKeyboardShortcuts() {
    const keyboardShortcutsButton = document.querySelector(".keyboard-shortcuts__btn");
    const keyboardShortcutsPanel = document.querySelector(".keyboard-shortcuts__panel");
    const keyboardShortcutsCloseButton = document.querySelector(`#close-keyboard-shortcuts`);

    let keyboardShortcutsClicked = false;
    keyboardShortcutsOpen = true;

    if(JSON.parse(sessionStorage.getItem("KeyboardShortcutsOpen"))) toggleKeyboardShortcuts();
    keyboardShortcutsButton.addEventListener("click", toggleKeyboardShortcuts);

    //keyboard integration
    window.addEventListener("keydown", (event) => {
        if(isDesktop && !event.repeat && event.key.toUpperCase() === "K") {
            keyboardShortcutsButton.classList.add("pressed");
            toggleKeyboardShortcuts();
        }
    });

    window.addEventListener("keyup", (event) => {
        if(event.key.toUpperCase() === "K") {
            keyboardShortcutsButton.classList.remove("pressed");
        }
    });
    
    function toggleKeyboardShortcuts() {
        keyboardShortcutsPanel.classList.toggle("panel-active");
        keyboardShortcutsButton.classList.toggle("keyboard-shortcuts-active");

        document.documentElement.style.setProperty("--KEYBOARD-SHORTCUTS-HEIGHT", 
        `${keyboardShortcutsBody.offsetHeight + keyboardShortcutsHead.offsetHeight + 2 * getRealValue("", "var(--SPACING-MD)")}px`);

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
        
        drawKeyboardShortcutLines();
    }
}

function drawKeyboardShortcutLines() {
    const shortcutKeys = document.querySelectorAll(".kbd");
    const shortcutLines = document.querySelectorAll("td .line");

    for(let i = 0; i < shortcutKeys.length; i++) {
        shortcutLines[i].style.setProperty("width", "0");
        let spacing_md = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--SPACING-MD"));
        let stopLength = shortcutKeys[i].offsetLeft + shortcutKeys[i].offsetWidth;
        
        if(isNaN(spacing_md)) {
            spacing_md = Math.max(16, getRealValue(0.5, "vmin"));
            stopLength += spacing_md;
        }
        else {
            stopLength += (spacing_md * 16 * 2);
        }

        const newWidth = shortcutLines[i].offsetLeft - stopLength;
        shortcutLines[i].style.setProperty("width", newWidth + "px");
    }
}

function getRealValue(value, unit) {
    const dummy = document.createElement('div');
    dummy.style.fontSize = `${value}${unit}`;
    document.body.appendChild(dummy);
    const computedValue = window.getComputedStyle(dummy).fontSize;
    document.body.removeChild(dummy);
    return parseFloat(computedValue);
}

/**********************************************************************************/
/*                                 Mobile Options                                 */
/**********************************************************************************/

const mobileOptionsPanel = document.querySelector(".mobile-options__panel");
const mobileOptionsCover = document.querySelector(".mobile-options__cover");

initMobileOptions();

function initMobileOptions() {
    const mobileOptionsBtn = document.querySelector(".mobile-options__button");

    mobileOptionsBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        toggleMobileOptions();
    });

    //click away
    window.addEventListener("click", () => {
        if(mobileOptionsPanel.classList.contains("panel-active") && window.innerWidth < 768) {
            mobileOptionsPanel.classList.remove("panel-active");
            mobileOptionsCover.classList.remove("panel-active");
        }
    });
}

function toggleMobileOptions() {
    mobileOptionsPanel.classList.toggle("panel-active");
    mobileOptionsCover.classList.toggle("panel-active");
}
} // initApp()'s closing bracket