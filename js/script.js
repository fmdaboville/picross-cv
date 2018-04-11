/*
Custom script file
Authors : 	François-Marie d'Aboville
			Jehan Poublan
*/

$(document).ready(function(){
    // au clic sur un lien
   $('.scroll').on('click', function() { // Au clic sur un élément
			var page = $(this).attr('href'); // Page cible
			var speed = 750; // Durée de l'animation (en ms)
			$('html, body').animate( { scrollTop: $(page).offset().top }, speed ); // Go
			return false;
		});


});


// //Start picross
// function getPuzzle() {
// 	var encodedPuzzle = decodeURIComponent(window.location.search);
// 	// Expected format: ?width.height|data
// 	// Example:         ?8.8|tGdzuploKRS
// 	if (encodedPuzzle.indexOf('?') === -1) { return 'no puzzle'; }
// 	if (!encodedPuzzle.match(/^\?\d+\.\d+\|[0-9a-zA-Z_\-]+$/)) { return 'failed puzzle'; }
// 	encodedPuzzle = encodedPuzzle.replace('?', '').replace('|', '.').split('.');
// 	myPuzzle = {
// 		rows: parseInt(encodedPuzzle[0]),
// 		cols: parseInt(encodedPuzzle[1]),
// 		data: decodeToBinaryString(encodedPuzzle[2]),
// 	}
// 	if (myPuzzle.data.length < myPuzzle.rows*myPuzzle.cols) { return 'failed puzzle'; }
// 	myPuzzle.data = splitevery(myPuzzle.data, myPuzzle.rows);
// 	while (myPuzzle.data.length > myPuzzle.cols) {
// 		myPuzzle.data.pop(); // trim excess blocks.
// 	}
// 	return 'success';
// }

// var myPuzzle = {};
// var userPuzzle = { data: [] };
// var mynums = new Array();
// var holdingShift = false;
// var mouseisdown = false;
// var lockClass = false;
// var victory = false;
// var isPlaying = true;

// function playball(){
// 	var cleanerSearch = decodeURIComponent(window.location.search);
// 	if (window.location.search !== cleanerSearch) {
// 		if (history.replaceState) {
// 			history.replaceState({}, document.title, window.location.pathname + cleanerSearch);
// 		}
// 	}
// 	var puzzleStatus = getPuzzle();
// 	console.log(puzzleStatus);
// 	if (puzzleStatus !== 'success'){
// 		grabit('statustd').innerHTML='Failed to understand puzzle.<br><br>Expected format: wherever.html?width.height|data';
// 		return false;
// 	}
// 	userPuzzle = blankPuzzle(myPuzzle.rows, myPuzzle.cols);
// 	// figureNums();
// 	// writePuzzle();
// }
