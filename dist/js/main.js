import themes, {colorVariables} from "./themes.js";

/**********************************************************************************/
/*                                     Themes                                     */
/**********************************************************************************/

initThemes();

function initThemes() {
    const themesButton = document.querySelector(".themes__btn");
    const themesPanel = document.querySelector(".themes__panel");
    themesButton.addEventListener("click", () => {
        themesPanel.classList.toggle("active");
    })

    setThemes(getTheme());
}

function getTheme() {
    return localStorage.getItem("theme") ?? "white";
}

function setThemes(themeStored) {
    const themesContainer = document.querySelector(".themes__panel");
    Object.keys(themes).forEach((theme) => {

        // themesContainer.innerHTML += `<div id="${theme}" class="themes__panel-option" style="background-color: ${themes[theme][0]}">`;

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
        themeCurrent.style.setProperty("backgroundColor", themeColors[0]);
        themeCurrent.title = incTheme;
        localStorage.setItem("theme", incTheme);
    }
}

/**********************************************************************************/
/*                                Calculator Input                                */
/**********************************************************************************/

let input = document.querySelector("#userInput");


/* everytime they hit an arithmetic button, add onto the string in the display panel
use this string for calculating and parsing */

/* everytime they hit enter, parse the string
    if there is an error - do not calculate, instead say that there is an error and make the region red:
    FOR EXAMPLE: 50 * 5 1, the 5 1 is an error, so both numbers should turn red (--COLOR-ERROR)

    Also check for excessive characters
    DO NOT ALLOW THE USER TO DO THE following:
    - type spaces (make character space large in textfield so that it looks like there are automatic spacing between characters)
    - type multiple decimals per operand
    - type consecutive operators (they may swap operators though)

    - only allow decimals to be typed once per operand, never anywhere else
    - more error handling

    - USE REGEX !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


    PEMDAS - use it all - parenthesis, exponent, mul, div, add, sub

    If no error:
    WE WILL be using (), So make sure always check for () first - same amount of ( and )
    Next we will convert the string expression from infix to postfix (221) - uses a stack for operators 
    Then, we will evaluate this postfix expressiosn by using a stack for operators
*/

/* FOR REGEX, use a while loop until end of input string
add each char to a temp string until we hit an operator such as (), +, -, etc
Then, use regex to make sure this temp string is correctly formatted

Example of regex for now: [0-9]*.[0-9]+[ ]*[+ or - or ...]
*/



/* also make the user able to type any of the buttons such as , +, -, enter, etc rather than having to click everything*/
const validKeys = ['']
window.addEventListener("keydown", (event) => {
    if(validKeys.includes(event.key)) {
        //error handling

        
    }
});


/* also allow the display panel to be contenteditable so that the user can click and edit the text */


/* also make a history section
    everytime the user hits enter or clicks =, if no error, store the displayed expression string as the key and the result as the value in session storage
    If the user hits the history button, display all of these key/value pairs in session storage on the side of the calculator.
*/

// USE session storage to store history