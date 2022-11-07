import { defaultWinrate, IWinrate } from "./IWinrate"

export type IUser = {
	id: number,
	login: string,
	username: string,
	email: string,
	createdAt: string,
	updatedAt: string
	twoFactorAuth: boolean,
	avatarUrl: string,
	winrate: IWinrate
}

export const DflUser: IUser = {
	id: 0,
	login: "username",
	username: "Nouveau message",
	email: "string",
	createdAt: "string",
	updatedAt: "string",
	twoFactorAuth: false,
	avatarUrl: "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/29.jpg",
	winrate: defaultWinrate,
}

