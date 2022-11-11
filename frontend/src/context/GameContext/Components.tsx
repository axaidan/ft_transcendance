import { createContext } from 'react';
import { Socket } from 'socket.io-client';
import { IGame, IUser, DflUser } from '../../types';

export interface IGamesUserContextState {
	socket: Socket | undefined;
	user: IUser;
	games: IGame[];
	gamesPlayed: number;
	victories: number;
	defeats: number;
	draws: number;
	winrate: number;
};

export const defaultGamesUserContextState: IGamesUserContextState = {
	socket: undefined,
	user: DflUser,
	games: [],
	gamesPlayed: 0,
	victories: 0,
	defeats: 0,
	draws: 0,
	winrate: 0,
};

export interface IGamesUserContextProps {

}

const Games = createContext();