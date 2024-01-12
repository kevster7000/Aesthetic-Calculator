//using Big.js: https://mikemcl.github.io/big.js/
Big.DP = 30;
Big.PE = 16;
Big.NE = -7;

const validOperands = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."];
let exponentialStore = "";

export function handleInput(btn, currExp, justSubmitted) {

    //this most likely can be optimized with regex, but there are many nuances from a typical expression that idk how to write in regex, so I just hardcoded this
    //ik this is very ugly, sry

    let newExp = currExp;
    currExp = currExp.replaceAll(" ", "");

    const validOperators = ["(", ")", "%", "-", "^", "\u00D7", "\u00F7", "+"];

    const completeParenthesis = currExp[currExp.length - 1] === ")" && currExp !== "(";
    const prevCharOperand = validOperands.includes(currExp[currExp.length - 1]) || currExp[currExp.length - 1] === '%' || completeParenthesis;

    // multiplication is \u00D7
    // division is \u00F7
    // nbsp is \u00A0

    if(validOperands.includes(btn)) { // OPERANDS
        
        if(currExp === "\u00A0" || justSubmitted) { //if empty
            newExp = btn;
        }
        else if(btn === '0' && currExp[currExp.length - 1] === "0") { //make sure no excessive 0s
            let i = 1;
            let validZero = false;

            do {
                if(i > currExp.length) break;
                if(currExp[currExp.length - i] !== "0") {
                    validZero = true; 
                    break;
                }
                i++;
            } while (validOperands.includes(currExp[currExp.length - i]));

            if(validZero) newExp += btn;
        }
        else if (btn === '.') { //makes sure only one . per operand
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
        else if(validOperators.slice(3).includes(currExp[currExp.length - 1])) { //following an operator
            //handle negative
            if(currExp[currExp.length - 1] === '-' && (currExp === "-" || currExp.slice(currExp.length - 2) === "(-" || validOperators.slice(3).includes(currExp[currExp.length - 2]))) {
                newExp += btn;
            }
            else if(currExp[currExp.length - 1] === '^') newExp += btn;
            else newExp += " " + btn;
        }
        else if(currExp[currExp.length - 1] !== ')' && currExp[currExp.length - 1] !== '%') { //following an operand
            if((validOperators.includes(currExp[currExp.length - 2]) && currExp[currExp.length - 1] === "0") || currExp === "0") newExp = newExp.slice(0, newExp.length - 1) + btn;
            else newExp += btn;
        }
    }
    else if(validOperators.slice(4).includes(btn)) { // BASIC OPERATORS ^ * / +

        if(prevCharOperand) { //folliwng an operand
            if(btn === "^") newExp += btn;
            else newExp += " " + btn;
        }
        else if(validOperators.slice(3).includes(currExp[currExp.length - 1]) && !validOperators.slice(3).includes(currExp[currExp.length - 2]) && currExp.slice(currExp.length - 2, currExp.length) !== "(-" && currExp != "-") { //switching operators
            newExp = newExp.slice(0, newExp.length - 1) + btn;
        }
    } 
    else if(btn === '-') { // MORE DETAILED OPERATORS ( ) % -

        if(currExp[currExp.length - 1] === "+") { //switch between + and -
            newExp = newExp.slice(0, newExp.length - 1) + btn;
        }
        else if(prevCharOperand || (validOperators.slice(4).includes(currExp[currExp.length - 1]) && !validOperators.slice(4).includes(currExp[currExp.length - 2]))) { //unary
            newExp += " " + btn;
        }
        else if(currExp === "\u00A0") { //if empty
            newExp = btn;
        }
        else if(currExp[currExp.length - 1] === '(') { //following an open parenthesis
            newExp += btn;
        }
    }
    else if(btn === '(') { 
        if(currExp === "\u00A0") { //if empty
            newExp = btn;
        }
        else if(validOperators.slice(3).includes(currExp[currExp.length - 1])) { //following an operator
            newExp += " " + btn;
        }
        else { //else, user is able to freely input as many ( desired - also takes care of x(x)
            newExp += btn;
        }
    }
    else if(btn === ")") {
        if( (currExp.split("(").length > currExp.split(")").length) &&  //match ( ) amount
            (validOperands.includes(currExp[currExp.length - 1]) || currExp[currExp.length - 1] === '%' || currExp[currExp.length - 1] === ')')) { //make sure valid 
            newExp += btn;
        }
    }
    else if(btn === "%") {
        if(prevCharOperand && currExp[currExp.length - 1] !== "%") { //only can follow an operand or complete (...)
            newExp += btn;
        }
    }
    else {
        console.error(`No such input: ${btn}`);
    }
    
    return newExp;
}

export function validateExpression(exp) {
    exp = exp.replaceAll(" ", "");
    exp = exp.replaceAll("\u00F7", "/");

    if(["(", "-", "^", "\u00D7", "/", "+"].includes(exp[exp.length - 1])) return false; //if ending with an operator
    if(exp[exp.length - 1] === '.' && isNaN(exp[exp.length - 2])) return false; //if ending with an incomplete float

    exp += "~"; //account for edge case
    const divisionByZeroRegex = /\/0[\(\)\%\-\+\*\/\^\~]|\/0\.0*\D|\/\.0+\D/g;
    if(exp.search(divisionByZeroRegex) !== -1) return false; //if division by zero exists
    
    return true;
}

export function handleSubmit(exp) {
    let output = new Big(postfixToOutput(infixToPostfix(parseToInfix(exp))));
    return output.toString();
}

function parseToInfix(exp) {
    exp = exp.replaceAll(" ", "");

    //this is just to make it easier for me
    exp = exp.replaceAll("\u00D7", "*");
    exp = exp.replaceAll("\u00F7", "/");

    //parse out exponential
    if(exp.includes("e")) {
        let i = exp.indexOf('e') + 2;
        while(!isNaN(exp[i]) && i < exp.length) {
            i++;
        }
        exponentialStore = exp.slice(exp.indexOf("e"), i);
        exp = exp.slice(0, exp.indexOf("e")) + exp.slice(i);
    }
    else {
        exponentialStore = "";
    }

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
        num = new Big(num).div(100);
        exp = exp.slice(0, start) + num.toString() + exp.slice(i + 1);
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

    //console.log(exp);
    return exp;
}

function infixToPostfix(infixExp) {
    let postfixExp = "";
    let opStack = [];
    let i = 0;
    let openParanthesisNum = 0;

    const unaryConditions = ["*", "/", "^", "("];
    const operatorPrecedence = new Map([
        ['+', 0], ['-', 0],
        ['*', 1], ['/', 1],
        ['^', 2]
    ]);

    while(i < infixExp.length) {

        while(validOperands.includes(infixExp[i])) {

            let unary = postfixExp[postfixExp.length - 1] === "u";
            if(!validOperands.includes(postfixExp[postfixExp.length - 1]) && postfixExp.length !== 0 && !unary & postfixExp[postfixExp.length - 1] !== " ") postfixExp += " ";

            if(unary) postfixExp = postfixExp.slice(0, postfixExp.length - 1);
            postfixExp += infixExp[i];
            i++;

            if(i > infixExp.length) break;
            if(!validOperands.includes(infixExp[i])) {
                postfixExp += " "; 
                break;
            }
        }

        if(!validOperands.includes(infixExp[i])) {
            if(i >= infixExp.length) break;
            if(infixExp[i] === '-' && (i === 0 || unaryConditions.includes(infixExp[i - 1]))) { //unary
                if(postfixExp.length === 0) postfixExp += infixExp[i] + "u";
                else postfixExp += " " + infixExp[i] + "u";
            }
            else if(infixExp[i] === "(") {
                opStack.push(infixExp[i]);
                openParanthesisNum++;
            }
            else if(infixExp[i] === ")") {
                while(opStack[opStack.length - 1] !== "(") {
                    postfixExp += opStack.pop();
                }
                opStack.pop();
                openParanthesisNum--;
            }
            else if(openParanthesisNum) {
                opStack.push(infixExp[i]);
            }
            else if(opStack.length === 0) {
                opStack.push(infixExp[i]);
            }
            else if(operatorPrecedence.get(infixExp[i]) > operatorPrecedence.get(opStack[opStack.length - 1])) {
                opStack.push(infixExp[i]);
            }
            else if(operatorPrecedence.get(infixExp[i]) === operatorPrecedence.get(opStack[opStack.length - 1])) {
                postfixExp += opStack.pop();
                opStack.push(infixExp[i]);
            }
            else if(operatorPrecedence.get(infixExp[i]) < operatorPrecedence.get(opStack[opStack.length - 1])) {
                while(operatorPrecedence.get(infixExp[i]) < operatorPrecedence.get(opStack[opStack.length - 1])) {
                    if(opStack.length === 0) {
                        break;
                    }
                    if(operatorPrecedence.get(infixExp[i]) === operatorPrecedence.get(opStack[opStack.length - 1])) {
                        postfixExp += opStack.pop();
                        break;
                    }
                    postfixExp += opStack.pop();
                }
                opStack.push(infixExp[i]);
            }
            i++;
        }
    }

    while(opStack.length) {
        postfixExp += opStack.pop();
    }

    //console.log(postfixExp);
    return postfixExp;
}

function postfixToOutput(exp) {
    let valStack = [];
    let firstOperand = true;
    let i = 0;

    while(i < exp.length) {

        if(!isNaN(exp[i]) || (exp[i] === '-' && validOperands.includes(exp[i + 1]))) {

            let temp = "";
            let neg = false;

            if(exp[i] === '-') {
                neg = true;
                i++;
            }

            while(!isNaN(exp[i]) || exp[i] === ".") {
                if(exp[i] === " ") {
                    i++;
                    break;
                }
                temp += exp[i];
                i++;
            }

            let num = new Big(temp);
            if(neg) num.s = -1;
            valStack.push(num.toString());

            if(firstOperand && exponentialStore.length !== 0) {
                valStack[0] = valStack[0] + exponentialStore;
                firstOperand = false;
                exponentialStore = "";
            }
        }

        //console.log(valStack);

        while(isNaN(exp[i])) {
            if(i > exp.length || (exp[i] === "-" && (validOperands.includes(exp[i + 1])))) break;

            let result = 0;
            switch(exp[i]) {
                case "-":
                    result = new Big(valStack[valStack.length - 2]).minus(new Big(valStack.pop()));
                    valStack[valStack.length - 1] = result.toString();
                    break;
                case "+":
                    result = new Big(valStack[valStack.length - 2]).plus(new Big(valStack.pop()));
                    valStack[valStack.length - 1] = result.toString();
                    break;
                case "*":
                    result = new Big(valStack[valStack.length - 2]).times(new Big(valStack.pop()));
                    valStack[valStack.length - 1] = result.toString();
                    break;
                case "/":
                    result = new Big(valStack[valStack.length - 2]).div(new Big(valStack.pop()));
                    valStack[valStack.length - 1] = result.toString();
                    break;
                case "^":
                    let top = Number(valStack.pop());
                    try {
                        result = new Big(valStack[valStack.length - 1]).pow(top);
                    }
                    catch {
                        console.log("Unprecise Calculation");
                        result = Number(valStack[valStack.length - 1]) ** (top);
                    }
                    valStack[valStack.length - 1] = result.toString();
                    break;
            }
            i++;
        }

        if(exp[i] === " ") i++;

        //console.log(valStack);
    }

    return valStack[0];
}