var board; // доска
var score = 0; // счет
var rows = 4; // строки доски
var columns = 4; // колонки доски

window.onload = function() { // выполнение скрипта после загрузки
	setGame(); // функция установки игры
}

function setGame() {
	// доска в начале игры
	board = [ 
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0]
	]

	// перебор каждой плитки
	for (let r = 0; r < rows; r++) {
		for (let c = 0; c < columns; c++) {
			let tile = document.createElement("div"); // создание новой плитки с заданным тегом div
			tile.id = r.toString() + "-" + c.toString(); // создание id текущей плитки 
			let num = board[r][c]; // получение числа с доски 
			updateTile(tile, num); // функция обновления плитки
			document.getElementById("board").append(tile);
		}
	}
	// создаем две двойки для начала игры 
	setTwo();
	setTwo();
}

function updateTile(tile, num) {
	tile.innerText = ""; // очищение текста внутри плитки
	tile.classList.value = ""; // очищение классов плитки
	tile.classList.add("tile"); // добавление класса плитки
	if (num > 0) {
		tile.innerText = num.toString(); // заполняем плитку числом
		if (num <= 4096) {
			tile.classList.add("x" + num.toString()); // задаем уникальный цвет плитки
		}
		else {
			tile.classList.add("x8192"); // задаем красный цвет плитки
		}
	}
}

// прослушиватель событий
document.addEventListener("keyup", (event) => { // когда пользователь отпустит клавишу произойдет событие
	if (event.code == "ArrowLeft") {
        slideLeft();
		setTwo();
    }
    else if (event.code == "ArrowRight") {
        slideRight();
		setTwo()
    }

	else if (event.code == "ArrowUp") {
        slideUp();
		setTwo()
    }

	else if (event.code == "ArrowDown") {
        slideDown();
		setTwo()
    }
	document.getElementById("score").innerText = score;
})

function filterZero(row) {
	return row.filter(num => num != 0); // создает копию массива, исключая нули
}

function setTwo() {
	if (!hasEmptyTile()) {
		return;
	}

	let found = false;
	while (!found) {
		// рандомный столбец и строка для генирации двоек
		let r = Math.floor(Math.random() * rows);
		let c = Math.floor(Math.random() * columns);

		if (board[r][c] == 0) {
			board[r][c] = 2;
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			tile.innerText = "2"; 
			tile.classList.add("x2");
			found = true;
		}
	}
}

function hasEmptyTile() {
	for (let r = 0; r < rows; r++) {
		for (let c = 0; c < columns; c++) {
			if (board[r][c] == 0) {
				return true;
			}
		}
	}
	return false;
}

function slideLeft() {
	// проходимся по каждой строчке, сдвигаем их влево и обновляем строки на доске  
	for (let r = 0; r < rows; r++) {
		let row = board[r]; 
		row = slide(row); 
		board[r] = row;

		for (let c = 0; c < columns; c++) {
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			let num = board[r][c];
			updateTile(tile, num);
		}
	}
}

function slideRight() {
	// проходимся по каждой строчке, сдвигаем их вправо и обновляем строки на доске  
	for (let r = 0; r < rows; r++) {
		let row = board[r];         //[0, 2, 2, 2]
        row.reverse();              //[2, 2, 2, 0]
        row = slide(row)            //[4, 2, 0, 0]
        board[r] = row.reverse();   //[0, 0, 2, 4];

		for (let c = 0; c < columns; c++) {
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			let num = board[r][c];
			updateTile(tile, num);
		}
	}
}

function slideUp() {
	// проходимся по каждой строчке, сдвигаем их вверх и обновляем строки на доске  
	for (let c = 0; c < columns; c++) {
		let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
		row = slide(row);
		// board[0][c] = row[0];
		// board[1][c] = row[1];
        // board[2][c] = row[2];
		// board[3][c] = row[3];

		for (let r = 0; r < rows; r++) {
			board[r][c] = row[r];
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			let num = board[r][c];
			updateTile(tile, num);
		}
	}
}

function slideDown() {
	// проходимся по каждой строчке, сдвигаем их вверх и обновляем строки на доске  
	for (let c = 0; c < columns; c++) {
		let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
		row.reverse();
		row = slide(row);
		row.reverse();

		for (let r = 0; r < rows; r++) {
			board[r][c] = row[r];
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			let num = board[r][c];
			updateTile(tile, num);
		}
	}
}

function slide(row) {
	// [0, 2, 2, 2]
	row = filterZero(row); // шаг 1 - очистить строку от нулей -> [2, 2, 2]

	// шаг 2 - соединение двух плиток в одну сдвигом влево (2 * 2 = 4) -> [4, 0, 2]
	for (let i = 0; i < row.length - 1; i++) {
		// проверка соседней цифры
		if (row[i] == row[i + 1]) {
			row[i] *= 2;
			row[i + 1] = 0; 
			score += row[i];
		}
	}

	// шаг 3 - снова очистить строку от нулей -> [4, 2]
	row = filterZero(row);

	// шаг 4 - добавление пустых плиток в строке(нулей) -> [4, 2, 0, 0]
	while (row.length < columns) {
		row.push(0); // добавляем нули в конец строки, пока длина строки не станет равна четырем
	}

	for (let i = 0; i < row.length - 1; i++) {
		if (row[i] == "2048") {
			isWin();
		}
	}
	document.addEventListener('click', function () {
		document.getElementById("win").style.display = "none";
	})
	return row;
}

function isWin() {
	if(isWin.isRun) {
		return false;
	}
	document.getElementById("win").style.display = "block";
	isWin.isRun = true;
}