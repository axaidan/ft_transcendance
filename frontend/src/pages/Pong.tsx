import { faGreaterThanEqual, faTrashRestore } from '@fortawesome/free-solid-svg-icons';
import { useContext, useEffect } from 'react';
import { SocketContext } from '../context';
import SocketContextComponent from '../context/UserSocket/Components';
import { AxiosJwt } from '../hooks';
import { useSocket } from '../hooks/useSocket';
import './pong.css'



export function Pong() {


	let canvas: HTMLCanvasElement;
	let game: 	{ball: {x:number, y:number, 
						speed: {x:number, y:number}} 
				player: {score:number, y:number, player:number}		
				player2: {score:number, y:number, player:number}		
				roomName: string
				mode: number	
				};
	let anim: number;
// On peut changer les dimensions de la balle et des joueurs, ex: autres modes de jeux
	var PLAYER_HEIGHT = 60;
	var PLAYER_WIDTH = 5;
	var BALL_HEIGHT = 10;
	let BALL_SPEED = 2;
	var BALL_ACCELERATE = true;
	const queryParams = new URLSearchParams(window.location.search);
	const live = queryParams.get('live');


		const axios = AxiosJwt();

	const {me, socket} = useContext(SocketContext).SocketState;



	function playerMove(event: any) {
//		console.log("test move event")
		//console.log(`meid: ${me.id}, gameplayeid1: ${game.player.player} gameplayerid2: ${game.player2.player}`)
		// Get the mouse location in the canvas
		var canvasLocation = canvas.getBoundingClientRect();
		var mouseLocation = event.clientY - canvasLocation.y;
		// Emit socket player position
		if (me.id === game.player.player) {
			game.player.y = mouseLocation - PLAYER_HEIGHT / 2;
			if (mouseLocation < PLAYER_HEIGHT / 2) {
				game.player.y = 0;
			} else if (mouseLocation > canvas.height - PLAYER_HEIGHT / 2) {
				game.player.y = canvas.height - PLAYER_HEIGHT;
			} else {
				game.player.y = mouseLocation - PLAYER_HEIGHT / 2;
			}
			//emit to room pos palette1 pallette2 balle x y vitesse x y 
			socket!.emit('updateGame', game.player.y + ':' + game.player2.y + ':' + game.ball.x +':'+game.ball.y + ':' + game.roomName)
		} else if (me.id === game.player2.player) {
			game.player2.y = mouseLocation - PLAYER_HEIGHT / 2;
			if (mouseLocation < PLAYER_HEIGHT / 2) {
				game.player2.y = 0;
			} else if (mouseLocation > canvas.height - PLAYER_HEIGHT / 2) {
				game.player2.y = canvas.height - PLAYER_HEIGHT;
			} else {
				game.player2.y = mouseLocation - PLAYER_HEIGHT / 2;
			}
			//emit to room pos palette1 pallette2 balle x y vitesse x y 
			socket!.emit('updateGame', game.player.y + ':' + game.player2.y + ':' + game.ball.x +':'+game.ball.y + ':' + game.roomName)
		}
	}
	


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

	function collide(player: {score:number, y:number, player: number}) {

		var bottom: Number;
		bottom = Number(player.y) + Number(PLAYER_HEIGHT);
		if (game.ball.y < player.y || game.ball.y > bottom) {
			// Set ball and players to the center
			game.ball.x = canvas.width / 2 - BALL_HEIGHT / 2;
			game.ball.y = canvas.height / 2 - BALL_HEIGHT / 2;
			game.ball.speed.y = BALL_SPEED;

			if (player == game.player ) {
				// Change ball direction + reset speed
				game.ball.speed.x = BALL_SPEED * -1;
				// Update score
				game.player2.score++;
				socket!.emit('printscore', game.player.score +":" + game.player2.score);
	//			socket.emit('roundStart', 0 + ":" + joueur1 + ":" + joueur2 + ":" + game.player.score + ":" + game.player2.score + ":right");
				document.querySelector('#player2-score').textContent = game.player2.score;
				if (game.player2.score >= 5 ){//|| document.querySelector('#player2-score').textContent == "5") {
					stop();
			//		clearDataGame();
				}
			} else {
				// Change ball direction + reset speed
				game.ball.speed.x = BALL_SPEED;
				// Update score
				game.player.score++;
				socket!.emit('printscore', game.player.score +":" + game.player2.score);
		//		socket.emit('roundStart', 0 + ":" + joueur1 + ":" + joueur2 + ":" + game.player.score + ":" + game.player2.score + ":left");
				document.querySelector('#player-score').textContent = game.player.score;
				if (game.player.score >= 5) {// || document.querySelector('#player-score').textContent == "5") {
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
			//socket!.emit('updateGame', game.player.y, game.player2.y, game.ball.x, game.ball.y, game.roomName)
		}
	}

	function changeDirection(playerPosition:number) {
	// Ball bounce
		var impact = game.ball.y - playerPosition - PLAYER_HEIGHT / 2;
		var ratio = 100 / (PLAYER_HEIGHT / 2);
		game.ball.speed.y = Math.round(impact * ratio / 10);
	}



	function draw() {
	// Draw Canvas
		if (canvas) {
			let context: CanvasRenderingContext2D | null = canvas.getContext('2d');

			if (context) { 
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
	function initScreen() {
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
						x: 0,
						y: 0, 
					}
				}
			}
			draw();
		}
	}
	function topinitParty(playerId1: number,playerId2: number, lobbyId:number) {
		console.log("fajklsdakljfsdolfjszdlkjfsdklajfsdkla")
		if (canvas) {
			game = {
				player: {
					y: canvas.height / 2 - PLAYER_HEIGHT / 2,
					score: 0,
					player: playerId1,

				},
				player2: {
					y: canvas.height / 2 - PLAYER_HEIGHT / 2,
					score: 0,
					player: playerId2
				},
				ball: {
					x: canvas.width / 2 - BALL_HEIGHT / 2,
					y: canvas.height / 2 - BALL_HEIGHT / 2,
					speed: {
						x: 2,
						y: 2, 
					}
				},
				roomName: 'game' + lobbyId.toString(), 
				mode: 1,
			}
			draw();
		}
	}
	function initParty() {

		if (canvas) {
			game = {
				player: {
					y: canvas.height / 2 - PLAYER_HEIGHT / 2,
					score: 0,

				},
				player2: {
					y: canvas.height / 2 - PLAYER_HEIGHT / 2,
					score: 0,
				},
				ball: {
					x: canvas.width / 2 - BALL_HEIGHT / 2,
					y: canvas.height / 2 - BALL_HEIGHT / 2,
					speed: {
						x: 2,
						y: 2, 
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

	function restore() {
		console.log("restore button clic")
		initParty();
		play();

	}

	function getIntoLobby() {
			axios.get('/lobby/join');
	}

	function deleteLobby() {
		axios.delete('/lobby/cleanAll')
	}

	useEffect(() => {
		let isMounted = true;
		canvas = document.getElementById('canvas');
		initScreen();
	//	initParty();
		play();
		canvas.addEventListener('mousemove', playerMove);

	//	if (live == null)
	//	canvas.addEventListener('mousemove', playerMove);
	//	return () => { isMounted = false };
		StartListeners();
	}, []);

	const StartListeners = ()=> {
	socket!.on("startGame", (...arg) => {
		game.player.player = arg[0].p1;
		game.player2.player = arg[0].p2;
		game.roomName = arg[0].lobbyId;
		game.mode = arg[0].mode;
		topinitParty(arg[0].p1, arg[0].p2, arg[0].lobbyId);

	}); 

	socket!.on("updatePos", (...arg) => {
		console.log('test update')
		game.player.y = arg[0];
		game.player2.y = arg[1];
		game.ball.x = arg[2];
		game.ball.y = arg[3];

	});
	};

	return (
		<div>
        <h1>Pong</h1>
        <main>
		<p className="canvas-score" id="scores">
		<em className="canvas-score" id="joueur1"></em>
		<em className="canvas-score" id="player-score">0</em> - <em id="joueur2"></em>
		<em className="canvas-score" id="player2-score">0</em></p>
         <canvas id="canvas"  />
		<button onClick={restore}> restore </button>
		<button onClick={initParty}> initParty</button>
		<button onClick={getIntoLobby}> queue</button>
		<button onClick={deleteLobby}> delete lobby</button>
        </main>
        <p>Jeu a mettre ici</p>
      </div>
	)
}
