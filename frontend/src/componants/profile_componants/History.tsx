import React, { useEffect, useState } from "react";
import { AxiosJwt } from '../../hooks/AxiosJwt'
import { Link, useNavigate } from "react-router-dom";

const fewGame = [
	{
		user1: 1,
		user2: 2,
		score1: 6,
		score2: 3,
	},{
		user1: 1,
		user2: 2,
		score1: 6,
		score2: 3,
	},{
		user1: 1,
		user2: 2,
		score1: 6,
		score2: 3,
	},{
		user1: 1,
		user2: 2,
		score1: 6,
		score2: 3,
	}
]

type HistoryProps = {
	userId: number;
}

export function History({ userId }: HistoryProps) {

	const axios = AxiosJwt();
	const navigate = useNavigate();
	const [ games, setGames ] = useState(fewGame);

	useEffect(() => {
		// axios.get("/game/" + userId )
		// .then( (res) => {
		// 	setGames( res.data );
		// })
		// .catch((e) => {
		// 	navigate('/home');
		// })
	}, [])

	return (
		<div className='container-history'>
		{games.map((game: any) => (
			<div key={game.id} className='li-game'>
				<Link to={'/profile/' + game.user1}>
					<div>{game.user1}</div>
				</Link>
				<div>{game.score1}</div>
				<div>{game.score2}</div>
				<Link to={'/profile/' + game.user2}>
					<div>{game.user2}</div>
				</Link>
			</div>
		))}
	</div>
	)

}
