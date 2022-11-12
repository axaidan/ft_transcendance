import { createContext } from "react";
import { Socket } from "socket.io-client";
import { DflUser, IDiscussion, IMessage, IUser } from "../../types";



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

export interface IChatSocketContextState {
	socket: Socket | undefined;
	me: IUser;
	
	// DISCUSSIONS
	discussion: IDiscussion[];
	allDiscussions: IDiscussion[];
	index_active: number;
	chat_display: boolean;

	// CHANNELS 
	channels: IChannel[];
	allChannels: IChannel[];
	index_channel: number;
	channel_display: boolean;
	settings_display: boolean;
}

export const dflChatSocketContextState: IChatSocketContextState = {
	socket: undefined,
	me: DflUser,
	discussion: [],
	allDiscussions: [],
	index_active: -1,
	chat_display: false,

	// CHANNELS DFL
	channels: [],
	allChannels: [],
	index_channel: -1,
	channel_display: false,
	settings_display: false,
}

export enum EChatSocketActionType {
	UP_SOKET = 'update_socket',
	UP_UID = 'update_uid',

	// DISCUSSIONS
	GET_DISC = 'get_discussion',
	UP_DISC = 'add_discussion',				// AJOUT D'UNE NOUVELLE DISCUSION
	RM_DISC = 'remove_discussion',			// REMOVE D'UNE DISCUSSION 
	UP_CURR = 'up_current_discussion',		// INDEX DE LA DISCUSSION AFFICHEE
	NEW_MSG = 'receive_message',			// RECU D'UN NOUVEAU MESSAGE
	DISPLAY = 'change_chat_display',
	GET_ALLDISC = 'get_all_discussion',

	// CHANNELS
	UP_CHAN = 'add_channel',
	RM_CHAN = 'remove_channel',
	GET_CHAN = 'get_channels',
	UP_I_CHAN = 'update_index_channel',
	NEW_MSG_CHAN = 'receive_channel_message',
	DISPLAY_CHAN = 'change_channel_display',
	SETTING_CHAN = 'change_channel_settings_display',
}

export type TChatSocketContextAction = 
	EChatSocketActionType.UP_SOKET	|
	EChatSocketActionType.UP_UID	|
// DISCUSSIONS:
	EChatSocketActionType.GET_DISC	|
	EChatSocketActionType.UP_DISC	|
	EChatSocketActionType.RM_DISC	|
	EChatSocketActionType.UP_CURR	|
	EChatSocketActionType.NEW_MSG	|
	EChatSocketActionType.GET_ALLDISC |
	EChatSocketActionType.DISPLAY	|
// CHANNELS:
	EChatSocketActionType.UP_CHAN |
	EChatSocketActionType.RM_CHAN |
	EChatSocketActionType.GET_CHAN |
	EChatSocketActionType.UP_I_CHAN |
	EChatSocketActionType.NEW_MSG_CHAN |
	EChatSocketActionType.DISPLAY_CHAN |
	EChatSocketActionType.SETTING_CHAN;


export type TChatSocketContextPayload = number | Socket | number[] | IDiscussion[] | IMessage | IDiscussion | IUser | IChannel[] | IChannelMessage | IChannel | boolean;

export interface IChatSocketContextAction {
	type: TChatSocketContextAction;
	payload: TChatSocketContextPayload;
}

export const ChatSocketReducer = (state: IChatSocketContextState, action: IChatSocketContextAction) => {
	console.log(`ChatContext - Action: ${action.type} - Payload : `, action.payload);

	let index: number;

	switch (action.type) {
		case EChatSocketActionType.UP_SOKET:
			return { ...state, socket: action.payload as Socket };
		case EChatSocketActionType.UP_UID:
			return { ...state, me: action.payload as IUser };
		case EChatSocketActionType.UP_DISC:
			state.allDiscussions.push(action.payload as IDiscussion);
			state.discussion.push(action.payload as IDiscussion);
			state.index_active = state.discussion.findIndex( disc => disc.id == (action.payload as IDiscussion).id );
			return { ...state };
		case EChatSocketActionType.RM_DISC:
			return { ...state, discussion: state.discussion.filter((did) => did.id !== (action.payload as number)) };
		case EChatSocketActionType.UP_CURR:
			const newIndex = action.payload as number;
			return { ...state, index_active: newIndex };
		case EChatSocketActionType.DISPLAY:
			return { ...state, chat_display: action.payload as boolean };
		case EChatSocketActionType.NEW_MSG:
			index = state.discussion.findIndex(disc => disc.id == (action.payload as IMessage).discussionId)
			if (index != -1) { state.discussion[index].messages.push(action.payload as IMessage); }
			return { ...state };
		case EChatSocketActionType.GET_ALLDISC:
			state.allDiscussions = (action.payload as IDiscussion[]);
			return {...state};


		case EChatSocketActionType.UP_CHAN:
			state.allChannels.push(action.payload as IChannel);
			state.channels.push(action.payload as IChannel);
			state.index_channel = state.channels.findIndex( disc => disc.id == (action.payload as IChannel).id );
			return { ...state };
		case EChatSocketActionType.RM_DISC:
			return { ...state, channels: state.channels.filter((did) => did.id !== (action.payload as number)) };
		case EChatSocketActionType.GET_CHAN:
				state.allChannels = (action.payload as IChannel[]);
				console.log("all channels: " , state.allChannels);
				return {...state};
		case EChatSocketActionType.UP_I_CHAN:
			return { ...state, index_channel: action.payload as number };
		case EChatSocketActionType.DISPLAY_CHAN:
			return { ...state, channel_display: action.payload as boolean };
		case EChatSocketActionType.NEW_MSG_CHAN:
			index = state.channels.findIndex(disc => disc.id == (action.payload as IChannelMessage).channelsId)
			if (index != -1) { state.channels[index].messages.push(action.payload as IChannelMessage); }
			return { ...state };
		case EChatSocketActionType.SETTING_CHAN:
			return { ...state, settings_display: (action.payload as boolean) };


		default:
			return { ...state };
	}
}

export interface IChatSocketContextProps {
	ChatSocketState: IChatSocketContextState;
	ChatSocketDispatch: React.Dispatch<IChatSocketContextAction>;
}

export const ChatSocketContext = createContext<IChatSocketContextProps>({
	ChatSocketState: dflChatSocketContextState,
	ChatSocketDispatch: () => { }
});

export const ChatSocketContextConsumer = ChatSocketContext.Consumer;
export const ChatSocketContextProvider = ChatSocketContext.Provider;
