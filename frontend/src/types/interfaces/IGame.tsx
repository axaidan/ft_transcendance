
export type IGame = {
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

export const DflGame = {
	score1: 0,
	player1: {
		id: 0,
		username: "username",
	},
	score2: 0,
	player2: {
		id: 0,
		username: "username"
	},	
}