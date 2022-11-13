//EXTERN
import { useEffect, useState } from 'react';
import { AxiosResponse } from 'axios';

//INTERFACES
import { IGame } from '../types/interfaces/IGame';

//CUSTOM HOOK
import { AxiosJwt } from './AxiosJwt';

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

export const getVictories = (games: IGame[], id: number): number => {
	let victories = 0;
	games.map((game: IGame) => {
		if (game.score1 !== game.score2) {
			if (game.player1.id === id) {
				if (game.score1 > game.score2) {
					victories++;
				}
			}
			else {
				if (game.score2 > game.score1) {
					victories++;
				}
			}
		}
	});
	return victories;
}

export const getDefeat = (games: IGame[], id: number): number => {
	let defeat = 0;
	games.map((game: IGame) => {
		if (game.score1 !== game.score2) {
			if (game.player1.id === id) {
				if (game.score1 < game.score2) {
					defeat++;
				}
			}
			else {
				if (game.score2 < game.score1) {
					defeat++;
				}
			}
		}
	});
	return defeat;
}

export const getDraws = (games: IGame[], id: number): number => {
	let draws = 0;
	games.map((game: IGame) => {
		if (game.score1 === game.score2) {
			draws++;
		}
	});
	return draws;
};

export const getWinrate = (games: IGame[], id: number): number => {
	if (games.length === 0)
		return 0;
	else
		return Math.round(getVictories(games, id) * 100 / (getVictories(games, id) + getDefeat(games, id) + getDraws(games, id)));
};