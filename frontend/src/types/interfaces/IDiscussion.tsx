export type IMessage = {
	id: number;
	createdAt: Date;
	text: string;
	userId: number;
	discussionId: number;
}

export type IDiscussion = {
	id: number;
	user1: {
		id: number;
		username: string;
	};
	user1Id: number;
	user2: {
		id: number;
		username: string;
	};
	user2Id: number;
	messages: IMessage[];
}

export const dflDiscussion = {
	discId: 0,
	user1: {
		id: 0,
		username: 'string',
	},
	user1Id: 0,
	user2: {
		id: 0,
		username: 'string',
	},
	user2Id: 0,
	messages: [],
}