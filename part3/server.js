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
			move(data);
		});
		player1.on('disconnect', function() {
			if (player2 != null) {
				sendMessageToP2("Disconnected");
				board = "         ";
				player2.disconnect();
				turn = 1;
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
			move(data);
		});
		player2.on('disconnect', function() {
			if (player1 != null) {
				sendMessageToP1("Disconnected");
				board = "         ";
				player1.disconnect();
				turn = 1;
			}
		});
		turn--;
	}
});

function sendMessageToP1(message) {
	player1.emit('message', {'message':message});
}

function sendMessageToP2(message) {
	player2.emit('message', {'message':message});	
}

function move(data) {
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
			} else {
				console.log(board[data.loc]);
				mark = "O";
				console.log(board[data.loc]);
				turn--;
			}
			var newboard = "";
			for (var i = 0; i < board.length; i++) {
				if (i != data.loc)
					newboard = newboard + board[i];
				else
					newboard = newboard + mark;
			}
			board = newboard;
			console.log(board);
			player1.emit('board', {'board':board});
			player2.emit('board', {'board':board});
		} else {

		}
	}