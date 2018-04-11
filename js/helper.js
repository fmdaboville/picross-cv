"use strict";

/* ########################################## */
/* ##### Mini-section for click & drag  ##### */
/* ########################################## */

function mousegoup(e)  {mouseisdown=false;lockClass=false;}
function noshift(e)    {holdingShift=false;}
function checkshift(e){
	e = e || window.event;
	var keyCode = e.which || e.keyCode;
	if (!keyCode) { return; }
	holdingShift = (keyCode === 16);
}
document.onmouseup=mousegoup;document.onclick=mousegoup;
document.onkeydown=checkshift;document.onkeyup=noshift;


/* ########################################## */
/* ####  Often-called helper functions   #### */
/* ########################################## */

function grabit(gi_whattograb) {
	if (document.all) { return eval("document.all."+gi_whattograb); }
	if (document.getElementById) { return document.getElementById(gi_whattograb); }
	return false;
}

function splitevery(str, num) {
	num = parseInt(num);
	if (str.length < num) { return str; }
	var result = new Array();
	for (var i=0; i<str.length; i+=num) {
		if (str.length >= i+num) {
			result[result.length]=str.substring(i, i+num);
		} else {
			result[result.length]=str.substring(i,str.length);
		}
	}
	return result;
}

function blankPuzzle(rows, cols) {
	var puzzle = {
		rows: rows,
		cols: cols,
		data: [],
	}
	for (var i = 0; i < puzzle.cols; i++) {
		puzzle.data.push((new Array(puzzle.rows+1)).join('0'));
	}
	return puzzle;
}

function getPuzzle() {
	var encodedPuzzle = decodeURIComponent(window.location.search);
	// Expected format: ?width.height|data
	// Example:         ?8.8|tGdzuploKRS
	if (encodedPuzzle.indexOf('?') === -1) { return 'no puzzle'; }
	if (!encodedPuzzle.match(/^\?\d+\.\d+\|[0-9a-zA-Z_\-]+$/)) { return 'failed puzzle'; }
	encodedPuzzle = encodedPuzzle.replace('?', '').replace('|', '.').split('.');
	myPuzzle = {
		rows: parseInt(encodedPuzzle[0]),
		cols: parseInt(encodedPuzzle[1]),
		data: decodeToBinaryString(encodedPuzzle[2]),
	}
	if (myPuzzle.data.length < myPuzzle.rows*myPuzzle.cols) { return 'failed puzzle'; }
	myPuzzle.data = splitevery(myPuzzle.data, myPuzzle.rows);
	while (myPuzzle.data.length > myPuzzle.cols) {
		myPuzzle.data.pop(); // trim excess blocks.
	}
	return 'success';
}

var alphabet = {
	 0: '0',  1: '1',  2: '2',  3: '3',  4: '4',  5: '5',  6: '6',  7: '7',  8: '8',  9: '9',
	10: '_', 11: 'a', 12: 'b', 13: 'c', 14: 'd', 15: 'e', 16: 'f', 17: 'g', 18: 'h', 19: 'i',
	20: 'j', 21: 'k', 22: 'l', 23: 'm', 24: 'n', 25: 'o', 26: 'p', 27: 'q', 28: '-', 29: 'r', // 28 shall be '-' for historical / backwards-compatability reasons
	30: 's', 31: 't', 32: 'u', 33: 'v', 34: 'w', 35: 'x', 36: 'y', 37: 'z', 38: 'A', 39: 'B',
	40: 'C', 41: 'D', 42: 'E', 43: 'F', 44: 'G', 45: 'H', 46: 'I', 47: 'J', 48: 'K', 49: 'L',
	50: 'M', 51: 'N', 52: 'O', 53: 'P', 54: 'Q', 55: 'R', 56: 'S', 57: 'T', 58: 'U', 59: 'V',
	60: 'W', 61: 'X', 62: 'Y', 63: 'Z',
};

function encodeBinaryString(str) {
	str = splitevery(str, 6);
	var encoded = '';
	for (var i = 0; i < str.length; i++) {
		var chunkValue = 0;
		if (str[i].charAt(0) == '1') { chunkValue += 32; }
		if (str[i].charAt(1) == '1') { chunkValue += 16; }
		if (str[i].charAt(2) == '1') { chunkValue +=  8; }
		if (str[i].charAt(3) == '1') { chunkValue +=  4; }
		if (str[i].charAt(4) == '1') { chunkValue +=  2; }
		if (str[i].charAt(5) == '1') { chunkValue +=  1; }
		encoded += alphabet[chunkValue];
	}
	return encoded;
}

function decodeToBinaryString(encodedStr) {
	var decodeAlphabet = {};
	for (var key in alphabet) {
		decodeAlphabet[alphabet[key]] = parseInt(key);
	}
	var result = '';
	for (var i = 0; i < encodedStr.length; i++) {
		var chunkValue = decodeAlphabet[encodedStr[i]];
		result += (chunkValue%64 >= 32 ? '1' : '0');
		result += (chunkValue%32 >= 16 ? '1' : '0');
		result += (chunkValue%16 >=  8 ? '1' : '0');
		result += (chunkValue% 8 >=  4 ? '1' : '0');
		result += (chunkValue% 4 >=  2 ? '1' : '0');
		result += (chunkValue% 2 >=  1 ? '1' : '0');
	}
	return result;
}

var puzzleColors = ['unk', 'yes', 'no'];

function changeClass(elem, row, col){
	if (window.victory) { return true; }

	if (lockClass){
		elem.className = lockClass;
		changeVal(row, col, puzzleColors.indexOf(lockClass));
		return true;
	}

	if (puzzleColors.indexOf(elem.className) === -1) {
		alert('Unknown class: '+elem.className);
		return false;
	}

	if      (elem.className === 'unk' && !holdingShift) { elem.className = 'yes'; changeVal(row, col, 1); }
	else if (elem.className === 'yes' && !holdingShift) { elem.className = 'unk'; changeVal(row, col, 0); }
	else if (elem.className === 'no'  && !holdingShift) { elem.className = 'yes'; changeVal(row, col, 1); }
	else if (elem.className === 'unk' && holdingShift)  { elem.className = 'no';  changeVal(row, col, 2); }
	else if (elem.className === 'yes' && holdingShift)  { elem.className = 'no';  changeVal(row, col, 2); }
	else if (elem.className === 'no'  && holdingShift)  { elem.className = 'unk'; changeVal(row, col, 0); }
	lockClass = elem.className;
	return true;
}

function changeVal(row, col, newVal){
	newVal = newVal.toString();
	if (window.isPlaying) {
		userPuzzle.data[row] = userPuzzle.data[row].substring(0,col) + newVal + userPuzzle.data[row].substring(col+1);
		if(userPuzzle.data.join(',').replace(/2/g, '0') === myPuzzle.data.join(',')){
			window.victory=true;
			grabit('maintable').className = 'maintable victory';
			grabit('victorydiv').style.display = 'inline';
			grabit('topnums' ).innerHTML = grabit('topnums' ).innerHTML.replace(/nostrike/g,'strike');
			grabit('sidenums').innerHTML = grabit('sidenums').innerHTML.replace(/nostrike/g,'strike');
			grabit('maintds' ).innerHTML = grabit('maintds' ).innerHTML.replace(/unk/g,'no');
		}
	} else {
		myPuzzle.data[row] = myPuzzle.data[row].substring(0,col) + newVal + myPuzzle.data[row].substring(col+1);
	}
}
