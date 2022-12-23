/*--------------
GLOBALS
--------------*/


/*
--------------
LISTENERS
--------------
*/


/*
--------------
ONLOAD FUNCTIONS
--------------
*/


/*
--------------
GENERAL GUI FUNCTIONS
--------------
*/


/*
--------------
CARD FUNCTIONS
--------------
*/


/*
--------------
TEXT DISPLAY FUNCTIONS
--------------
*/


/*
-----------------
UTILITY FUNCTIONS
-----------------
*/
function randInt(max) {
  return Math.floor(Math.random()*(max));
}
function randFloat(max) {
  return Math.random()*max;
}
function randElem(array) {
  return array[randInt(array.length - 1)];
}
function clamp(num,min,max) {
  //https://stackoverflow.com/questions/5842747/how-can-i-use-javascript-to-limit-a-number-between-a-min-max-value
   return Math.max(min, Math.min(num, max));
}
