import themes, {colorVariables} from "./themes.js";
import * as Calc from "./calculator.js";

document.addEventListener("DOMContentLoaded", () => {
    initApp();
})

function initApp() {

/**********************************************************************************/
/*                                     Themes                                     */
/**********************************************************************************/

// TODO - create a click away function.
// IF themes panel is open and the user clicks outside of it, the panel will close

initThemes();

function initThemes() {
    const themesButton = document.querySelector(".themes__btn");
    const themesPanel = document.querySelector(".themes__panel");
    const themesCloseButton = document.querySelector(`#close-themes`);

    let themeClicked = false;

    themesButton.addEventListener("click", () => {
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
    });

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

    let contFromPrevExpression = false;

    initCalcPanel();
    initCalcButtons();

    // TODO both css and js - the main input will have a scroll only if the user is typing; once enter or submit, the main is only limited to its width aka no scrollbar
    function initCalcPanel() {
        if(panelOutputPrev.scrollWidth > panelOutputPrev.clientWidth) { // check to see if horizontal scrollbar is visible
            panelOutputPrev.style.setProperty("margin-bottom", "0");
        }
    }

    function initCalcButtons() {

        //operands & operators
        for(let i = 0; i < 2; i++) {
            for(let j = 0; j < calcButtons[i].length; j++) {
                calcButtons[i][j].addEventListener("click", (event) => {
                    panelOutputMain.textContent = Calc.handleInput(event.target.textContent, panelOutputMain.textContent);
                });
            }
        }

        //delete
        calcButtons[2][0].addEventListener("click", () => {
            if(panelOutputMain.textContent.length <= 1) {
                panelOutputMain.textContent = "\u00A0";
            }
            else {
                panelOutputMain.textContent = panelOutputMain.textContent.slice(0, panelOutputMain.textContent.length - 1);
            }
        });

        //clear
        calcButtons[2][1].addEventListener("click", () => {
            panelOutputMain.textContent = "\u00A0";
            panelOutputPrev.textContent = "\u00A0";
        });

        //equals
        calcButtons[2][2].addEventListener("click", () => {
            panelOutputPrev.textContent = panelOutputMain.textContent;
            panelOutputMain.textContent = Calc.handleSubmit(panelOutputMain.textContent);
        });
    }
}

/**********************************************************************************/
/*                                    History                                     */
/**********************************************************************************/

// TODO add a session storage to the history panel and load it as open/closed based on the session storage

initHistory();

function initHistory() {
    const historyButton = document.querySelector("#calculator-history-btn");
    const historyCloseButton = document.querySelector("#close-history");
    const historyPanel = document.querySelector(".calculator__history");
    const historyPanelEntries = document.querySelector(".calculator__history-entries");
    const historyPanelHeader = document.querySelector(".calculator__history-header");
    let historyClicked = false;

    historyButton.addEventListener("click", () => {
        historyButton.classList.toggle("history-active");
        historyPanel.classList.toggle("history-panel-active");
        historyPanelEntries.classList.toggle("entries-active");
        historyPanelHeader.classList.toggle("history-header-active");

        if(historyClicked) {
            historyCloseButton.style.setProperty("animation", "fade-out 0.25s forwards");
            historyClicked = false;
        }
        else {
            historyCloseButton.style.setProperty("animation", "fade-in 0.5s forwards");
            historyClicked = true;
        }
    });

    const entryInputs = document.querySelectorAll(".entry-input");
    
    for(let i = 0; i < entryInputs.length; i++) {
        if(entryInputs[i].scrollWidth > entryInputs[i].clientWidth) { // check to see if horizontal scrollbar is visible
            entryInputs[i].style.setProperty("margin-bottom", "0");
        }
    }
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
/*                             Keyboard Shortcuts                                 */
/**********************************************************************************/

// TODO add a session storage to the keyboard shortcut panel and it them as open/closed based on the session storage

// TODO - create a click away function.
// IF themes panel is open and the user clicks outside of it, the panel will close

initKeyboardShortcuts();

function initKeyboardShortcuts() {
    const keyboardShortcutsButton = document.querySelector(".keyboard-shortcuts__btn");
    const keyboardShortcutsPanel = document.querySelector(".keyboard-shortcuts__panel");
    const keyboardShortcutsCloseButton = document.querySelector(`#close-keyboard-shortcuts`);

    let keyboardShortcutsClicked = false;
    let linesDrawn = false;

    keyboardShortcutsButton.addEventListener("click", () => {
        keyboardShortcutsPanel.classList.toggle("panel-active");
        keyboardShortcutsButton.classList.toggle("keyboard-shortcuts-active");

        if(keyboardShortcutsClicked) {
            keyboardShortcutsCloseButton.style.setProperty("animation", "fade-out 0.25s forwards");
            keyboardShortcutsClicked = false;
        }
        else {
            keyboardShortcutsCloseButton.style.setProperty("animation", "fade-in 0.5s forwards");
            keyboardShortcutsClicked = true;
        }

        if(!linesDrawn) {
            drawKeyboardShortcutLines();
            linesDrawn = true;
        }
    });
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

function initSettings() {
    const settingsButton = document.querySelector("#open-settings");
    const settingsPanel = document.querySelector(".settings__panel");

    settingsButton.addEventListener("click", () => {
        settingsPanel.classList.toggle("panel-active");
    });
}

} // initApp()'s closing bracket