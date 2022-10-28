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

	function draw() {
	// Draw Canvas
		if (canvas) {
			var context = canvas.getContext('2d');

			context.fillStyle = 'black';
			context.fillRect(0, 0, canvas.width, canvas.height);
			// Draw middle line
			context.strokeStyle = 'white';
			context.beginPath();
			context.moveTo(canvas.width / 2, 0);
			context.lineTo(canvas.width / 2, canvas.height);
			context.stroke();

			context.fillStyle = 'white';
			context.fillRect(0, game.player.y, PLAYER_WIDTH, PLAYER_HEIGHT);
			context.fillRect(canvas.width - PLAYER_WIDTH, game.player2.y, PLAYER_WIDTH, PLAYER_HEIGHT);
			context.beginPath();
			context.fillStyle = 'white';
			context.fillRect(game.ball.x, game.ball.y, BALL_HEIGHT, BALL_HEIGHT);
			context.fill();

		}
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


	useEffect(() => {
		let isMounted = true;
		canvas = document.getElementById('canvas');
		initParty();
		return () => { isMounted = false };
	}, []);

	return (
		<div>
        <h1>Pong</h1>
        <main>
         <canvas id="canvas"  />
		<button onClick={draw()}> playyyyyyyyyyyyyyyy </button>
		<button onClick={initParty()}> playyakfjsk</button>
        </main>
        <p>Jeu a mettre ici</p>
      </div>
	)
}
