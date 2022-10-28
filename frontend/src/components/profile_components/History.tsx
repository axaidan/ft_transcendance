// Extern:
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation, useOutletContext, useParams, Outlet } from "react-router-dom";

// Intern:
import { AxiosJwt } from '../../hooks/AxiosJwt'
import { DflUser, IGame, IUser } from '../../types'
import { AxiosResponse } from "axios";

// Assets:
import '../../styles/components/Historique.css'


type GameProps = {
	game: IGame;
}

function Game({ game }: GameProps) {
	return (
		<li className="hist-unique-game">
			<Link to={"/home/" + game.player1.id}>
				<p>{game.player1.username}</p>
			</Link>
			<p>{game.score1}</p>
			<p>{game.score2}</p>
			<Link to={"/home/" + game.player2.id}>
				<p>{game.player2.username}</p>
			</Link>
		</li>
	)
}

export function History() {

	const axios = AxiosJwt();
	const user: IUser = useOutletContext();
	const [games, setGames] = useState<IGame[]>([]);
	const [users, setUsers] = useState<IUser[]>([]);

	useEffect(() => {
		axios.get('/game/historique/' + user.id)
			.then((res: AxiosResponse<IGame[]>) => { setGames(res.data) });
		axios.get('user/all').then((res: AxiosResponse<IUser[]>) => { setUsers(res.data) });
	}, []);

	return (
		<div className='container-history'>
			<h1>{user.username} 'S RECENT GAMES (LAST 20 PLAYED)</h1>
			<ul>
				{games.map((game: IGame, index: number) => (
					<Game key={index} game={game} />
				))}
			</ul>
		</div>
	)
}
