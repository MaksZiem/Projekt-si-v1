//deklaracja stalych
const restartBtn = document.querySelector(".restartBtn");
const switchStart = document.querySelector(".switchStart");
const start = document.querySelector(".start");
const squares = document.querySelectorAll('.square');
const turn = document.querySelector(".turn");
const hu = 'X';
const ai = 'O';

let currentPlayer = hu; //tutaj wystarczy dac funkcje i bedzie gicio
let temp = 0;

//TODO zrobic tak zeby zdjac klase i nie mozna bylo postawic drugi raz znaku

//deklaracja boardu jako tablicy 2d
let board = [
  ['', '', ''],
  ['', '', ''],
  ['', '', '']
]

//koncowe mozliwe wyniki w celu znalezienia najlepzej opcji w minimax
let scores = {
  X: -10,
  O: 10,
  tie: 0
};

//wyswietla na ekranie czyja jest tura
checkTurn();

function checkTurn(){
  if(currentPlayer = hu) {
    turn.innerText = "your turn";
  } else {
    turn.innerText = "Ai's turn";
  }
}

//nadanie kazdej komorce planszy funkcjonalnosci
squares.forEach(square => {
  square.addEventListener("click", boxClicked)
});

//dodanie funkcji do przyciskow menu gry
switchStart.addEventListener("click", switchStartFunc);
restartBtn.addEventListener("click", restartGame);


//funkcja restartujaca gre, ustawia wartosci zmiennych na poczatkawe/defaultowe
function restartGame() {
  currentPlayer = hu;
  temp = 0;
  board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ]
  squares.forEach(square => {
    square.innerText = '';
  });
  checkTurn();
  switchStart.classList.toggle("hide");
}


//funkcja pozwalajaca wybrac strone startujaca gre
function switchStartFunc() {
    currentPlayer = ai;
    aiMove();
    // switchStart.classList.toggle("hide");
}


//funkcja pozwalajaca wylonic zwyciezce
function isWinner() {
  let winner = null;
  
  //sprawdzanie zwyciestw poziomo
  for (let i=0; i<3; i++){
    if (board[i][0] == board[i][1] && board[i][1] == board[i][2] && board[i][0] != '') {
      winner = board[i][0];
    }
  }

  //sprawdzanie zwyciest pionowo
  for (let i = 0; i < 3; i++) {
    
    if (board[0][i] == board[1][i] && board[1][i] == board[2][i] && board[0][i] != '') {
      winner = board[0][i];
    }
  }

  //sprawdzanie zwyciest na skos
  if (board[0][0] == board[1][1] && board[1][1] == board[2][2] && board[0][0] != '') {
    winner = board[0][0];
  }
  
  if (board[2][0] == board[1][1] && board[1][1] == board[0][2] && board[2][0] != '') {
    winner = board[2][0];
  }


  //jesli nie ma zadnej wolnej komorki i nie zostal wyloniony zwyciezda to jest remis
  let openSpots = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] == '') {
        openSpots++;
      }
    }
  }

  if (winner == null && openSpots == 0) {
    return 'tie';
  } else {
    return winner;
  }
}


//funkcja ktora wywoluje sie po klikniecu komorki na board
function boxClicked(e) {
  //zczytanie koordynatow za pomoca id 
  //id jest zamienione na ciag znakow i ma postac np. "0 0" dla pierwsej komorki
  //i dzieki temu jestem w stanie odniesc sie do komorki w tablicy 2d "board"
  
  let idx = e.target.id[0];
  let idy = e.target.id[2];
  console.log(idx, idy);
  
  if(board[idx][idy] == ''){
    board[idx][idy] = hu;
    drawXO(idx, idy);
    let isWin = isWinner();
    if(isWin==null) {
      currentPlayer = ai;
      aiMove();
    } 
  }
}


//funkcja ktora nanosi znak na plansze, da sie to zrobic optymalniej ale dziala
function drawXO(x, y){
  //jesli pojawi sie cos na planszy to znika przycisk "pozwol ai zaczac";
  if(temp == 0) {
    switchStart.classList.toggle("hide");
  }
  temp++;

  let out = isWinner();
  if(out != null) {
    if(out == 'tie') {
      if(currentPlayer == hu) {
        document.getElementById(x+" "+y).innerText = 'X';
      } else {
        document.getElementById(x+" "+y).innerText = 'O';
      }
      turn.innerText = 'remis';
    } 
    else {
      if(currentPlayer == hu) {
        document.getElementById(x+" "+y).innerText = 'X';
      } else {
        document.getElementById(x+" "+y).innerText = 'O';
      }
      turn.innerText = "wygral: "+currentPlayer;
    }
  } else {
    if(currentPlayer == hu) {
      document.getElementById(x+" "+y).innerText = 'X';
    } else {
      document.getElementById(x+" "+y).innerText = 'O';
    }
  }
}


//funkcja ktora wykonuje ruch ai
function aiMove() {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] == '') {
        board[i][j] = ai;
        let score = minimax(board, false);
        board[i][j] = '';
        if (score > bestScore) {
          bestScore = score;
          move = { i, j };
        }
      }
    }
  }
  board[move.i][move.j] = ai;
  console.log(board)
  drawXO(move.i, move.j);
  currentPlayer = hu;
}




//minimax zajebany z neta

// function minimax(board, isMaximizing) {
//   let result = isWinner();
//   if (result !== null) {
//     return scores[result];
//   }

//   if (isMaximizing) {
//     let bestScore = -Infinity;
//     for (let i = 0; i < 3; i++) {
//       for (let j = 0; j < 3; j++) {
//         // Is the spot available?
//         if (board[i][j] == '') {
//           board[i][j] = ai;
//           let score = minimax(board, false);
//           board[i][j] = '';
//           bestScore = Math.max(score, bestScore);
//         }
//       }
//     }
//     return bestScore;
//   } else {
//     let bestScore = Infinity;
//     for (let i = 0; i < 3; i++) {
//       for (let j = 0; j < 3; j++) {
//         // Is the spot available?
//         if (board[i][j] == '') {
//           board[i][j] = hu;
//           let score = minimax(board, true);
//           board[i][j] = '';
//           bestScore = Math.min(score, bestScore);
//         }
//       }
//     }
//     return bestScore;
//   }
// }


//minimax zmodyfikowany przeze mnnie 
function minimax(board, isMaximizing) {
  let results = new Array();
  let result = isWinner();

  if (result !== null) {
    return scores[result];
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] == '') {
          board[i][j] = ai;
          results.push(minimax(board, false))
          board[i][j] = '';
        }
      }
    }
    bestScore = Math.max(...results);
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] == '') {
          board[i][j] = hu;
          results.push(minimax(board, true))
          board[i][j] = '';
        }
      }
    }
    bestScore = Math.min(...results);
    return bestScore;
  }
}


