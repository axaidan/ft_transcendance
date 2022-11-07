import { DflUser, IUser } from "./IUser";

export type IMessage = {
	id: number;
	createdAt: Date;
	text: string;
	userId: number;
	discussionId: number;
}

export type IDiscussion = {
	id: number;
	user1: IUser;
	user1Id: number;
	user2: IUser;
	user2Id: number;
	messages: IMessage[];
	notif: number
}

export const dflDiscussion = {
	discId: 0,
	user1: DflUser,
	user1Id: 0,
	user2: DflUser,
	user2Id: 0,
	messages: [],
	notif: 0
}