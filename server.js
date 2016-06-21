var http = require('http');
var io = require('socket.io');
var fs = require('fs');
var game = require('./game');

var board = "         ";
var turn = 1;
var player1 = null;
var player2 = null;

var all_games = [];


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
		// player1 = socket;
		player1 = socket;
		player1.emit('message', {'message':"Waiting for the other Player"});
		player1.on('disconnect', function() {
			player1 = null;
			turn = 1;
		});
		turn ++;
	} else if (turn == 2) {
		console.log("Player 2 has arrived");
		// player2 = socket;
		player2 = socket;
		turn--;
		all_games.push(new game(player1, player2));
	}
	console.log(all_games.length)
});