var http = require('http');
var io = require('socket.io');
var fs = require('fs');

var board = "         ";
var turn = 1;

var server = http.createServer(function(req, res) {
    fs.readFile('tictac.html', 'utf-8', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(data);
    });
});

server.listen(8000);
io.listen(server).on('connection', function(socket){
	console.log("connected");
	socket.on('move', function(data) {
		console.log("new move");
		console.log(data.loc);
		var mark = "U"
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
		socket.emit('board', {'board':board});
	});
});
