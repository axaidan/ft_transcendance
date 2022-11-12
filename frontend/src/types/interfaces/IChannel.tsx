import { IUser } from "./IUser";

export type IChannelSimple = {
	id: number;
	createdAt: Date;
	joined: boolean;
	name: number;
	role: number;
	status: number;
	type: number;
	updatedAt: number;
}

export type IUserChannel = {
	channelId: number;
	createdAt: Date;
	role: number;
	updatedAt: number;
	user: IUser;
	userId: number;
}

export type IChannel = {
	bans: any[];
	createdAt: Date;
	id: number;
	joined: boolean;
	messages: any[];
	mutes: any[];
	name: string;
	role: number;
	status: number;
	type: number;
	updatedAt: Date;
	users: IUserChannel[];
}