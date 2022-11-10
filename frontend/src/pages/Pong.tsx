import { faGreaterThanEqual, faTrashRestore } from '@fortawesome/free-solid-svg-icons';
import { useContext, useEffect } from 'react';
import { SocketContext } from '../context';
import SocketContextComponent from '../context/UserSocket/Components';
import { AxiosJwt } from '../hooks';
import { useSocket } from '../hooks/useSocket';
//import './pong.css'
import { useRef } from 'react';

//import useWindowDimensions from "./useWindowDimensions"


export function Pong() {

	const canvasRef = useRef<HTMLCanvasElement | null>(null);

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
	let PLAYER_HEIGHT = 60;
	let PLAYER_WIDTH = 5;
	let BALL_HEIGHT = 10;
	let BALL_SPEED = 1;
	var BALL_ACCELERATE = true;
	const queryParams = new URLSearchParams(window.location.search);
	const live = queryParams.get('live');


		const axios = AxiosJwt();

	const {me, socket} = useContext(SocketContext).SocketState;

	//const { height, width } = useWindowDimensions();


	function playerMove(event: any) {
//		console.log("test move event")
		//console.log(`meid: ${me.id}, gameplayeid1: ${game.player.player} gameplayerid2: ${game.player2.player}`)
		// Get the mouse location in the canvas
		var canvasLocation = canvas.getBoundingClientRect().y;
		var mouseLocation = (event.clientY - canvasLocation) ;
	//	console.log(`mouselocation ${mouseLocation} , height canvas ${canvas.height}`);
	//	console.log()
		// Emit socket player position
		if (me.id === game.player.player) {
			game.player.y = mouseLocation - PLAYER_HEIGHT / 2;
			if (mouseLocation <= PLAYER_HEIGHT / 2) {
				game.player.y = 0;
			} else if (mouseLocation > canvas.height  - PLAYER_HEIGHT / 2) {
				game.player.y = canvas.height - PLAYER_HEIGHT;
			} else {
				game.player.y = mouseLocation  - PLAYER_HEIGHT/2 ;
			}
			//emit to room pos palette1 pallette2 balle x y vitesse x y 
			// je dois emit seulement les pad et non la balle 
			socket!.emit('padUpdate', game.roomName + ':' + (game.player.y / canvas.height) + ':' + (game.player2.y/ canvas.height));
		} else if (me.id === game.player2.player) {
			game.player2.y = mouseLocation - PLAYER_HEIGHT / 2;
			if (mouseLocation <= PLAYER_HEIGHT / 2) {
				game.player2.y = 0;
			} else if (mouseLocation > canvas.height - PLAYER_HEIGHT / 2) {
				game.player2.y = canvas.height - PLAYER_HEIGHT;
			} else {
				game.player2.y = mouseLocation  - PLAYER_HEIGHT/2 ;
			}
			//emit to room pos palette1 pallette2 balle x y vitesse x y 
			socket!.emit('padUpdate', game.roomName + ':' + (game.player.y /canvas.height) + ':' + (game.player2.y/canvas.height));
			//socket!.emit('updateGame', game.player.y + ':' + game.player2.y + ':' + game.ball.x +':'+game.ball.y + ':' + game.roomName)
		}
	}
	


	function ballMove() {
		// Rebounds on top and bottom
			if (game.ball.y >= canvas.height || game.ball.y <= 0) {
				game.ball.speed.y *= -1;
			}
			if (game.ball.x > canvas.width - PLAYER_WIDTH) {
				collide(game.player2);
			} else if (game.ball.x < PLAYER_WIDTH) {
				collide(game.player);
			}
			// Ball progressive speed
		//	if (Math.abs( game.ball.x ) < 0.5 )
			if (Math.abs(game.ball.speed.y) < 0.5) {
				let i = 1;
				if (game.ball.speed.y < 0) {
					i = -1;
				}
				game.ball.speed.y = 0.5 * i;
			}
			if (Math.abs(game.ball.speed.x) < 0.5) {
				let i = 1;
				if (game.ball.speed.x < 0) {
					i = -1;
				}
				game.ball.speed.x = 0.5 * i;
			}

			game.ball.x += game.ball.speed.x;
			game.ball.y += game.ball.speed.y;
			//socket.emit('ballMoveFront', joueur1 + ":" + joueur2 + ":" + game.ball.x + ":" + game.ball.y + ":" + game.ball.speed.x + ":" + game.ball.speed.y);
			// emit seulement la balle
			socket!.emit('updateBall', game.roomName + ':' +(game.ball.x/ canvas.width) +':'+ (game.ball.y/ canvas.height) + ':'+ (game.ball.speed.x / canvas.width)+':' + (game.ball.speed.y / canvas.height))
//			socket!.emit('updateGame', game.player.y + ':' + game.player2.y + ':' + game.ball.x +':'+game.ball.y + ':' + game.roomName)
	}

	function collide(player: {score:number, y:number, player: number}) {

		var bottom: Number;
		bottom = Number(player.y) + Number(PLAYER_HEIGHT);
		if (game.ball.y < player.y || game.ball.y > bottom) {
			// Set ball and players to the center
			game.ball.x = canvas.width / 2 - BALL_HEIGHT / 2;
			game.ball.y = canvas.height / 2 - BALL_HEIGHT / 2;
			game.ball.speed.y = BALL_SPEED;

				console.log('balle predu');
			if (player === game.player ) {
				console.log('p1 op')
				// Change ball direction + reset speed
				game.ball.speed.x = BALL_SPEED * -1;
				// Update score
				game.player2.score++;
				socket!.emit('printscore', game.roomName + ":" + game.player.score +":" + game.player2.score);

				socket!.emit('updateGame', (game.player.y / canvas.height) + ':' + (game.player2.y / canvas.height) + ':' + (game.ball.x/canvas.width) +':'+ (game.ball.y/ canvas.height) + ':' + game.roomName)
				document.querySelector('#player2-score')!.textContent = game.player2.score.toString();
				var t = document.querySelector('#player2-score')!.textContent;


			
				if (game.player2.score >= 5 || (t && parseInt(t) >= 5)) {
					console.log('end game normaly')
					socket!.emit('end', game.roomName + ':' + game.player.score + ':' + game.player2.score);




					//stop();
			//		clearDataGame();
				}
			} else {
				// Change ball direction + reset speed
				console.log('p2 op')
				game.ball.speed.x = BALL_SPEED;
				// Update score
				game.player.score++;
				socket!.emit('printscore', game.roomName + ":" + game.player.score +":" + game.player2.score);
				//socket!.emit('updateGame', game.player.y + ':' + game.player2.y + ':' + game.ball.x +':'+game.ball.y + ':' + game.roomName)
				socket!.emit('updateGame', (game.player.y / canvas.height) + ':' + (game.player2.y / canvas.height) + ':' + (game.ball.x/canvas.width) +':'+ (game.ball.y/ canvas.height) + ':' + game.roomName)
				document.querySelector('#player-score')!.textContent = game.player.score.toString();
				var t = document.querySelector('#player-score')!.textContent;
				if (game.player2.score >= 5 || (t && parseInt(t) >= 5)) {
					console.log('end game by player2')
					socket!.emit('end', game.roomName + ':' + game.player.score + ':' + game.player2.score);
					//stop();
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
		socket!.emit('updateBall', game.roomName + ':' +(game.ball.x/ canvas.width) +':'+ (game.ball.y/ canvas.height) + ':'+ (game.ball.speed.x / canvas.width)+':' + (game.ball.speed.y / canvas.height))
		//socket!.emit('updateGame', game.player.y + ':' + game.player2.y + ':' + game.ball.x +':'+game.ball.y + ':' + game.roomName)


		}
	}

	function changeDirection(playerPosition:number) {
	// Ball bounce
		var impact = game.ball.y - playerPosition - PLAYER_HEIGHT / 2;
		var ratio = 100 / (PLAYER_HEIGHT / 2);
		game.ball.speed.y = Math.round(impact * ratio / 10);
		if (Math.abs(game.ball.speed.x) < 0.1)
		{
			let sign = 1;
			if (game.ball.speed.x <0)
				sign = -1;
			game.ball.speed.x = 0.2 * sign;
		}
	}



	function draw() {
	// Draw Canvas
		if (canvas) {
			let context: CanvasRenderingContext2D | null = canvas.getContext('2d');

			if (context) { 
				PLAYER_HEIGHT = canvas.height/3;
				PLAYER_WIDTH = canvas.width/100;
				BALL_HEIGHT = canvas.height/12;
				BALL_SPEED= canvas.width /400;

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

	function handleResize() {
		canvas.height = window.innerHeight - 100;
		canvas.width = window.innerWidth - 270;

		PLAYER_HEIGHT = canvas.height/3;
		PLAYER_WIDTH = canvas.width/100;
		BALL_HEIGHT = canvas.height/12;
		//draw();
	}

	function stop() {

		cancelAnimationFrame(anim);

		game.ball.x = canvas.width / 2 - BALL_HEIGHT / 2;
		game.ball.y = canvas.height / 2 - BALL_HEIGHT / 2;
		game.player.y = canvas.height / 2 - PLAYER_HEIGHT / 2;
		game.player2.y = canvas.height / 2 - PLAYER_HEIGHT / 2;

		game.ball.speed.x = 0;
		game.ball.speed.y = 0;

		cancelAnimationFrame(anim);


	}
	function initScreen() {
		if (canvas) {
			game = {
				player: {
					y: canvas.height / 2 - PLAYER_HEIGHT / 2,
					score: 0,
					player: 0,
				},
				player2: {
					y: canvas.height / 2 - PLAYER_HEIGHT / 2,
					score: 0,
					player: 0,
				},
				ball: {
					x: canvas.width / 2 - BALL_HEIGHT / 2,
					y: canvas.height / 2 - BALL_HEIGHT / 2,
					speed: {
						x: 0,
						y: 0, 
					}
				},
				roomName : '0',
				mode: 0,
			}
			draw();
		}
	}

	function topinitParty(playerId1: number,playerId2: number, lobbyId:number) {
		console.log("fajklsdakljfsdolfjszdlkjfsdklajfsdkla")
		if (canvas) {
			console.log(`init game: user1, user2 ${playerId1}${playerId2} lobbyId ${lobbyId}`)
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
						x: 1,
						y: 1, 
					}
				},
				roomName: 'game' + lobbyId.toString(), 
				mode: 1,
			}
			document.querySelector('#player-score').textContent = "0";
			document.querySelector('#player2-score').textContent = "0";
			draw();
		}
		else {
			console.log('ya pas conva')
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
		window.addEventListener("resize", handleResize);
		canvas = document.getElementById('canvas');
		initScreen();
	//	initParty();
		play();
		canvas.addEventListener('mousemove', playerMove);
		StartListeners();
	}, []);


	/*
	window.addEventListener('resize', function (event) {
		draw();
	}, true);
	*/

	const StartListeners = ()=> {

		socket!.on("startGame", (...arg) => {
			console.log('game start')
			game.player.player = arg[0].p1;
			game.player2.player = arg[0].p2;
			game.roomName = arg[0].lobbyId;
			game.mode = arg[0].mode;
			topinitParty(arg[0].p1, arg[0].p2, arg[0].lobbyId);
		}); 

		socket!.on("updatePos", (...arg) => {
			game.player.y = arg[0] * canvas.height;
			game.player2.y = arg[1]* canvas.height;
			game.ball.x = arg[2]* canvas.width;
			game.ball.y = arg[3]* canvas.height;
		});

		socket!.on("updateScore", (...arg) => {
			game.player.score = arg[0];
			game.player2.score = arg[1];
			document.querySelector('#player-score')!.textContent = game.player.score.toString();
			document.querySelector('#player2-score')!.textContent = game.player2.score.toString();
		});

		socket!.on("padUpdat", (...arg) => {
			game.player.y = arg[0] * canvas.height;
			game.player2.y = arg[1] * canvas.height;
		});

		socket!.on("updatBall", (...arg)=> {
		//	console.log(`arg :${arg[0]}, ${arg[1]}`)
			game.ball.x = arg[0];
			game.ball.x *= canvas.width;
			game.ball.y = arg[1];
			game.ball.y *= canvas.height;
			console.log(`canvas width height ${canvas.width}, ${canvas.height}`)
			game.ball.speed.x = arg[2] * canvas.width;
			game.ball.speed.y = arg[3] * canvas.height;
		});

		socket!.on('end', (...arg) => {
			game.player.score = arg[0];
			game.player2.score = arg[1];
			stop();
		})
		/*()
		socket!.on("endGame", (...arg) => {
			console.log("endtoend finis")
			game.player.score = arg[0];
			game.player2.score = arg[1];
			document.querySelector('#player-score').textContent = game.player.score.toString();
			document.querySelector('#player2-score').textContent = game.player2.score.toString();
		
			stop();
		});*/

	};

	return (
		<div>
        <h1>Pong</h1>
        <main>
		<p className="canvas-score" id="scores">
		<em className="canvas-score" id="joueur1"></em>
		<em className="canvas-score" id="player-score">0</em> - <em id="joueur2"></em>
		<em className="canvas-score" id="player2-score">0</em></p>
         <canvas id={'canvas'}  /> 
		<button onClick={restore}> restore </button>
		<button onClick={initParty}> initParty</button>
		<button onClick={getIntoLobby}> queue</button>
		<button onClick={deleteLobby}> delete lobby</button>
        </main>
        <p>Jeu a mettre ici</p>
      </div>
	)
}
