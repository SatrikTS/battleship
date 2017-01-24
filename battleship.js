"use strict";
var view = {
	displayMassadge: function(msg) {
		var massageArea = document.getElementById("massageArea");
		massageArea.innerHTML = msg;
	},
	displayHit: function(location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class", "hit");
	},
	displpayMiss: function(location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class","miss");
	}
};

// view.displpayMiss("00");
// view.displayHit("01");
// view.displayMassadge("hello");



var model = {
	boardSize: 7,
	numShips: 3,
	shipsLenght: 3,
	shipsSunk: 0,
	ships: [  { location:[0, 0, 0], hits:["","",""] },
			  { location:[0, 0, 0], hits:["","",""] },
			  { location:[0, 0, 0], hits:["","",""] } ],

	fire: function(guess) {

			for ( var i = 0; i < this.numShips; i++ ) {
				var ship = this.ships[i];
					var index = ship.location.indexOf(guess);
					if( index >= 0 ) {
						ship.hits[index] = "hit";
						view.displayHit(guess);
						view.displayMassadge("hit");

						if(this.isSunk(ship)) {
							view.displayMassadge("ship Sunk");
							this.shipsSunk++;
						}
						return true;
					}

					// var hits = ship.hits;
					// for (var j= 0; j < location.length; j++) {
					// 	if(location[j] == guess) {
					// 		hits[j] = hit;
					// 		view.displayMassadge("hit");
					// 		return true;
					// 	} else {
					// 		view.displayMassadge("miss");
					// 	}
					// }
			} 
			view.displpayMiss(guess);
			view.displayMassadge("miss");
			return false;
	},

	isSunk: function(ship) {
		for(var i = 0; i < this.numShips; i++) {
			if (ship.hits[i] !== "hit") {
				return false;
			}
		}  return true;
	},

	generateShipLocations: function() {
		var location;

		for (var i = 0; i < this.numShips; i++) {
			do {
				location = this.generateShip();
			} while (this.collision(location));
			this.ships[i].location = location;
		}

	},
	generateShip: function() {
		var direction = Math.floor(Math.random()*2);
		var row, col;

		if(direction === 1) {
			// сгенерировать начальную позицию для горизон корабля
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * (this.boardSize - this.shipsLenght) );
		} else {
			// сгенерировать начальную позицию для вертик корабля
			row = Math.floor(Math.random() * (this.boardSize - this.shipsLenght) );
			col = Math.floor(Math.random() * this.boardSize);
		}

		var newShipLocations = [];
		for (var i = 0; i < this.shipsLenght; i++) {
			if(direction === 1) {
				// добавить массив для горизон корабля
				newShipLocations.push(row + "" + (col + i));
			} else {
				// добавить массив для вертик корабля
				newShipLocations.push((row + i) + "" + col);
			}

		}
		return newShipLocations;


	},
	collision: function(location) {
		for (var i = 0; i < this.numShips; i++) {
			var ship = model.ships[i];
			for (var j = 0; j < location.length; j++) {
				if (ship.location.indexOf(location[j]) >= 0) {
					return true;
				} 
			}
		} return false;
	}
};

var controller = {
	gueses: 0,
	progressGuess: function(guess) {
		var location = parseGuess(guess);
		if(location) {
			this.gueses++;
			var hit = model.fire(location);

			if( hit && model.shipsSunk == model.numShips) {
				view.displayMassadge("Ты потопил все мои корабли за " + this.gueses + " выстрелов!");
			}
		}
	}
};



function parseGuess(guess) {
	var alphabet = ["A", "B", "C", "D", "E", "F", "G"];
	if (guess === null || guess.length !== 2) {
		alert("Упс, введите букву и цифру в поле ввода");
	} else {
		var firstChar = guess[0];
		var row = alphabet.indexOf(firstChar);
		var column = guess.charAt(1);
		var firstCharAlt = guess[0];

		var td = document.getElementsByTagName("td");
		for (var i = 0; i < td.length; i++) {
			if( guess == td[i].id) {
				return firstCharAlt + column;
			}
		}

		 if(isNaN(row) || isNaN(column) ) {
			alert("Упс, такого нет на доске");
		} else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
			alert("упс, за приделами доски");
		} else {
			return row + column;
		}
	} return null;
}

function handleFireButton() {
	var guessInput = document.getElementById("guessInput");
	var guess = guessInput.value;

	controller.progressGuess(guess);

	guessInput.value ="";

}

function init() {
	var fireButton = document.getElementById("fireButton");
	fireButton.onclick = handleFireButton;
	var guessInput = document.getElementById("guessInput");
	guessInput.onkeypress = handleKeyPress;

	var td = document.getElementsByTagName("td");
	for (var i = 0; i < td.length; i++) {
		td[i].onclick = handleClick;
	}

	model.generateShipLocations();
}

function handleKeyPress(e) {
	var fireButton = document.getElementById("fireButton");
	if(e.keyCode === 13) {
		fireButton.click();
		return false;
	}
}
function handleClick(eventObj) {
	var td = eventObj.target;
	var guess = td.id;
	controller.progressGuess(guess);
}

window.onload = init;

// controller.progressGuess("A0");

// controller.progressGuess("A6");
// controller.progressGuess("B6");
// controller.progressGuess("C6");

// controller.progressGuess("C4");
// controller.progressGuess("D4");
// controller.progressGuess("E4");

// controller.progressGuess("B0");
// controller.progressGuess("B1");
// controller.progressGuess("B2");


// console.log(parseGuess("A0"));
// console.log(parseGuess("B6"));
// console.log(parseGuess("H0"));
// console.log(parseGuess("A7"));

// model.fire("10");
// model.fire("20");
// model.fire("30");

// model.fire("00");
// model.fire("50");
// model.fire("44");

// model.fire("33");
// model.fire("65");
// model.fire("66");