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
    chanId: number; 
    createdAt: Date; 
    role: number; 
    updatedAt: number; 
    user: IUser;
    userId: number; 
}

export type IChannelMessage = {
    channelId: number;
    createAt: Date;
    id: number;
    text: string;  
    user: {username: string};
    userId: number;
}

export type IChannel = {
    bans: any[]; 
    createdAt: Date;
    id: number;
    joined: boolean;
    messages: IChannelMessage[];
    mutes: any[];
    name: string;
    role: number;
    status: number;
    type: number;
    updatedAt: Date;
    users: IUserChannel[];
}