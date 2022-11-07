import { IGame } from '../types/interfaces/IGame';

export interface IWinrate {
	games: IGame[];
	victories: number;
	defeats: number;
	draws: number;
	winrate: number;
}

const useWinrate = (userId: number) => {

};