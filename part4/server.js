var http = require('http');
var io = require('socket.io');
var fs = require('fs');

var board = "         ";
var turn = 1;
var player1 = null;
var player2 = null;

var server = http.createServer(function(req, res) {
    fs.readFile('tictac.html', 'utf-8', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(data);
    });
});

server.listen(8000);
io.listen(server).on('connection', function(socket){
	console.log("connected");
	if (turn == 1) {
		console.log("Player 1 has arrived");
		player1 = socket;
		sendMessageToP1("Waiting for the Other Player");
		player1.emit('board', {'board':board});
		player1.on('move', function(data){
			movePlayer1(data);
		});
		player1.on('disconnect', function() {
			if (player2 != null) {
				sendMessageToP2("Disconnected");
				board = "         ";
				player2.disconnect();
			}
		});
		turn++;
	} else if (turn == 2) {
		console.log("Player 2 has arrived");
		player2 = socket;
		sendMessageToP1("Make a Move");
		sendMessageToP2("Make a Move");
		player2.emit('board', {'board':board});
		player2.on('move', function(data){
			movePlayer2(data);
		});
		player2.on('disconnect', function() {
			if (player1 != null) {
				sendMessageToP1("Disconnected");
				board = "         ";
				player1.disconnect();
			}
		});
		turn--;
	}
});

function movePlayer2 (data) {
		console.log("new move");
		console.log(data);
		console.log(data.loc);
		var mark = "U"
		if (board[data.loc] == ' ') {
			if (turn == 2) {
				console.log(board[data.loc]);
				mark = "O";
				console.log(board[data.loc]);
				turn--;
				var newboard = "";
				for (var i = 0; i < board.length; i++) {
					if (i != data.loc)
						newboard = newboard + board[i];
					else
						newboard = newboard + mark;
				}
				board = newboard;
			}
			
			console.log(board);
			player1.emit('board', {'board':board});
			player2.emit('board', {'board':board});
		}
		validate();
}
function movePlayer1(data) {
		console.log("new move");
		console.log(data);
		console.log(data.loc);
		var mark = "U"
		if (board[data.loc] == ' ') {
			if (turn == 1) {
				console.log(board[data.loc]);
				mark = "X";
				console.log(board[data.loc]);
				turn++;
				var newboard = "";
				for (var i = 0; i < board.length; i++) {
					if (i != data.loc)
						newboard = newboard + board[i];
					else
						newboard = newboard + mark;
				}
				board = newboard;
			}
			console.log(board);
			player1.emit('board', {'board':board});
			player2.emit('board', {'board':board});
		}
		validate();
}

function sendMessageToP1(message) {
	player1.emit('message', {'message':message});
}

function sendMessageToP2(message) {
	player2.emit('message', {'message':message});	
}

function validate() {
	for (var i = 0; i < 3; i++) {
		if (board[i] == "X" && board[i+3] == "X" && board[i+6] == "X") {
			sendMessageToP1("You win");
			sendMessageToP2("You lose");
			player1.disconnect();
			player2.disconnect();
			return;
		} else if (board[i] == "O" && board[i+3] == "O" && board[i+6] == "O") {
			sendMessageToP2("You win");
			sendMessageToP1("You lose");
			player1.disconnect();
			player2.disconnect();
			return;
		}
	}

	for (var i = 0; i < 9; i += 3) {
		if (board[i] == "X" && board[i+1] == "X" && board[i+2] == "X") {
			sendMessageToP1("You win");
			sendMessageToP2("You lose");
			player1.disconnect();
			player2.disconnect();
			return;
		} else if (board[i] == "O" && board[i+1] == "O" && board[i+2] == "O") {
			sendMessageToP2("You win");
			sendMessageToP1("You lose");
			player1.disconnect();
			player2.disconnect();
			return;
		}
	}

	if (board[0] == "X" && board[4] == "X" && board[8] == "X") {
			sendMessageToP1("You win");
			sendMessageToP2("You lose");
			player1.disconnect();
			player2.disconnect();
			return;
	} else if (board[0] == "O" && board[4] == "O" && board[8] == "O") {
			sendMessageToP2("You win");
			sendMessageToP1("You lose");
			player1.disconnect();
			player2.disconnect();
			return;
	} else if (board[2] == "X" && board[4] == "X" && board[6] == "X") {
			sendMessageToP1("You win");
			sendMessageToP2("You lose");
			player1.disconnect();
			player2.disconnect();
			return;
	} else if (board[2] == "O" && board[4] == "O" && board[6] == "O") {
			sendMessageToP2("You win");
			sendMessageToP1("You lose");
			player1.disconnect();
			player2.disconnect();
			return;
	}
	
	if (board.indexOf(" ") == -1) {
		sendMessageToP2("Draw");
		sendMessageToP1("Draw");
		player1.disconnect();
		player2.disconnect();
		return;
	}
}
