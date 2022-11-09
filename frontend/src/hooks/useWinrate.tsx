import { IGame } from '../types/interfaces/IGame';
import { useEffect, useState } from 'react';
import { AxiosJwt } from './AxiosJwt';
import { AxiosResponse } from 'axios';

export interface IWinrate {
	games: IGame[];
	victories: number;
	defeats: number;
	draws: number;
	winrate: number;
}

export const DflWinrate: IWinrate = {
	games: [],
	victories: 0,
	defeats: 0,
	draws: 0,
	winrate: 0,
}

export const useWinrate = (userId: number) => {

	const axios = AxiosJwt();
	const [games, setGames] = useState<IGame[]>([]);
	const [winrate, setWinrate] = useState(DflWinrate);

	useEffect(() => {
		axios.get('/game/historique/' + userId)
			.then((res: AxiosResponse<IGame[]>) => { setGames(res.data) });
	}, [games]);

	const fillWinrate = (userId: number): void => {
		let wr = DflWinrate;
		let victories = 0;
		let defeat = 0;
		let draws = 0;

		games.map((game: IGame) => {
			if (game.score1 === game.score2) {
				draws++;
			}
			else {
				if (game.player1.id === userId) {
					if (game.score1 > game.score2) {
						victories++;
					}
					else {
						defeat++;
					}
				}
				else {
					if (game.score2 > game.score1) {
						victories++;
					}
					else {
						defeat++;
					}
				}
			}
		});
		wr.victories = victories;
		wr.defeats = defeat;
		wr.draws = draws;
		if (games.length !== 0) {
			wr.winrate = Math.round(wr.victories * 100 / games.length);
		}
		else {
			wr.winrate = 0;
		}
		setWinrate(wr);
	}

	useEffect(() => {
		fillWinrate(userId);
	});

	return winrate;
}



// export const useWinrate = (userId: number): IWinrate => {

// 	const axios = AxiosJwt();
// 	const [winrate, setWinrate] = useState<IWinrate>(DflWinrate);
// 	useEffect(() => {
// 		const retWinrate = DflWinrate;
// 		axios.get('/game/historique/' + userId)
// 			.then((res: AxiosResponse<IGame[]>) => { retWinrate.games = res.data });

// 		retWinrate.games.map((game: IGame) => {
// 			if (game.score1 === game.score2)
// 				retWinrate.draws++;
// 			else {
// 				if (game.player1.id === userId) {
// 					if (game.score1 > game.score2)
// 						retWinrate.victories++;
// 					else
// 						retWinrate.defeats++;
// 				}
// 				else {
// 					if (game.score2 > game.score1) {
// 						retWinrate.victories++;
// 					}
// 					else {
// 						retWinrate.defeats++;
// 					}
// 				}
// 			}
// 		});

// 		if (retWinrate.games.length !== 0)
// 			retWinrate.winrate = Math.round((winrate.victories * 100) / (retWinrate.games.length));
// 		else
// 			retWinrate.winrate = 0;
// 		setWinrate(retWinrate);
// 	}, [winrate]);


// 	return winrate;

// };