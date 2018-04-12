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
	20: 'j', 21: 'k', 22: 'l', 23: 'm', 24: 'n', 25: 'o', 26: 'p', 27: 'q', 28: '-', 29: 'r',
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

			var printres = '<a href="';
			printres += getResults();
			printres += '" target="_blank"><button type="button" class="btn btn-warning btn-lg">Voir les résultats</button></a>';
			printres += '<br /><br /><br />'
			grabit('printres').innerHTML = printres;

			var nextlvl = getNextLevel();
			if (nextlvl != 'last') {
				var next = '';
				next += '<p>Cliquez sur le bouton ci-dessous pour accéder au niveau suivant : </p>';
				next += '<a href="level.html';
				next += nextlvl;
				next += '"><button type="button" class="btn btn-secondary">Niveau suivant</button></a>';
				next += '<br /><br /><br />';
				grabit('nextlevel').innerHTML = next;
			} else {
				var last = '';
				last += '<p>Félicitations vous avez terminé le dernier niveau !</p>';
				last += '<a href="../index.html"><button type="button" class="btn btn-secondary">Revenir à la page d\'accueil</button></a>';
				last += '<br /><br /><br />';
				grabit('nextlevel').innerHTML = last;
			}
			

			grabit('victorydiv').style.display = 'inline';
			grabit('topnums' ).innerHTML = grabit('topnums' ).innerHTML.replace(/nostrike/g,'strike');
			grabit('sidenums').innerHTML = grabit('sidenums').innerHTML.replace(/nostrike/g,'strike');
			grabit('maintds' ).innerHTML = grabit('maintds' ).innerHTML.replace(/unk/g,'no');
		}
	} else {
		myPuzzle.data[row] = myPuzzle.data[row].substring(0,col) + newVal + myPuzzle.data[row].substring(col+1);
	}
}

function getResults() {
	var result = '';
	var urllevel = decodeURIComponent(window.location.search);
	switch(urllevel) {
		case '?5.7|XXx6bn':
		result = 'resultats/fmdaboville/attentes.html';
		break;
		case '?5.5|8Kv70':
		result = 'resultats/jpoublan/attentes.html';
		break;
		case '?5.6|Y1f5d':
		result = 'resultats/fmdaboville/competences.html';
		break;
		case '?4.9|rBg4UI':
		result = 'resultats/jpoublan/competences.html';
		break;
		case '?5.5|8VXqu':
		result = 'resultats/fmdaboville/itineraire.html';
		break;
		case '?5.5|kZVw0':
		result = 'resultats/jpoublan/itineraire.html';
		break;
		case '?5.5|szdXu':
		result = 'resultats/fmdaboville/formation.html';
		break;
		case '?5.8|8VZM4Cu':
		result = 'resultats/resultats/jpoublan/formation.html';
		break;
		case '?5.5|EVVEu':
		result = 'resultats/fmdaboville/personnalite.html';
		break;
		case '?9.8|s7WJRZZPYGLA':
		result = 'resultats/jpoublan/personnalite.html';
		break;
		case '?5.10|-Szty9Ybf':
		result = 'resultats/fmdaboville/interets.html';
		break;
		case '?5.9|Kv24dsz8':
		result = 'resultats/jpoublan/interets.html';
		break;
		case '?11.8|888uZxrJZRXC_cu':
		result = 'resultats/fmdaboville/cv.html';
		break;
		case '?10.7|vNeJVZZZWYvK':
		result = 'resultats/jpoublan/cv.html';
		break;
		default:
	}
	return result;
}

function getNextLevel() {
	var level = '';
	var urllevel = decodeURIComponent(window.location.search);
	switch(urllevel) {
		case '?5.7|XXx6bn':
		level = '?5.5|8Kv70';
		break;
		case '?5.5|8Kv70':
		level = '?5.6|Y1f5d';
		break;
		case '?5.6|Y1f5d':
		level = '?4.9|rBg4UI';
		break;
		case '?4.9|rBg4UI':
		level = '?5.5|8VXqu';
		break;
		case '?5.5|8VXqu':
		level = '?5.5|kZVw0';
		break;
		case '?5.5|kZVw0':
		level = '?5.5|szdXu';
		break;
		case '?5.5|szdXu':
		level = '?5.8|8VZM4Cu';
		break;
		case '?5.8|8VZM4Cu':
		level = '?5.5|EVVEu';
		break;
		case '?5.5|EVVEu':
		level = '?9.8|s7WJRZZPYGLA';
		break;
		case '?9.8|s7WJRZZPYGLA':
		level = '?5.10|-Szty9Ybf';
		break;
		case '?5.10|-Szty9Ybf':
		level = '?5.9|Kv24dsz8';
		break;
		case '?5.9|Kv24dsz8':
		level = '?11.8|888uZxrJZRXC_cu';
		break;
		case '?11.8|888uZxrJZRXC_cu':
		level = '?10.7|vNeJVZZZWYvK';
		break;
		case '?10.7|vNeJVZZZWYvK':
		level = 'last';
		break;
		default:
	}
	return level;
}

function getTitle() {
	var urllevel = decodeURIComponent(window.location.search);
	var title = 'Niveau ';
	switch(urllevel) {
		case '?5.7|XXx6bn':
		title += '1';
		break;
		case '?5.5|8Kv70':
		title += '2';
		break;
		case '?5.6|Y1f5d':
		title += '3';
		break;
		case '?4.9|rBg4UI':
		title += '4';
		break;
		case '?5.5|8VXqu':
		title += '5';
		break;
		case '?5.5|kZVw0':
		title += '6';
		break;
		case '?5.5|szdXu':
		title += '7';
		break;
		case '?5.8|8VZM4Cu':
		title += '8';
		break;
		case '?5.5|EVVEu':
		title += '9';
		break;
		case '?9.8|s7WJRZZPYGLA':
		title += '10';
		break;
		case '?5.10|-Szty9Ybf':
		title += '11';
		break;
		case '?5.9|Kv24dsz8':
		title += '12';
		break;
		case '?11.8|888uZxrJZRXC_cu':
		title += '13';
		break;
		case '?10.7|vNeJVZZZWYvK':
		title += '14';
		break;
		default:
	}
	return '<h2>' + title + '</h2>';
}
