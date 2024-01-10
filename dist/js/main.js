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

    // TODO - create a click away function.
    // IF themes panel is open and the user clicks outside of it, the panel will close
    /* window.addEventListener("click", (event) => {
        if(themesPanel.classList[1] === "panel-active" && 
            ((event.clientX < themesContainer.offsetLeft || event.clientX > themesContainer.offsetLeft + themesContainer.offsetWidth) || 
            (event.clientY < themesContainer.offsetTop || event.clientY > themesContainer.offsetTop + themesContainer.offsetHeight))) {
            console.log("asd");
            //toggleThemesPanel();
        }
    }) */

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

    // TODO - set true everytime you submit - if the user then hits an operator, save the output, but delete the prev
    // if the user hits an operand, delete the output and prev
    let contFromPrevExpression = false;

    initCalcButtons();

    function initCalcButtons() {
        //operands & operators
        for(let i = 0; i < 2; i++) {
            for(let j = 0; j < calcButtons[i].length; j++) {
                calcButtons[i][j].addEventListener("click", (event) => {
                    panelOutputMain.textContent = Calc.handleInput(event.target.textContent, panelOutputMain.textContent);

                    //check to see if thousands separator is true, then create a new function to add commas at the end in here
                    
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
                if(panelOutputMain.textContent[panelOutputMain.textContent.length - 2] === ' ') {
                    panelOutputMain.textContent = panelOutputMain.textContent.slice(0, panelOutputMain.textContent.length - 2);
                }
                else {
                    panelOutputMain.textContent = panelOutputMain.textContent.slice(0, panelOutputMain.textContent.length - 1);
                }
            }
            checkCalcPanelScroll();
        });

        //clear
        calcButtons[2][1].addEventListener("click", () => {
            panelOutputMain.textContent = "\u00A0";
            panelOutputPrev.textContent = "\u00A0";
            checkCalcPanelScroll();
        });

        //equals
        calcButtons[2][2].addEventListener("click", () => {
            clearTimeout(fadeError);
            errorMessage.style.setProperty("animation", "unset");
            void errorMessage.offsetWidth;

            if(Calc.validateExpression(panelOutputMain.textContent)) {
                panelOutputPrev.textContent = panelOutputMain.textContent;
                panelOutputMain.textContent = Calc.handleSubmit(panelOutputMain.textContent);

                //check to see if thousands separator is true, then create a new function (in calculator.js) to add commas

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
    let historyClicked = false;

    if(JSON.parse(sessionStorage.getItem("HistoryPanelOpen"))) toggleHistoryPanel(); //TODO - disable this for mobile
    historyButton.addEventListener("click", toggleHistoryPanel);

    function toggleHistoryPanel() {
        historyButton.classList.toggle("history-active");
        historyPanel.classList.toggle("history-panel-active");
        historyPanelEntries.classList.toggle("entries-active");
        historyPanelHeader.classList.toggle("history-header-active");

        checkEntriesScroll();

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

//this function is used in the calculator section :)
function addHistoryEntry(input, output) {
    console.log("TODO headass");
    
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

// USE session storage to store history


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

/**********************************************************************************/
/*                                    Settings                                    */
/**********************************************************************************/

initSettings();

// TODO - create a click away function.
// IF themes panel is open and the user clicks outside of it, the panel will close

//TODO - thousands separator - this affects the calculator panel
//by default, thousands separator is used (stopped by the decimal point)

function initSettings() {
    const settingsButton = document.querySelector("#open-settings");
    const settingsPanel = document.querySelector(".settings__panel");

    settingsButton.addEventListener("click", () => {
        settingsPanel.classList.toggle("panel-active");
    });
}

} // initApp()'s closing bracket