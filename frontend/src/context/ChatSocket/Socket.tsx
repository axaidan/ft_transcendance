import { createContext } from "react";
import { Socket } from "socket.io-client";
import { DflUser, IChannel, IChannelMessage, IChannelSimple, IDiscussion, IMessage, IUser, IUserChannel } from "../../types";


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
	allChannels: IChannelSimple[];
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
	GET_CHAN = 'get_channels',
	UP_CHAN = 'add_channel',
	RM_CHAN = 'remove_channel',

	GET_ACHAN = 'get_all_channels',
	UP_ACHAN = 'new_all_channels',
	RM_ACHAN = 'rm_one_all_channels',

	UP_I_CHAN = 'update_index_channel',
	NEW_MSG_CHAN = 'receive_channel_message',

	NEW_USER_CHAN = 'new_user_channel',
	RM_USER_CHAN = 'remove_user_channel',
	ROLE_CHAN = 'edit_role_user_channel',


	BAN_USER_CHAN = 'ban_user_channel',
	UNBAN_USER_CHAN = 'unban_user_channel',


	MUTE_USER_CHAN = 'mute_user_channel',
	UNMUTE_USER_CHAN = 'unmute_user_channel',

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

	EChatSocketActionType.UP_ACHAN |
	EChatSocketActionType.RM_ACHAN |
	EChatSocketActionType.GET_ACHAN |

	EChatSocketActionType.UP_I_CHAN |

	EChatSocketActionType.NEW_MSG_CHAN |

	EChatSocketActionType.NEW_USER_CHAN |
	EChatSocketActionType.RM_USER_CHAN |
	EChatSocketActionType.ROLE_CHAN |

	EChatSocketActionType.BAN_USER_CHAN |
	EChatSocketActionType.UNBAN_USER_CHAN |

	EChatSocketActionType.MUTE_USER_CHAN |
	EChatSocketActionType.UNMUTE_USER_CHAN |

	EChatSocketActionType.DISPLAY_CHAN |
	EChatSocketActionType.SETTING_CHAN;

export type TChatSocketContextPayload = number | Socket | { chanId: number, userId: number } | number[] | IDiscussion[] | IUserChannel | IMessage | IChannelMessage | IChannelSimple | IDiscussion | IUser | IChannelSimple[] | any[] | IChannel | boolean;

export interface IChatSocketContextAction {
	type: TChatSocketContextAction;
	payload: TChatSocketContextPayload;
}

export const ChatSocketReducer = (state: IChatSocketContextState, action: IChatSocketContextAction) => {
	console.log(`ChatContext - Action: ${action.type} - Payload : `, action.payload);

	let index: number;
	let userChannel: IUserChannel;

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
			return { ...state, discussion: state.discussion.filter(did => did.id !== (action.payload as number)) };
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

		case EChatSocketActionType.GET_CHAN:
			state.channels = (action.payload as IChannel[]);
			return {...state};
		case EChatSocketActionType.UP_CHAN:
			state.channels.push(action.payload as IChannel);
			state.index_channel = state.channels.findIndex( disc => disc.id == (action.payload as IChannel).id );
			return { ...state };
		case EChatSocketActionType.RM_CHAN:
			if ( state.index_channel == state.channels.findIndex(chan => chan.id == (action.payload as number))) {
				state.index_channel = -1;
			}
			state.channels = state.channels.filter((chan) => {return chan.id !== (action.payload as number)});
			return { ...state };
		case EChatSocketActionType.GET_ACHAN:
			state.allChannels = (action.payload as IChannelSimple[]);
			return {...state};
		case EChatSocketActionType.UP_ACHAN:
			state.allChannels.push(action.payload as IChannelSimple);
			return {...state};
		case EChatSocketActionType.RM_ACHAN:
			state.allChannels = state.allChannels.filter(chan => { return (chan.id !== (action.payload as number))});
			return { ...state };
		case EChatSocketActionType.UP_I_CHAN:
			return { ...state, index_channel: action.payload as number };
		case EChatSocketActionType.NEW_MSG_CHAN:
			index = state.channels.findIndex(chan => chan.id == (action.payload as IChannelMessage).chanId)
			if (index != -1) { state.channels[index].messages.push(action.payload as IChannelMessage); }
			return { ...state };


		case EChatSocketActionType.NEW_USER_CHAN:
			index = state.channels.findIndex(chan => {return ( chan.id == (action.payload as IUserChannel).chanId)})
			if (index == -1 ) {return { ...state };}
			state.channels[index].users.push( (action.payload as IUserChannel) );
			return { ...state };

		case EChatSocketActionType.RM_USER_CHAN:
			index = state.channels.findIndex(chan => {return ( chan.id == (action.payload as IUserChannel).chanId)})
			if (index == -1 ) {return { ...state };}
			state.channels[index].users = state.channels[index].users.filter((user) => user.userId !== (action.payload as IUserChannel).userId);
			return { ...state };

		case EChatSocketActionType.ROLE_CHAN:
			index = state.channels.findIndex(chan => {
				return ( chan.id == (action.payload as IUserChannel).chanId)
			})
			if (index == -1 ) {return { ...state };}
			userChannel = state.channels[index].users.find((user) => { return user.userId == (action.payload as IUserChannel).userId })!;
			userChannel.role = (action.payload as IUserChannel).role;
			return { ...state };

		case EChatSocketActionType.DISPLAY_CHAN:
			return { ...state, channel_display: action.payload as boolean };
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
