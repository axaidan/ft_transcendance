import { useEffect } from 'react';
import './pong.css'

export function Pong() {


	var canvas;
	var game;
	var anim;
	// On peut changer les dimensions de la balle et des joueurs, ex: autres modes de jeux
	var PLAYER_HEIGHT = 60;
	var PLAYER_WIDTH = 5;
	var BALL_HEIGHT = 10;
	var BALL_SPEED = 2;
	var BALL_ACCELERATE = true;
	const queryParams = new URLSearchParams(window.location.search);
	const live = queryParams.get('live');

	function ballMove() {
		// Rebounds on top and bottom
		if (live == null) {
			if (game.ball.y > canvas.height || game.ball.y < 0) {
				game.ball.speed.y *= -1;
			}
			if (game.ball.x > canvas.width - PLAYER_WIDTH) {
				collide(game.player2);
			} else if (game.ball.x < PLAYER_WIDTH) {
				collide(game.player);
			}
			// Ball progressive speed
			game.ball.x += game.ball.speed.x;
			game.ball.y += game.ball.speed.y;
			//socket.emit('ballMoveFront', joueur1 + ":" + joueur2 + ":" + game.ball.x + ":" + game.ball.y + ":" + game.ball.speed.x + ":" + game.ball.speed.y);
		}
	}

	function collide(player) {

		var bottom: Number;
		bottom = Number(player.y) + Number(PLAYER_HEIGHT);
		if (game.ball.y < player.y || game.ball.y > bottom) {
			// Set ball and players to the center
			game.ball.x = canvas.width / 2 - BALL_HEIGHT / 2;
			game.ball.y = canvas.height / 2 - BALL_HEIGHT / 2;
			game.ball.speed.y = BALL_SPEED;

			if (player == game.player) {
				// Change ball direction + reset speed
				game.ball.speed.x = BALL_SPEED * -1;
				// Update score
				game.player2.score++;
				//			socket.emit('roundStart', 0 + ":" + joueur1 + ":" + joueur2 + ":" + game.player.score + ":" + game.player2.score + ":right");
				document.querySelector('#player2-score').textContent = game.player2.score;
				if (game.player2.score === 5) {//|| document.querySelector('#player2-score').textContent == "5") {
					stop();
					//		clearDataGame();
				}
			} else {
				// Change ball direction + reset speed
				game.ball.speed.x = BALL_SPEED;
				// Update score
				game.player.score++;
				//		socket.emit('roundStart', 0 + ":" + joueur1 + ":" + joueur2 + ":" + game.player.score + ":" + game.player2.score + ":left");
				document.querySelector('#player-score').textContent = game.player.score;
				if (game.player.score === 5) {// || document.querySelector('#player-score').textContent == "5") {
					stop();
					//		clearDataGame();
				}
			}
		} else {
			// Increase speed and change direction
			if (BALL_ACCELERATE)
				game.ball.speed.x *= -1.2;
			else
				game.ball.speed.x *= -1;
			changeDirection(player.y);
		}
	}

	function changeDirection(playerPosition) {
		// Ball bounce
		var impact = game.ball.y - playerPosition - PLAYER_HEIGHT / 2;
		var ratio = 100 / (PLAYER_HEIGHT / 2);
		game.ball.speed.y = Math.round(impact * ratio / 10);
	}



	function draw() {
		// Draw Canvas
		if (canvas) {
			var context = canvas.getContext('2d');

			context.fillStyle = 'black';
			context.fillRect(0, 0, canvas.width, canvas.height);
			// Draw middle line
			context.strokeStyle = 'white';
			context.beginPath();
			context.moveTo(canvas.width / 2, 1);
			context.lineTo(canvas.width / 2, canvas.height - 1);
			context.stroke();

			context.beginPath();
			context.moveTo(0, 0)
			context.lineTo(canvas.width, 0);
			context.stroke();

			context.beginPath();
			context.moveTo(0, canvas.height)
			context.lineTo(canvas.width, canvas.height);
			context.stroke();

			context.fillStyle = 'white';
			context.fillRect(0, game.player.y, PLAYER_WIDTH, PLAYER_HEIGHT);
			context.fillRect(canvas.width - PLAYER_WIDTH, game.player2.y, PLAYER_WIDTH, PLAYER_HEIGHT);
			context.beginPath();
			context.fillStyle = 'red';
			// context.fillRect(game.ball.x, game.ball.y, BALL_HEIGHT, BALL_HEIGHT);
			context.arc(game.ball.x + (BALL_HEIGHT / 2), game.ball.y, BALL_HEIGHT / 2, 0, 2 * Math.PI);
			context.fill();

		}
	}

	function stop() {

		cancelAnimationFrame(anim);

		game.ball.x = canvas.width / 2 - BALL_HEIGHT / 2;
		game.ball.y = canvas.height / 2 - BALL_HEIGHT / 2;
		game.player.y = canvas.height / 2 - PLAYER_HEIGHT / 2;
		game.player2.y = canvas.height / 2 - PLAYER_HEIGHT / 2;
		// Reset speed
		game.ball.speed.x = 0;
		game.ball.speed.y = 0;


	}

	function initParty() {
		if (canvas) {
			game = {
				player: {
					y: canvas.height / 2 - PLAYER_HEIGHT / 2,
					score: 0
				},
				player2: {
					y: canvas.height / 2 - PLAYER_HEIGHT / 2,
					score: 0
				},
				ball: {
					x: canvas.width / 2 - BALL_HEIGHT / 2,
					y: canvas.height / 2 - BALL_HEIGHT / 2,
					speed: {
						x: BALL_SPEED,
						y: BALL_SPEED
					}
				}
			}
			draw();
		}
	}

	function play() {
		draw();
		ballMove();
		anim = requestAnimationFrame(play);
	}


	useEffect(() => {
		let isMounted = true;
		canvas = document.getElementById('canvas');
		initParty();
		play();
		// if (live == null)
		// 	canvas.addEventListener('mousemove', playerMove);
		return () => { isMounted = false };
	}, []);



	return (
		<div>
			<h1>Pong</h1>
			<main>
				<p className="canvas-score" id="scores">
					<em className="canvas-score" id="joueur1"></em>
					<em className="canvas-score" id="player-score">0</em> - <em id="joueur2"></em>
					<em className="canvas-score" id="player2-score">0</em></p>
				<canvas id="canvas" />
				<button onClick={draw()}> playyyyyyyyyyyyyyyy </button>
				<button onClick={initParty()}> playyakfjsk</button>
			</main>
			<p>Jeu a mettre ici</p>
		</div>
	)
}
