export function handleInput(btn, currExp) {

    console.log(btn);

    let newExp = currExp;

    // do some basic handling and stuff like operator replacment
    
    const validOperands = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."]
    const validOperators = ["(", ")", "%", "^", "\u00D7", "\u00F7", "-", "+"];
    // division is \u00F7
    // multiplication is \u00D7

    if(validOperands.includes(btn)) {
        newExp += btn;
    }
    else if(validOperators.includes(btn)) {
        newExp += btn;
    }
    else {
        console.error("No such input");
    }
    
    //final expressions error check with regex
    const regexValid = true; //supposed to be false be default

    return (regexValid) ? newExp : currExp;
}

export function handleKeyboardInput() {
    console.log("keyboard input");
}

export function handleSubmit(exp) {
    return postfixToOutput(infixToPostfix(exp));
}

function infixToPostfix(exp) {
    return exp;
}

function postfixToOutput(exp) {
    return exp;
}


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