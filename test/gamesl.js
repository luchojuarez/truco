var utils = require('./utils');
var mongoose = require('mongoose');
var expect = require("chai").expect;
var playerModel = require("../models/player");
var gameModel   = require("../models/game");
var roundModel  = require("../models/round");
var gameCard    = require("../models/card");

var Round = roundModel.round;
var Game = gameModel.game;
var Card = gameCard.card;
var Player = playerModel.player;

//Funciones a testear para guardar/cargar, utilizan callbacks
    function saveGame(gameObject,cb) {
		gameObject.currentRound.save(function(err, savedround) {
			if (err)
				cb(err);
			game.save(function(err, savedgame) {
				if (err) {
					cb(err);
				}
				cb(err,savedgame);
			});
		});
	}
		
	function loadGameById(gameId,cb) {
	Game
		.findOne({_id : gameId })
		.populate("currentRound")
		.exec(function (err,tgame) {
			if (err)
				cb(err,undefined);

            console.log("GAME LOADED: ",tgame._id);
			cb(err,tgame);
	});
	}

describe('GameSave&Restore', function(){



//BFeach
  beforeEach(function(){
    game = new Game({name : "nuevoJuego" });
    game.player1 = new Player({ nickname: 'J' });
    game.player2 = new Player({ nickname: 'X' });
    game.newRound({game : game, currentTurn : game.currentHand });

    // Force to have the following cards and envidoPoints
    game.player1.setCards([
        new Card(1, 'espada'),
        new Card(3, 'oro'),
        new Card(7, 'espada')
    ]);

    game.player2.setCards([
        new Card(7, 'oro'),
        new Card(7, 'basto'),
        new Card(2, 'basto')
    ]);

	//Do some moves
    game.play('player1', 'truco');
    game.play('player2', 'quiero');
    game.play('player1', 'playCard',game.player1.cards[0]); //juega 1 espada
    game.play('player2', 'playCard',game.player2.cards[1]); //juega 4 basto
    //game.play('player1', 'playCard',game.player1.cards[1]); //juega 3 oro
    //game.play('player2', 'playCard',game.player2.cards[2]); //juega 2 basto

  });
	
//Begin

   it('should save a game', function(done) {
    //Keep the old card count in the board
    var pretestCardsCount = game.currentRound.board[0].length + game.currentRound.board[1].length
    //just another move
    game.play('player1', 'playCard',game.player1.cards[1]); //juega 3 oro
        player1 = game.player1;
        player2 = game.player2;
		saveGame(game,function (err,thegame) {
        	if (err)
				done(err);

            var preSaveBoard = game.currentRound.board;
            var preCardsCount = preSaveBoard[0].length+preSaveBoard[1].length;
            var savedBoard = thegame.currentRound.board;
            var savedCardsCount = savedBoard[0].length+savedBoard[1].length;


			expect(preCardsCount).to.be.eq(savedCardsCount);
            expect(savedCardsCount).to.not.be.eq(pretestCardsCount);
			expect(game.currentRound.fsm).to.be.eq(thegame.currentRound.fsm);
			expect(game.name).to.be.eq(thegame.name);
			done();
		});
	});


  it('Load a saved game', function(done) {

    var gameId;                                                               
    saveGame(game,function (err,savedgame) {
        if (err) {
            done(err);
        }
        gameId = savedgame._id;
        console.log("saved game id",gameId);
    });
    setTimeout(function() {
        loadGameById(gameId,function (err,loaded) {
            if (err) done(err);
            console.log("game loaded  ", loaded._id);
            expect(true).to.be.ok;
            done()
        })
    }, 200);

  });

});

