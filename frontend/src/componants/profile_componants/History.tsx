import React, { useEffect, useState } from "react";
import { AxiosJwt } from '../../hooks/AxiosJwt'
import { Link, useNavigate, useLocation } from "react-router-dom";
import '../../styles/components/Historique.css'

type HistoryProps = {
	userId: number;
}

type IHistorique = {
	score1: number;
	player1: {
		id: number;
		username: string;
	};
	score2: number;
	player2: {
		id: number;
		username: string;
	};
};

export function History({ userId }: HistoryProps) {
	const axios = AxiosJwt();
	const refresh = useLocation();
	const navigate = useNavigate();
	const [ games, setGames ] = useState<IHistorique[]>([]);

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
