import themes, {colorVariables} from "./themes.js";
import * as Calc from "./calculator.js";

document.addEventListener("DOMContentLoaded", initApp);

function initApp() {

/**********************************************************************************/
/*                                     Themes                                     */
/**********************************************************************************/

initThemes();

function initThemes() {
    const themesContainer = document.querySelector(".themes");
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

initCalc();

function initCalc() {

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

    initCalcButtons();

    function initCalcButtons() {
        //operands & operators
        for(let i = 0; i < 2; i++) {
            for(let j = 0; j < calcButtons[i].length; j++) {
                calcButtons[i][j].addEventListener("click", (event) => {

                    if(exponentialStopPoint !== -1 && panelOutputMain.textContent.length === exponentialStopPoint && ["(", "%", "-", "^", "\u00D7", "\u00F7", "+"].includes(event.target.textContent)) {
                        panelOutputMain.textContent = "(" + panelOutputMain.textContent + ")";
                        exponentialStopPoint += 2;
                    }

                    panelOutputMain.textContent = Calc.handleInput(event.target.textContent, panelOutputMain.textContent, justSubmitted);

                    if(panelOutputMain.textContent.length < exponentialStopPoint) {
                        exponentialStopPoint = -1;
                    }
                    if(justSubmitted && !(panelOutputMain.textContent.length === exponentialStopPoint && event.target.textContent === ")")) {
                        panelOutputPrev.textContent = "\u00A0";
                        justSubmitted = false;
                    }
                    checkCalcPanelScroll();
                });
            }
        }

        //delete
        calcButtons[2][0].addEventListener("click", () => {
            if(panelOutputMain.textContent.length <= 1) {
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
        });

        //clear
        calcButtons[2][1].addEventListener("click", () => {
            panelOutputMain.textContent = "\u00A0";
            panelOutputPrev.textContent = "\u00A0";
            exponentialStopPoint = -1;
            justSubmitted = false;
            checkCalcPanelScroll();
        });

        //equals
        calcButtons[2][2].addEventListener("click", () => {
            clearTimeout(fadeError);
            errorMessage.style.setProperty("animation", "unset");
            void errorMessage.offsetWidth; //the only line i copied from ChatGPT - smth ab resetting this element on the DOM, idk but it works

            if(Calc.validateExpression(panelOutputMain.textContent)) {
                panelOutputPrev.textContent = panelOutputMain.textContent;
                panelOutputMain.textContent = Calc.handleSubmit(panelOutputMain.textContent);
                justSubmitted = true;

                if(panelOutputMain.scrollWidth > panelOutputMain.clientWidth && panelOutputMain.textContent.includes(".")) { //fit width
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
                //addHistoryEntry(panelOutputPrev.textContent, panelOutputMain.textContent);
            }
            else {
                errorMessage.style.setProperty("animation", "fade-out 2.25s ease-in");
                fadeError = setTimeout(() => errorMessage.style.setProperty("animation", "unset"), 2250);
            }
            checkCalcPanelScroll();
        });
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
}

/**********************************************************************************/
/*                                    History                                     */
/**********************************************************************************/

initHistory();

function initHistory() {
    const historyButton = document.querySelector("#calculator-history-btn");
    const historyCloseButton = document.querySelector("#close-history");
    const historyPanel = document.querySelector(".calculator__history");
    const historyPanelEntries = document.querySelector(".calculator__history-entries");
    const historyPanelHeader = document.querySelector(".calculator__history-header");
    const historyClearBtn = historyPanelHeader.querySelector("button");
    let historyClicked = false;

    loadHistory();

    historyClearBtn.addEventListener("click", clearHistory);
    historyButton.addEventListener("click", toggleHistoryPanel);
    if(JSON.parse(sessionStorage.getItem("HistoryPanelOpen"))) toggleHistoryPanel(); //TODO - disable this for mobile

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
        loadHistory();
    }
}

function loadHistory() {
    if(localStorage.getItem("history")) {
        /*
        let entries = JSON.parse(localStorage.getItem("history"));
        for(let i = 0; i < entries.length) {
            addHistoryEntry(entries[i]);
        }
        */
        checkEntriesScroll();
    }
    else {
        // TODO add an empty text in the history panel
    }


    function checkEntriesScroll() {
        const entryInputs = document.querySelectorAll(".entry-input");
        
        for(let i = 0; i < entryInputs.length; i++) {
            if(entryInputs[i].scrollWidth > entryInputs[i].clientWidth) {
                entryInputs[i].style.setProperty("margin-bottom", "0.25px");
            }
            else {
                entryInputs[i].style.setProperty("margin-bottom", "3px");
            }
        }
    }
}

/* this function is used in the calculator section :)
takes an obj: {
    date: new Date(), 
    input: string, 
    output: string
} */


// TODO - YO SHIT VERY MESSY KEV GET YO SELF TOGETHER - draw it out or sum idk but this code u got for history is absolutely nefariously dogpoo


function addHistoryEntry(newEntry) {
    let entries = JSON.parse(localStorage.getItem("history"));

    const entryTemplate = `
        <div id="entry${newEntry.date.getTime()}" class="calculator__history-entry">
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
    
        //TODO
    
    // two things - create a new element and store the time/input/ouput in local storage !!!!!!!important local storage, not session
    // everytime the page loads, load the calc history too -> TODO - add it to initHistory()
    // the time is gonna be mm/dd/yyyy hh:mm XM
    // as for the key, idk yet
    // storing the data, idk either; maybe just an array of objects
    

    // anywho, every entry is a new element that has two event listeners - copy and delete - very self explanatory
}

/* 
    everytime the user hits enter or clicks =, if no error, store the displayed expression string as the key and the result as the value in session storage
    If the user hits the history button, display all of these key/value pairs in session storage on the side of the calculator.
*/

/* 
CLicking on an entry in the history panel will copy it to the calculator
each entry should also have an option to delete

At the top of the history panel, there should be a clear button that really just clears the session storage

Once the window gets too small for the history panel to open up on the side, it will instead be integrated into the calculator.
Sort of like a dropdown, the history panel will slide down from the top of the calculator, but leaves the calculator panel visible.

*/

/**********************************************************************************/
/*                                Button Navigation                               */
/**********************************************************************************/

// TODO create a new js file for this 2D array of stuff - also search up HTML tabindex
// For all buttons, Remove the fact that you can hit enter and it clicks (only spacebar and click to hit a button)
// instead, enter will submit the current expression at all times

/**********************************************************************************/
/*                            Keyboard Shortcuts Panel                            */
/**********************************************************************************/

initKeyboardShortcuts();

function initKeyboardShortcuts() {
    const keyboardShortcutsButton = document.querySelector(".keyboard-shortcuts__btn");
    const keyboardShortcutsPanel = document.querySelector(".keyboard-shortcuts__panel");
    const keyboardShortcutsCloseButton = document.querySelector(`#close-keyboard-shortcuts`);

    let keyboardShortcutsClicked = false;
    let linesDrawn = false;

    if(JSON.parse(sessionStorage.getItem("KeyboardShortcutsOpen"))) toggleKeyboardShortcuts(); //TODO - disable this for mobile
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