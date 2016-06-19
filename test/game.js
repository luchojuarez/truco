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

describe('Game', function(){

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
  });


  it('Should have two players', function(){
    expect(game).to.have.property('player1');
    expect(game).to.have.property('player2');
  });


describe('Game#play', function(){


  it('plays [envido, quiero] should gives 2 points to winner', function(){
    game.play('player1', 'envido');
    game.play('player2', 'quiero');

    expect(game.score[1]).to.equal(2);
  });

  it('plays [envido, no_quiero] should give 1 points to who ever chanted envido', function() {
    game.play('player1', 'envido');
    game.play('player2', 'no_quiero');
    expect(game.score[0]).to.equal(1);
  });

    it('plays [truco, quiero] should gives 2 points to winner', function(){
      
      game.play('player1', 'truco');
      game.play('player2', 'quiero');
      game.play('player1', 'playCard',game.player1.cards[0]); //juega 1 espada
      game.play('player2', 'playCard',game.player2.cards[1]); //juega 4 basto
      game.play('player1', 'playCard',game.player1.cards[1]); //juega 3 oro
      game.play('player2', 'playCard',game.player2.cards[2]); //juega 2 basto
      expect(game.score[0]).to.equal(2);
    });
   it('plays some cards then player2 chants truco and player 1 declines it, increase 1 in the score of player 2 ', function() {
	var cardsp1 = game.player1.cards;
	var cardsp2 = game.player2.cards;
	var oldscore = game.score[1];
	game.play('player1', 'playCard', cardsp1[0]); //1 espada
	game.play('player2','playCard', cardsp2[1]); //4 basto
	game.play('player1','playCard', cardsp1[1]); //3 oro
	game.play('player2','playCard', cardsp2[0]); // 7 oro
	game.play('player2','truco');
	game.play('player1','no_quiero');
	expect(game.score[1]).to.be.equal(oldscore+1);
   });

   it('plays a round with all ties, player 1(the hand) wons, also truco is chanted', function() {
    game.player1.setCards([
        new Card(4, 'espada'),
        new Card(5, 'oro'),
        new Card(6, 'espada')
    ]);

    game.player2.setCards([
        new Card(4, 'oro'),
        new Card(5, 'basto'),
        new Card(6, 'basto')
    ]);
 	var cardsp1 = game.player1.cards;
	var cardsp2 = game.player2.cards;
	game.play('player1','playCard', cardsp1[0]);
	game.play('player2','playCard', cardsp2[0]);
	game.play('player1','playCard', cardsp1[1]);
	game.play('player2','truco');
	game.play('player1','quiero');
	game.play('player2','playCard', cardsp2[1]); 
	game.play('player1','playCard', cardsp1[2]); 
	game.play('player2','playCard', cardsp2[2]);
	expect(game.score[0]).to.be.equal(2);
    });
});

});