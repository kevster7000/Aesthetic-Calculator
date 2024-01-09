export function handleInput(btn, currExp) {

    //this most likely can be optimized with regex, but there are many nuances from a typical expression that idk how to write in regex, so I just hardcoded this
    //ik this is very ugly, sry

    let newExp = currExp;
    currExp = currExp.replaceAll(" ", ""); //bye whitespace

    const validOperands = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."]
    const validOperators = ["(", ")", "%", "-", "^", "\u00D7", "\u00F7", "+"];

    const completeParenthesis = currExp[currExp.length - 1] === ")" && currExp !== "(";
    const prevCharOperand = validOperands.includes(currExp[currExp.length - 1]) || currExp[currExp.length - 1] === '%' || completeParenthesis;

    // multiplication is \u00D7
    // division is \u00F7
    // nbsp is \u00A0

    if(validOperands.includes(btn)) { // OPERANDS
        
        if(currExp === "\u00A0") {
            newExp = btn;
        }
        else if (btn === '.') {
            let i = 1;
            let validDecimal = true;
            
            do {
                if(i >= currExp.length) break;
                else if(currExp[currExp.length - i] === '.' || currExp[currExp.length - i] === '%' || currExp[currExp.length - i] === ')' || !validOperands.includes(currExp[currExp.length - i])) {
                    validDecimal = false;
                    break;
                }
                i++;
            } while (validOperands.includes(currExp[currExp.length - i]));

            if(validDecimal) newExp += btn;
            else if(validOperators.slice(3).includes(currExp[currExp.length - 1])) newExp += " " + btn;
        }
        else if(validOperators.slice(3).includes(currExp[currExp.length - 1])) {
            //handle negative
            if(currExp[currExp.length - 1] === '-' && (currExp === "-" || currExp.slice(currExp.length - 2) === "(-" || validOperators.slice(3).includes(currExp[currExp.length - 2]))) {
                newExp += btn;
            }
            else newExp += " " + btn;
        }
        else if(currExp[currExp.length - 1] !== ')' && currExp[currExp.length - 1] !== '%') {
            newExp += btn;
        }
    }
    else if(validOperators.slice(4).includes(btn)) { // BASIC OPERATORS ^ * / +

        if(prevCharOperand) newExp += " " + btn;
        else if(validOperators.slice(3).includes(currExp[currExp.length - 1]) && !validOperators.slice(3).includes(currExp[currExp.length - 2])) {
            newExp = newExp.slice(0, newExp.length - 1) + btn;
        }
    } 
    else if(btn === '-') { // MORE DETAILED OPERATORS ( ) % -

        if(currExp[currExp.length - 1] === "+") newExp = newExp.slice(0, newExp.length - 1) + btn;
        else if(prevCharOperand || (validOperators.slice(4).includes(currExp[currExp.length - 1]) && !validOperators.slice(4).includes(currExp[currExp.length - 2]))) {
            newExp += " " + btn;
        }
        else if(currExp === "\u00A0") newExp = btn;
        else if(currExp[currExp.length - 1] === '(') newExp += btn;
    }
    else if(btn === '(') { 
        if(validOperators.slice(3).includes(currExp[currExp.length - 1])) newExp += " " + btn;
        else newExp += btn;
    }
    else if(btn === ")") {
        if( (currExp.split("(").length > currExp.split(")").length) && 
            (validOperands.includes(currExp[currExp.length - 1]) || currExp[currExp.length - 1] === '%' || currExp[currExp.length - 1] === ')')) {
            newExp += btn;
        }
    }
    else if(btn === "%") {
        if(prevCharOperand && currExp[currExp.length - 1] !== "%") newExp += btn;
    }
    else {
        console.error(`No such input: ${btn}`);
    }
    
    return newExp;
}

export function handleKeyboardInput() {

    //maneuvering between buttons is done in navigation.js, not here ty

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

    return true;
}

/* FOR REGEX, use a while loop until end of input string
add each char to a temp string until we hit an operator such as (), +, -, etc
Then, use regex to make sure this temp string is correctly formatted

Example of regex for now: [0-9]*.[0-9]+[ ]*[+ or - or ...]
*/

export function handleSubmit(exp) {
    let output = postfixToOutput(infixToPostfix(parseToInfix(exp)));

    /*
    - The output should have a max number of digits
    - Limit the width to a certain amount of characters
    - use e notation when numbers get too big and when numbers get too small
    - At a certain point, say the number is too large(infinity) or (when the number is too small) just 0

    //num.toExponential(decimal points)
    */

    return output;
}

function parseToInfix(exp) {

    //TODO - make all x(x) into x * (x) - all x. into x - all .x into 0.x
    /* 
        as for %, this is a bit tricky
        if next to operand x%, then directly change x into x*.01
        if next to ), such as (x)% add: / 100)
            the open parenthis - count the number of ) and match with (, then add another ( right outside the matching (

        ex: (1+2)% => ((1+2)/100)
        ex: (1+(2+3))% => ((1+(2+3))/100)
    */


    return exp;
}

function infixToPostfix(exp) { //Stacks :)

    //TODO

    return exp;
}

function postfixToOutput(exp) { //More Stack usage :)

    //TODO

    return exp;
}