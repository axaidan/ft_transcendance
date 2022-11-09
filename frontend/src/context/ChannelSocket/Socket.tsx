import { createContext } from "react";
import { Socket } from "socket.io-client";
import { DflUser, IMessage, IUser } from "../../types";


export interface IChannelMessage {
	id: number;
	createdAt: Date;
	text: string;
	user: IUser;
    channelsId: number;
}

export interface IUserChannel {
	id: number;
	user: IUser;
    role: number;
}

export interface IChannel {
    name: string;
    users: IUserChannel[];
    messages: IChannelMessage[];
    notif: number;
    id: number;
}

export const dflChannel = {
    name: 'string',
    users: [],
    messages: [],
    notif: 0,
}

export interface IChannelSocketContextState {
	socket: Socket | undefined;
	me: IUser;
	channels: IChannel[];
	index_active: number;
	channel_display: boolean;
}

export const dflChannelSocketContextState: IChannelSocketContextState = {
	socket: undefined,
	me: DflUser,
	channels: [],
	index_active: -1,
	channel_display: false,
}

export enum EChannelSocketActionType {
	UP_SOKET = 'update_socket',
	UP_UID = 'update_uid',
	GET_DISC = 'get_channel',
	UP_DISC = 'add_channel',				    // AJOUT D'UNE NOUVELLE DISCUSION
	RM_DISC = 'remove_channel',			        // REMOVE D'UNE CHANNEL 
	UP_CURR = 'up_current_channel',		        // INDEX DE LA CHANNEL AFFICHEE
	NEW_MSG = 'receive_channel_message',	    // RECU D'UN NOUVEAU MESSAGE
	DISPLAY = 'change_channel_display'
}

export type TChannelSocketContextAction = EChannelSocketActionType.UP_SOKET |
	EChannelSocketActionType.UP_UID |
	EChannelSocketActionType.GET_DISC |
	EChannelSocketActionType.UP_DISC |
	EChannelSocketActionType.RM_DISC |
	EChannelSocketActionType.UP_CURR |
	EChannelSocketActionType.NEW_MSG |
	EChannelSocketActionType.DISPLAY;

export type TChannelSocketContextPayload = number | Socket | number[] | IChannel[] | IChannelMessage | IChannel | IUser | IUserChannel | boolean;

export interface IChannelSocketContextAction {
	type: TChannelSocketContextAction;
	payload: TChannelSocketContextPayload;
}

export const ChannelSocketReducer = (state: IChannelSocketContextState, action: IChannelSocketContextAction) => {
	console.log(`ChannelContext - Action: ${action.type} - Payload : `, action.payload);

	switch (action.type) {
		case EChannelSocketActionType.UP_SOKET:
			return { ...state, socket: action.payload as Socket };
		case EChannelSocketActionType.UP_UID:
			return { ...state, me: action.payload as IUser };
		case EChannelSocketActionType.RM_DISC:
			return { ...state, channels: state.channels.filter((did) => did.id !== (action.payload as number)) };
		case EChannelSocketActionType.UP_CURR:
			const newIndex = action.payload as number;
			if (newIndex != -1) { state.channels[newIndex].notif = 0; }
			return { ...state, index_active: newIndex };
		case EChannelSocketActionType.DISPLAY:
			return { ...state, channel_display: action.payload as boolean };
		case EChannelSocketActionType.NEW_MSG:
			const index = state.channels.findIndex(disc => disc.id == (action.payload as IChannelMessage).channelsId)
			if (index != -1) { state.channels[index].messages.push(action.payload as IChannelMessage); }
			return { ...state };
		default:
			return { ...state };
	}
}

export interface IChannelSocketContextProps {
	ChannelSocketState: IChannelSocketContextState;
	ChannelSocketDispatch: React.Dispatch<IChannelSocketContextAction>;
}

export const ChannelSocketContext = createContext<IChannelSocketContextProps>({
	ChannelSocketState: dflChannelSocketContextState,
	ChannelSocketDispatch: () => { }
});

export const ChannelSocketContextConsumer = ChannelSocketContext.Consumer;
export const ChannelSocketContextProvider = ChannelSocketContext.Provider;
