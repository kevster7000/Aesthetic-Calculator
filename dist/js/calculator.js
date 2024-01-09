export function handleInput(btn, currExp) {

    //this most likely can be optimized with regex, but there are many nuances from a typical expression that I could not write in the regex, so I just hardcoded this
    //ik this is very ugly, sry

    let newExp = currExp;
    currExp = currExp.replaceAll(" ", ""); //bye whitespace

    const validOperands = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."]
    const validOperators = ["(", ")", "%", "-", "^", "\u00D7", "\u00F7", "+"];

    const prevCharOperand = validOperands.includes(currExp[currExp.length - 1]);

    // multiplication is \u00D7
    // division is \u00F7
    // nbsp is \u00A0

    if(validOperands.includes(btn)) { // OPERANDS

        //TODO - decimal - i completely forgot dummy - only one decimal per operand
        
        if(currExp === "\u00A0") newExp = btn;
        else if(validOperators.slice(3).includes(currExp[currExp.length - 1])) {
            if(currExp[currExp.length - 1] === '-' && (currExp === "-" || currExp.slice(currExp.length - 2) === "(-" || validOperators.slice(3).includes(currExp[currExp.length - 2]))) newExp += btn;
            else newExp += " " + btn;
        }
        else if(currExp[currExp.length - 1] !== ')') newExp += btn;
    }
    else if(validOperators.slice(4).includes(btn)) { // BASIC OPERATORS ^ * / +

        if(prevCharOperand) newExp += " " + btn;
        else if(validOperators.slice(3).includes(currExp[currExp.length - 1]) && !validOperators.slice(3).includes(currExp[currExp.length - 2])) {
            newExp = newExp.slice(0, newExp.length - 1) + btn;
        }
    } 
    else if(btn === '-') { // MORE DETAILED OPERATORS ( ) % -

        if(prevCharOperand || (validOperators.slice(3).includes(currExp[currExp.length - 1]) && !validOperators.slice(3).includes(currExp[currExp.length - 2]))) newExp += " " + btn;
        else if(currExp === "\u00A0") newExp = btn;
        else if(currExp[currExp.length - 1] === '(') newExp += btn;
    }
    else if(btn === '(') {

        //this was simple :O
        newExp += btn;
    }
    else if(btn === ")") {
        const checkParathesisCount = currExp.split("(").length > currExp.split(")").length;
        const completeParanthesis = prevCharOperand || currExp[currExp.length - 1] === "%";

        //TODO
        
        newExp += btn;

    }
    else if(btn === "%") {

        //TODO

        if(prevCharOperand || completeParanthesis) {
            newExp += btn;
        }

    }
    else {
        console.error(`No such input: ${btn}`);
    }
    
    return newExp;
}

export function handleKeyboardInput() {

    //maneuvering between buttons is done in keyboard.js, not here ty

    const validOperands = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."]
    const validOperators = ["(", ")", "%", "-", "^", "*", "/", "+"];

    const specialCalcKeys = ["Enter", "backspace", "Esc"];
    const keyboardShortcuts = ["N", "K", "H", "T", "S"]

    // multiplication is * => make sure to pass \u00D7
    // division is / => make sure to pass \u00F7
    // nbsp is \u00A0

    //TODO - utilize the above function and add some keyabord shortcuts

    /*window.addEventListener("keydown", (event) => { //the event listener goes in main
        if(validKeys.includes(event.key)) { //this is where the handleKeyboardInput() func goes in main
            //error handling //this error handling is the purpose of this function
    
            
        }

    });*/
    console.log("keyboard input");
}

export function validateExpression(exp) {

    //TODO - regex?

    return false;
}

/* FOR REGEX, use a while loop until end of input string
add each char to a temp string until we hit an operator such as (), +, -, etc
Then, use regex to make sure this temp string is correctly formatted

Example of regex for now: [0-9]*.[0-9]+[ ]*[+ or - or ...]
*/

export function handleSubmit(exp) {
    return postfixToOutput(infixToPostfix(parseToInfix(exp)));
}

function parseToInfix(exp) {

    //TODO - make all % into / 100 - all x(x) into x * (x) - all x. into x - all .x into 0.x

    return exp;
}

function infixToPostfix(exp) { //Stack :)

    //TODO

    return exp;
}

function postfixToOutput(exp) { //More Stack usage :)

    //TODO

    return exp;
}