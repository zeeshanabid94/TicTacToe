module.exports = function(player1, player2) {
	var game = {
		board:"         ",
		turn:1,
		player1:null,
		player2:null,

		movePlayer2: function(data) {
			console.log("new move");
			console.log(data.loc);
			var mark = "U"
			if (this.board[data.loc] == ' ') {
				if (this.turn == 2) {
					console.log(this.board[data.loc]);
					mark = "O";
					console.log(this.board[data.loc]);
					this.turn--;
					var newboard = "";
					for (var i = 0; i < this.board.length; i++) {
						if (i != data.loc)
							newboard = newboard + this.board[i];
						else
							newboard = newboard + mark;
					}
					this.board = newboard;
				}
				
				console.log(this.board);
				this.player1.emit('board', {'board':this.board});
				this.player2.emit('board', {'board':this.board});
			}
			this.validate();
		},

		movePlayer1: function (data) {
			console.log("new move");
			console.log(data.loc);
			var mark = "U"
			if (this.board[data.loc] == ' ') {
				if (this.turn == 1) {
					console.log(this.board[data.loc]);
					mark = "X";
					console.log(this.board[data.loc]);
					this.turn++;
					var newboard = "";
					for (var i = 0; i < this.board.length; i++) {
						if (i != data.loc)
							newboard = newboard + this.board[i];
						else
							newboard = newboard + mark;
					}
					this.board = newboard;
				}
				console.log(this.board);
				this.player1.emit('board', {'board':this.board});
				this.player2.emit('board', {'board':this.board});
			}
			this.validate();
		},

		sendMsgP1: function (message) {
			this.player1.emit('message', {'message':message});
		},

		sendMsgP2: function (message) {
			this.player2.emit('message', {'message':message});	
		},

		validate:function () {
			for (var i = 0; i < 3; i++) {
				if (this.board[i] == "X" && this.board[i+3] == "X" && this.board[i+6] == "X") {
					this.player1.emit('Win', null);
					this.player2.emit('Lose', null);
					this.player1.disconnect();
					this.player2.disconnect();
					return;
				} else if (this.board[i] == "O" && this.board[i+3] == "O" && this.board[i+6] == "O") {
					this.player2.emit('Win', null);
					this.player1.emit('Lose', null);
					this.player1.disconnect();
					this.player2.disconnect();
					return;
				}
			}

			for (var i = 0; i < 9; i += 3) {
				if (this.board[i] == "X" && this.board[i+1] == "X" && this.board[i+2] == "X") {
					this.player1.emit('Win', null);
					this.player2.emit('Lose', null);
					this.player1.disconnect();
					this.player2.disconnect();
					return;
				} else if (this.board[i] == "O" && this.board[i+1] == "O" && this.board[i+2] == "O") {
					this.player2.emit('Win', null);
					this.player1.emit('Lose', null);
					this.player1.disconnect();
					this.player2.disconnect();
					return;
				}
			}

			if (this.board[0] == "X" && this.board[4] == "X" && this.board[8] == "X") {
					this.player1.emit('Win', null);
					this.player2.emit('Lose', null);
					this.player1.disconnect();
					this.player2.disconnect();
					return;
			} else if (this.board[0] == "O" && this.board[4] == "O" && this.board[8] == "O") {
					this.player2.emit('Win', null);
					this.player1.emit('Lose', null);
					this.player1.disconnect();
					this.player2.disconnect();
					return;
			} else if (this.board[2] == "X" && this.board[4] == "X" && this.board[6] == "X") {
					this.player1.emit('Win', null);
					this.player2.emit('Lose', null);
					this.player1.disconnect();
					this.player2.disconnect();
					return;
			} else if (this.board[2] == "O" && this.board[4] == "O" && this.board[6] == "O") {
					this.player2.emit('Win', null);
					this.player1.emit('Lose', null);
					this.player1.disconnect();
					this.player2.disconnect();
					return;
			}
			
			if (this.board.indexOf(" ") == -1) {
				this.player2.emit('Draw', null);
				this.player1.emit('Draw', null);
				this.player1.disconnect();
				this.player2.disconnect();
				return;
			}
		}
	};
	game.player1 = player1;
	game.player2 = player2;
	game.sendMsgP2("Make a move");
	game.sendMsgP1("Make a move");
	game.player2.on('move', function(data) {
		game.movePlayer2(data);
	});
	game.player1.on('move', function(data) {
		game.movePlayer1(data);
	});
	game.player2.on('disconnect', function() {
		if (game.player1 != null) {
			game.sendMsgP1("Disconnected");
			game.player1.disconnect();
			game.turn = 1;
		}
	});
	game.player1.on('disconnect', function() {
		if (game.player2 != null) {
			game.sendMsgP2("Disconnected");
			game.player2.disconnect();
			game.turn = 1;
		}
	});
	return game;
}
