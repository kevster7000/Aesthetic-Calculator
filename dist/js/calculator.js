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
            
            do { //check operand for only one decimal
                if(i > currExp.length) break;
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

export function validateExpression(exp) { //this was simple :o
    if(["(", "-", "^", "\u00D7", "\u00F7", "+"].includes(exp[exp.length - 1])) return false;
    if(exp[exp.length - 1] === '.' && isNaN(exp[exp.length - 2])) return false;
    return true;
}

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
    exp = exp.replaceAll(" ", "");

    //this is just to make it easier for me
    exp = exp.replaceAll("\u00D7", "*");
    exp = exp.replaceAll("\u00F7", "/");

    //match parentheses
    const openParanthesisNum = exp.split("(").length - 1;
    let closeParanthesisNum = exp.split(")").length - 1;
    while(openParanthesisNum > closeParanthesisNum++) {
        exp += ")";
    }

    //make all x(x) into x * (x)  and (x)(x) into (x) * (x)
    const parenthesisToMultiplyRegex = /[%\d]\(|\)\(/g;
    while(true) {
        let i = exp.search(parenthesisToMultiplyRegex);

        if(i === -1) break;
        else {
            exp = exp.slice(0, i + 1) + "*" + exp.slice(i + 1);
        }
    }

    //make all x. into x and .x into 0.x
    const simplifyDecimalRegex = /\d\.\D|\D\.\d/g;
    while(true) {
        let i = exp.search(simplifyDecimalRegex);

        if(i === -1) break;
        else if(isNaN(exp[i])){
            exp = exp.slice(0, i + 1) + "0" + exp.slice(i + 1);
        }
        else {
            exp = exp.slice(0, i + 1) + exp.slice(i + 2);
        }
    }
    //edge cases
    if(exp[0] === ".") exp = "0" + exp;
    if(exp[exp.length - 1] === ".") exp = exp.slice(0, exp.length - 1);


    //make all x% into 0.0x
    const convertBasicPercentageRegex = /\d+(\.\d+)?\%/g;
    while(true) {
        let i = exp.search(convertBasicPercentageRegex);
        if(i === -1) break;

        const start = i;
        let num = "";
        while(exp[i] != "%") {
            num += exp[i];
            i++;
        }
        num = Number(num) / 100;
        exp = exp.slice(0, start) + num + exp.slice(i + 1);
    }

    //make all (...)% into ((...)/100)
    while(true) {
        let i = exp.indexOf(")%");
        if(i === -1) break;

        const end = i + 1;
        let numCloseParenthesis = 1;
        let numOpenParenthesis = 0;

        while(numOpenParenthesis !== numCloseParenthesis) {
            i--;
            if(exp[i] === ")") numCloseParenthesis++;
            else if(exp[i] === "(") numOpenParenthesis++;
        }

        exp = exp.slice(0, i) + "(" + exp.slice(i, end) + "/100)" + exp.slice(end + 1);
    }

    return exp;
}

function infixToPostfix(exp) { //Stacks :)

    //TODO

    return exp;
}

function postfixToOutput(exp) { //More Stack usage :)

    let output = exp;
    //TODO

    return output;
}