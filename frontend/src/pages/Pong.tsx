import './pong.css'

export function Pong() {

	var canvas;
	var game;
	var anim;
// On peut changer les dimensions de la balle et des joueurs, ex: autres modes de jeux
	var PLAYER_HEIGHT = 80;
	var PLAYER_WIDTH = 10;
	var BALL_HEIGHT = 10;
	var BALL_SPEED = 2;
	var BALL_ACCELERATE = true;
	function draw() {
	// Draw Canvas
		if (canvas) {
			var context = canvas.getContext('2d');
		}
	}


	return (
		<div>
        <h1>Pong</h1>
        <main>
         <canvas id="canvas" width={640} height={480} />

        </main>
        <p>Jeu a mettre ici</p>
      </div>
	)
}
