import { IGame } from "./IGame";

export interface IWinrate {
	games: IGame[];
	gamesPlayed: number;
	victories: number;
	defeats: number;
	draws: number;
	winrate: number;
};

export const defaultWinrate: IWinrate = {
	games: [],
	gamesPlayed: 0,
	victories: 0,
	defeats: 0,
	draws: 0,
	winrate: 0,
};