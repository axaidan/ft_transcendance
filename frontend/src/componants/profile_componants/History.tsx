// Extern:
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

// Intern:
import { AxiosJwt } from '../../hooks/AxiosJwt'
import { HistoryProps, IGame } from '../../types'

// Assets:
import '../../styles/components/Historique.css'


export function History({ userId }: HistoryProps)
{
	const axios = AxiosJwt();
	const refresh = useLocation();
	const navigate = useNavigate();
	const [ games, setGames ] = useState<IGame[]>([]);

	useEffect(() => {
		axios.get("/game/historique/" + userId )
		.then( (res) => { setGames( res.data ); })
		.catch((e) => { navigate('/404'); })
	}, [refresh])

	return (
		<div className='container-history'>
		{games!.map((game: any) => (
			<div key={game.id} className='li-game'>
				<Link to={'/profile/' + game.player1.id} className='center_box'>
					<div>{game.player1.username}</div>
				</Link>
				<div className='container-score'>
					<div>{game.score1}</div>
					<div>{game.score2}</div>
				</div>
				<Link to={'/profile/' + game.player2.id} className='center_box'>
					<div>{game.player2.username}</div>
				</Link>
			</div>
		))}
	</div>
	)

}
