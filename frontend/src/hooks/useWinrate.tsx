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

export const useWinrate = async (userId: number) => {
	const winrate = DflWinrate;
	const axios = AxiosJwt();

	winrate.games = (await axios.get('/game/historique/' + userId)).data
	winrate.games.map((game: IGame) => {
		if (game.score1 === game.score2)
			winrate.draws++;
		else {
			if (game.player1.id === userId) {
				if (game.score1 > game.score2)
					winrate.victories++;
				else
					winrate.defeats++;
			}
			else {
				if (game.score2 > game.score1) {
					winrate.victories++;
				}
				else {
					winrate.defeats++;
				}
			}
		}
	});
	if (winrate.games.length !== 0)
		winrate.winrate = Math.round((winrate.victories * 100) / (winrate.games.length));
	else
		winrate.winrate = 0;

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