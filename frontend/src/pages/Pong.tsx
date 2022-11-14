import { useContext, useEffect, useState } from 'react';
import { SocketContext } from '../context';
import { AxiosJwt } from '../hooks';
import './pong.css'

export function Pong() {
	const [inLobby, setInLobby] = useState<boolean>(false);
	const [inGame, setInGame] = useState<boolean>(false);
	const [endGame, setEndGame] = useState<boolean>(true);
	const [normalQueue, setNormalQueue] = useState<boolean>(false);
	const [smallQueue, setSmallQueue] = useState<boolean>(false);
	const [fastQueue, setFastQueue] = useState<boolean>(false);

	let canvas: HTMLCanvasElement;

	let game: {
		ball: {
			x: number, y: number,
			speed: { x: number, y: number }
		}
		player: { score: number, y: number, player: number }
		player2: { score: number, y: number, player: number }
		roomName: string
		mode: number,
		rematch1: number,
		rematch2: number,
	};
	let PLAYER_HEIGHT = 60;
	let PLAYER_WIDTH = 5;
	let BALL_HEIGHT = 10;
	let BALL_SPEED = 3;
	var BALL_ACCELERATE = true;

	let vstop = 0;

	const axios = AxiosJwt();

	const { me, socket } = useContext(SocketContext).SocketState;



	function playerMove(event: any) {
		// Get the mouse location in the canvas
		var canvasLocation = canvas.getBoundingClientRect().y;
		var mouseLocation = (event.clientY - canvasLocation);
		// Emit socket player position
		if (me.id === game.player.player) {
			game.player.y = mouseLocation - PLAYER_HEIGHT / 2;
			if (mouseLocation <= PLAYER_HEIGHT / 2) {
				game.player.y = 0;
			} else if (mouseLocation > canvas.height - PLAYER_HEIGHT / 2) {
				game.player.y = canvas.height - PLAYER_HEIGHT;
			} else {
				game.player.y = mouseLocation - PLAYER_HEIGHT / 2;
			}
			//emit to room pos palette1 pallette2 balle x y vitesse x y 
			// je dois emit seulement les pad et non la balle 
			socket!.emit('padUpdate', game.roomName + ':' + (game.player.y / canvas.height) + ':' + (game.player2.y / canvas.height));
		} else if (me.id === game.player2.player) {
			game.player2.y = mouseLocation - PLAYER_HEIGHT / 2;
			if (mouseLocation <= PLAYER_HEIGHT / 2) {
				game.player2.y = 0;
			} else if (mouseLocation > canvas.height - PLAYER_HEIGHT / 2) {
				game.player2.y = canvas.height - PLAYER_HEIGHT;
			} else {
				game.player2.y = mouseLocation - PLAYER_HEIGHT / 2;
			}
			//emit to room pos palette1 pallette2 balle x y vitesse x y 
			socket!.emit('padUpdate', game.roomName + ':' + (game.player.y / canvas.height) + ':' + (game.player2.y / canvas.height));
		}
	}



	async function ballMove() {
		// Rebounds on top and bottom

		if (game.player.score >= 5 || game.player2.score >= 5) {
			stop();
		}
		if (game.ball.y >= canvas.height || game.ball.y <= 0) {
			game.ball.speed.y *= -1;
		}
		if (game.ball.x > canvas.width - PLAYER_WIDTH) {
			collide(game.player2);
		} else if (game.ball.x < PLAYER_WIDTH) {
			collide(game.player);
		}
		// Ball progressive speed
		if (game.player.score < 5 && game.player2.score < 5 && vstop === 0) {
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
		}

		game.ball.x += game.ball.speed.x;
		game.ball.y += game.ball.speed.y / 4;
		// emit seulement la balle
		socket!.emit('updateBall', game.roomName + ':' + (game.ball.x / canvas.width) + ':' + (game.ball.y / canvas.height) + ':' + (game.ball.speed.x / canvas.width) + ':' + (game.ball.speed.y / canvas.height))
	}

	function collide(player: { score: number, y: number, player: number }) {

		var bottom: Number;
		bottom = Number(player.y) + Number(PLAYER_HEIGHT);
		if (game.ball.y < player.y || game.ball.y > bottom) {
			// Set ball and players to the center
			game.ball.x = canvas.width / 2;
			game.ball.y = canvas.height / 2;
			game.ball.speed.y = BALL_SPEED;

			console.log('balle predu');
			if (player === game.player) {
				// Change ball direction + reset speed
				game.ball.speed.x = BALL_SPEED * -1;
				// Update score
				game.player2.score++;
				if (game.roomName !== "0")
					socket!.emit('printscore', game.roomName + ":" + game.player.score + ":" + game.player2.score);

				socket!.emit('updateGame', (game.player.y / canvas.height) + ':' + (game.player2.y / canvas.height) + ':' + (game.ball.x / canvas.width) + ':' + (game.ball.y / canvas.height) + ':' + game.roomName)
				document.querySelector('#player2-score')!.textContent = game.player2.score.toString();
				var t = document.querySelector('#player2-score')!.textContent;

				if (game.player2.score >= 5 || (t && parseInt(t) >= 5)) {
					setInGame(false);
					if (me.id === game.player2.player)
						socket!.emit('end', game.roomName + ':' + game.player.score + ':' + game.player.player + ':' + game.player2.score + ':' + game.player2.player);
					stop();
					//		clearDataGame();
				}
			} else {
				// Change ball direction + reset speed
				game.ball.speed.x = BALL_SPEED;
				// Update score
				game.player.score++;
				if (game.roomName !== "0")
					//socket!.emit('printscore', game.roomName + ":" + game.player.score +":" + game.player2.score);
					socket!.emit('printscore1', game.roomName + ":" + game.player.score + ":" + game.player2.score);
				//socket!.emit('updateGame', game.player.y + ':' + game.player2.y + ':' + game.ball.x +':'+game.ball.y + ':' + game.roomName)
				socket!.emit('updateGame', (game.player.y / canvas.height) + ':' + (game.player2.y / canvas.height) + ':' + (game.ball.x / canvas.width) + ':' + (game.ball.y / canvas.height) + ':' + game.roomName)
				document.querySelector('#player-score')!.textContent = game.player.score.toString();
				var t = document.querySelector('#player-score')!.textContent;
				if (game.player.score >= 5 || (t && parseInt(t) >= 5)) {
					setInGame(false);
					// game.player2.player

					if (me.id === game.player.player)
						socket!.emit('end', game.roomName + ':' + game.player.score + ':' + game.player.player + ':' + game.player2.score + ':' + game.player2.player);
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
			socket!.emit('updateBall', game.roomName + ':' + (game.ball.x / canvas.width) + ':' + (game.ball.y / canvas.height) + ':' + (game.ball.speed.x / canvas.width) + ':' + (game.ball.speed.y / canvas.height))
		}
	}

	function changeDirection(playerPosition: number) {
		// Ball bounce
		var impact = game.ball.y - playerPosition - PLAYER_HEIGHT / 2;
		var ratio = 100 / (PLAYER_HEIGHT / 2);
		game.ball.speed.y = Math.round(impact * ratio / 10);
		if (Math.abs(game.ball.speed.x) < 0.1) {
			let sign = 1;
			if (game.ball.speed.x < 0)
				sign = -1;
			game.ball.speed.x = 0.2 * sign;
		}
	}



	async function draw() {
		// Draw Canvas
		if (!game)
			console.log('no game');
		if (canvas) {
			let context: CanvasRenderingContext2D | null = canvas.getContext('2d');
			if (context) {
				if (game.mode === 2) {
					PLAYER_HEIGHT = canvas.height / 3;
					PLAYER_WIDTH = canvas.width / 100;
					BALL_HEIGHT = canvas.height / 25;
					BALL_SPEED = canvas.width / 50;
				}
				else if (game.mode === 1) {
					PLAYER_HEIGHT = canvas.height / 5;
					PLAYER_WIDTH = canvas.width / 100;
					BALL_HEIGHT = canvas.height / 12;
					BALL_SPEED = canvas.width / 250;

				}
				else {
					PLAYER_HEIGHT = canvas.height / 3;
					PLAYER_WIDTH = canvas.width / 100;
					BALL_HEIGHT = canvas.height / 12;
					BALL_SPEED = canvas.width / 250;

				}

				context.fillStyle = 'black';
				context.fillRect(0, 0, canvas.width, canvas.height);
				// Draw middle line
				context.strokeStyle = 'white';
				context.beginPath();
				context.moveTo(canvas.width / 2, 1);
				context.lineTo(canvas.width / 2, canvas.height - 1);
				context.stroke();


				context.fillStyle = 'white';
				context.fillRect(0, game.player.y, PLAYER_WIDTH, PLAYER_HEIGHT);
				context.fillRect(canvas.width - PLAYER_WIDTH, game.player2.y, PLAYER_WIDTH, PLAYER_HEIGHT);
				context.beginPath();
				context.fillStyle = 'red';
				context.arc(game.ball.x, game.ball.y, BALL_HEIGHT / 2, 0, 2 * Math.PI, 1);
				// context.fillRect(game.ball.x, game.ball.y, BALL_HEIGHT, BALL_HEIGHT);
				context.fill();

			}

		}
	}

	function handleResize() {
		canvas.width = window.innerWidth - 270;
		canvas.height = canvas.width / 2;

		PLAYER_HEIGHT = canvas.height / 3;
		PLAYER_WIDTH = canvas.width / 100;
		BALL_HEIGHT = canvas.height / 12;
		//draw();
	}

	function stop() {

		//		cancelAnimationFrame(anim);

		game.ball.x = canvas.width / 2;
		game.ball.y = canvas.height / 2 - BALL_HEIGHT / 2;
		game.player.y = canvas.height / 2 - PLAYER_HEIGHT / 2;
		game.player2.y = canvas.height / 2 - PLAYER_HEIGHT / 2;

		game.ball.speed.x = 0;
		game.ball.speed.y = 0;

		//	cancelAnimationFrame(anim);

		// sortir clean le lobby, cut le stream/d

	}
	function initScreen() {
		if (canvas) {
			game = {
				player: {
					y: canvas.height / 2.5 - PLAYER_HEIGHT / 2,
					score: 0,
					player: 0,
				},
				player2: {
					y: canvas.height / 2.5 - PLAYER_HEIGHT / 2,
					score: 0,
					player: 0,
				},
				ball: {
					x: canvas.width / 2,
					y: canvas.height / 2,
					speed: {
						x: 3,
						y: 3,
					}
				},
				roomName: '0',
				mode: 0,
				rematch1: 0,
				rematch2: 0,
			}
			draw();
		}
	}

	function topinitParty(playerId1: number, playerId2: number, lobbyId: number, mode: number) {
		vstop = 0;
		if (canvas) {
			game = {
				player: {
					y: canvas.height / 2.5 - PLAYER_HEIGHT / 2,
					score: 0,
					player: playerId1,

				},
				player2: {
					y: canvas.height / 2.5 - PLAYER_HEIGHT / 2,
					score: 0,
					player: playerId2
				},
				ball: {
					x: canvas.width / 2,
					y: canvas.height / 2,
					speed: {
						x: 3,
						y: 3,
					}
				},
				roomName: 'game' + lobbyId.toString(),
				mode: mode,
				rematch1: 0,
				rematch2: 0,
			}
			document.querySelector('#player-score').textContent = "0";
			document.querySelector('#player2-score').textContent = "0";
			draw();
		}
		else {
		}
	}

	function initParty() {

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
					x: canvas.width / 2,
					y: canvas.height / 2,
					speed: {
						x: 5,
						y: 5,
					}
				},
				roomName: "0",
				mode: 0,
				rematch1: 0,
				rematch2: 0,

			}
			draw();
		}
	}



	async function play() {
		await draw();
		await ballMove();
		anim = requestAnimationFrame(play);
	}

	function getIntoLobby() {
		socket!.emit('ChangeStatusToServer', { userId: me.id, status: 2 })
		setInLobby(true);
		setNormalQueue(true);
		axios.get('/lobby/join/0');
	}

	function getIntoLobbyShortPad() {
		socket!.emit('ChangeStatusToServer', { userId: me.id, status: 2 })
		setInLobby(true);
		setSmallQueue(true);
		axios.get('/lobby/join/1');
	}

	function getIntoLobbyFastBall() {
		socket!.emit('ChangeStatusToServer', { userId: me.id, status: 2 })
		setInLobby(true);
		setFastQueue(true);
		axios.get('/lobby/join/2');
	}

	function spec(id: number) {
		axios.get('spec/' + id);
	}

	function startRematch() {
		topinitParty(game.player.player, game.player2.player, Number(game.roomName.substring(4)), game.mode);
	}

	function quitQueue() {
		axios.get('/lobby/quiteQueue/');
		// socket!.emit('ChangeStatusToServer', { userId: me.id, status: 0 })
		setInLobby(false);
		setNormalQueue(false);
		setSmallQueue(false);
		setFastQueue(false);
	}

	function quiteLobby() {
		// emit pour quite la room au joueur
		if (game !== undefined) {
			if (me.id === game.player.player || me.id === game.player2.player) {
				//emit stop emit all
				stop();
				socket!.emit('CloseRoom', game.roomName + ":" + game.player.score + ":" + game.player.player + ":" + game.player2.score + ":" + game.player2.player);
				// socket!.emit('ChangeStatusToServer', { userId: me.id, status: 0 });
			}
			else {
				socket!.emit('leaveRoom', me.id);
				// socket!.emit('ChangeStatusToServer', { userId: me.id, status: 0 })
				//stop emite at me
			}
		}
		axios.delete('/lobby/leaveLobby');
		location.reload();
	}

	function deleteLobby() {
		axios.delete('/lobby/cleanAll')
	}

	useEffect(() => {
		let isMounted = true;
		// socket!.emit('ChangeStatusToServer', { userId: me.id, status: 0 })
		window.addEventListener("resize", handleResize);
		canvas = document.getElementById('canvas');
		canvas.width = innerWidth - 250;
		canvas.height = canvas.width / 2
		initScreen();
		play();
		canvas.addEventListener('mousemove', playerMove);
		StartListeners();
	}, [vstop]);

	useEffect(() => {
		axios.get('/lobby/quiteQueue/');
		// socket!.emit('ChangeStatusToServer', { userId: me.id, status: 0 });
	}, []);

	const StartListeners = () => {

		socket!.on("startGame", (...arg) => {
			setEndGame(false);
			setInGame(true);
			setInLobby(true);
			setNormalQueue(true);
			socket!.emit('ChangeStatusToServer', { userId: me.id, status: 3 })

			game.player.player = arg[0].p1;
			game.player2.player = arg[0].p2;
			game.roomName = arg[0].lobbyId;
			game.mode = arg[0].mode;
			topinitParty(arg[0].p1, arg[0].p2, arg[0].lobbyId, arg[0].mode);

		});

		socket!.on("inviteGameStart", (...arg) => {
			setEndGame(false);
			setInGame(true);
			setInLobby(true);
			setNormalQueue(true);
			socket!.emit('ChangeStatusToServer', { userId: me.id, status: 3 })

			game.player.player = arg[0].p1;
			game.player2.player = arg[0].p2;
			game.roomName = arg[0].lobbyId;
			game.mode = arg[0].mode;
			topinitParty(arg[0].p1, arg[0].p2, arg[0].lobbyId, arg[0].mode);
		});

		socket!.on("updatePos", (...arg) => {
			game.player.y = arg[0] * canvas.height;
			game.player2.y = arg[1] * canvas.height;
			game.ball.x = arg[2] * canvas.width;
			game.ball.y = arg[3] * canvas.height;
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

		socket!.on("updatBall", (...arg) => {
			game.ball.x = arg[0];
			game.ball.x *= canvas.width;
			game.ball.y = arg[1];
			game.ball.y *= canvas.height;
			game.ball.speed.x = arg[2] * canvas.width;
			game.ball.speed.y = arg[3] * canvas.height;
		});

		socket!.on('endgame', (...arg) => {
			setInGame(false);
			game.player.score = arg[0];
			game.player2.score = arg[1];
			// stop();
		})

		socket!.on('rematch', (...arg) => {
			console.log('start rematch');
			if (game.player.player === arg[0]) {
				game.rematch1 = 1;
			}
			else if (game.player2.player === arg[0]) {
				game.rematch2 = 1;
			}
			if (game.rematch1 === 1 && game.rematch2 === 1) {
				startRematch();
			}
		})

		socket!.on('stop', (...arg) => {
			vstop = 1;
			stop();
		})

		socket!.on('reload', (...arg) => {
			console.log('relard de la page en cours')
		})

	};

	return (
		<div>
			<h1>Pong</h1>
			<main>
				<p className="canvas-score" id="scores">
					<em className="canvas-score" id="joueur1"></em>
					<em className="canvas-score" id="player-score">0</em> - <em id="joueur2"></em>
					<em className="canvas-score" id="player2-score">0</em></p>
				<div className="game-canvas-div">
					<canvas id={'canvas'} />
				</div>
				<div id={!inGame && endGame ? 'game-queue-buttons' : 'disable'}>
					<div className="game-btn-container">
						<button id={!inGame && endGame ? 'game-quit-lobby' : 'disable'} onClick={quitQueue}> X </button>
						<div className="confirm-btn">
							<div className={!normalQueue ? "btn-inner-border" : "queue-inner-border"}>
								<button onClick={getIntoLobby} disabled={normalQueue ? true : false} id={!normalQueue ? 'game-queue-btn' : 'game-inqueue-btn'}>

									{
										normalQueue ? 'In queue...' : 'Find classic game'
									}
								</button>
								<div className={!normalQueue ? "btn-left-clip-mend" : "queue-left-clip-mend"}>
								</div>
							</div>
						</div>
					</div>
					<div className="game-btn-container">
						<button id={!inGame && endGame ? 'game-quit-lobby' : 'disable'} onClick={quitQueue}> X </button>
						<div className="confirm-btn">
							<div className={!smallQueue ? "btn-inner-border" : "queue-inner-border"}>
								<button onClick={getIntoLobbyShortPad} disabled={smallQueue ? true : false} id={!smallQueue ? 'game-queue-btn' : 'game-inqueue-btn'}>
									{
										smallQueue ? 'In queue...' : 'Find short pad game'
									}
								</button>
								<div className={!smallQueue ? "btn-left-clip-mend" : "queue-left-clip-mend"}>
								</div>
							</div>
						</div>
					</div>
					<div className="game-btn-container">
						<button id={!inGame && endGame ? 'game-quit-lobby' : 'disable'} onClick={quitQueue}> X </button>
						<div className="confirm-btn">
							<div className={!fastQueue ? "btn-inner-border" : "queue-inner-border"}>
								<button onClick={getIntoLobbyFastBall} disabled={fastQueue ? true : false} id={!fastQueue ? 'game-queue-btn' : 'game-inqueue-btn'}>
									{
										fastQueue ? 'In queue...' : 'Find fast ball game'
									}
								</button>
								<div className={!fastQueue ? "btn-left-clip-mend" : "queue-left-clip-mend"}>
								</div>
							</div>
						</div>
					</div>
				</div>
				<button id={inLobby && !inGame && !endGame ? 'game-leave-game' : 'disable'} onClick={() => { quiteLobby() }}> Leave Game </button>
			</main >
			{/* { status == 3 ? <div id="anti-clic-navbar" /> : <></> } */}
		</div >


	)
}
