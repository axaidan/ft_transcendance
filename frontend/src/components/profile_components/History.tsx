// Extern:
import React, { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { AxiosResponse } from "axios";

// Intern:
import { AxiosJwt } from '../../hooks/AxiosJwt'

//Interfaces
import { IGame, IUser } from '../../types'

// Assets:
import '../../styles/components/Historique.css'


type GameProps = {
	game: IGame;
}



function Game({ game }: GameProps) {

	const didWin = (p1score: number, p2score: number): string => {
		if (p1score === p2score)
			return 'Draw';
		else
			return p1score > p2score ? 'Victory' : 'Defeat';
	}

	return (
		<div className="hist-unique-game" id={'pone-' + didWin(game.score1, game.score2)}>
			<div className="history-playerone" >
				<img src={game.player1.avatarUrl} id='history-user-avatar' />
				<div className={didWin(game.score1, game.score2)}>
					{didWin(game.score1, game.score2)}
					<Link to={"/home/" + game.player1.id}>
						<p id='history-username'>{game.player1.username}</p>
					</Link>
				</div>
				<p id='history-pone-score'>{game.score1}</p>
			</div>
			<div className="history-separation"> - </div>
			<div className="history-playertwo">
				<p id='history-ptwo-score'>{game.score2}</p>
				<div className={didWin(game.score2, game.score1)}>
					{didWin(game.score2, game.score1)}
					<Link to={"/home/" + game.player2.id}>
						<p id='history-username'>{game.player2.username}</p>
					</Link>
				</div>
				<img src={game.player2.avatarUrl} id='history-user-avatar' />
			</div>
		</div >
	)
}

export function History() {

	const axios = AxiosJwt();
	const user: IUser = useOutletContext();
	const [games, setGames] = useState<IGame[]>([]);

	useEffect(() => {
		axios.get('/game/historique/' + user.id)
			.then((res: AxiosResponse<IGame[]>) => { setGames(res.data) });
	}, []);

	return (
		<div className='container-history'>
			<div className="history-title">
				{user.username} 'S RECENT GAMES
			</div>
			<ul id='history-list'>
				{games.map((game: IGame, index: number) => (
					<Game key={index} game={game} />
				))}
			</ul>
		</div >
	)
}
