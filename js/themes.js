import whiteTheme from "./themes/white.js";
import grayTheme from "./themes/gray.js";
import blackTheme from "./themes/black.js";
import brownTheme from "./themes/brown.js";
import maroonTheme from "./themes/maroon.js";
import redTheme from "./themes/red.js";
import orangeTheme from "./themes/orange.js";
import yellowTheme from "./themes/yellow.js";
import limeGreenTheme from "./themes/limeGreen.js";
import greenTheme from "./themes/green.js";
import tealTheme from "./themes/teal.js";
import blueTheme from "./themes/blue.js";
import purpleTheme from "./themes/purple.js";
import pinkTheme from "./themes/pink.js";
// import testTheme from "./themes/test.js";

const themes = {
    white: whiteTheme,
    gray: grayTheme,
    black: blackTheme,
    brown: brownTheme,
    maroon: maroonTheme,
    red: redTheme,
    orange: orangeTheme,
    yellow: yellowTheme,
    limeGreen: limeGreenTheme,
    green: greenTheme,
    teal: tealTheme,
    blue: blueTheme,
    purple: purpleTheme,
    pink: pinkTheme,
    // test: testTheme,
};

export const colorVariables = [
    "--MAIN-COLOR",
    "--MAIN-COLOR-COVER",

    "--MOBILE-PANEL",

    "--TEXT-COLOR",
    "--TEXT-COLOR-OPPOSITE",

    "--PANEL-LIGHT",
    "--PANEL-DARK",
    "--PANEL-SHADOW-COLOR",

    "--CALC-SCROLLBAR-TRACK",
    "--CALC-SCROLLBAR",
    "--CALC-SCROLLBAR-HOVER",

    "--CALC-HISTORY-BORDER-COLOR",

    "--CALC-BG-LIGHT",
    "--CALC-BG-DARK",

    "--CALC-BORDER-COLOR",
    "--CALC-SHADOW-COLOR",

    "--BTN-BG-OPERAND-LIGHT",
    "--BTN-BG-OPERAND-LIGHT80",
    "--BTN-BG-OPERAND-LIGHT60",
    "--BTN-BG-OPERAND-DARK",
    "--BTN-BG-OPERAND-DARK80",
    "--BTN-BG-OPERAND-DARK60",

    "--BTN-BG-OPERATOR-LIGHT",
    "--BTN-BG-OPERATOR-LIGHT80",
    "--BTN-BG-OPERATOR-LIGHT60",
    "--BTN-BG-OPERATOR-DARK",
    "--BTN-BG-OPERATOR-DARK80",
    "--BTN-BG-OPERATOR-DARK60",

    "--BTN-BG-SPECIAL-LIGHT",
    "--BTN-BG-SPECIAL-LIGHT80",
    "--BTN-BG-SPECIAL-LIGHT60",
    "--BTN-BG-SPECIAL-DARK",
    "--BTN-BG-SPECIAL-DARK80",
    "--BTN-BG-SPECIAL-DARK60",

    "--BTN-SHADOW-COLOR",

    "--BTN-TEXT-SHADOW-OPERAND-COLOR",
    "--BTN-TEXT-SHADOW-OPERATOR-COLOR",
    "--BTN-TEXT-SHADOW-SPECIAL-COLOR",

    "--BTN-HOVER-BRIGHTNESS",
];

export default themes;