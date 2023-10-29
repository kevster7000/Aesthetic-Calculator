/* everytime they hit an arithmetic button, add onto the string in the display panel
use this string for calculating and parsing */

/* everytime they hit enter, parse the string
    if there is an error - do not calculate, instead say that there is an error and make the region red:
    FOR EXAMPLE: 50 * 5 1, the 5 1 is an error, so both numbers should turn red (--COLOR-ERROR)

    Also check for excessive characters
    DO NOT ALLOW THE USER TO DO THE following:
    - type spaces (make character space large in textfield so that it looks like there are automatic spacing between characters)
    - type multiple decimals per operand
    - type consecutive operators

    - only allow decimals to be typed once per operand, never anywhere else
    - more error handling

    - USE REGEX !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


    PEMDAS - use it all - parenthesis, exponent, mul, div, add, sub

    If no error:
    WE WILL be using (), So make sure always check for () first - same amount of ( and )
    Next we will convert the string expression from infix to postfix (221) - uses a stack for operators 
    Then, we will evaluate this postfix expressiosn by using a stack for operators
*/




/* also make the user able to type any of the buttons such as , +, -, enter, etc rather than having to click everything*/

/* also allow the display panel to be contenteditable so that the user can click and edit the text */


/* also make a history section
    everytime the user hits enter or clicks =, if no error, store the displayed expression string as the key and the result as the value in session storage
    If the user hits the history button, display all of these key/value pairs in session storage on the side of the calculator.
*/
console.log("hey");