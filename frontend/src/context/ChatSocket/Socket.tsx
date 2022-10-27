import { createContext } from "react";
import { Socket } from "socket.io-client";
import { DflUser, IDiscussion, IMessage, IUser } from "../../types";

export interface IChatSocketContextState {
	socket: Socket | undefined;
	me: IUser;
	discussion: IDiscussion[];
	index_active: number;
	chat_display: boolean;
}

export const dflChatSocketContextState: IChatSocketContextState = {
	socket: undefined,
	me: DflUser,
	discussion: [],
	index_active: -1,
	chat_display: false,
}

export enum EChatSocketActionType {
	UP_SOKET = 'update_socket',
	UP_UID = 'update_uid',
	GET_DISC = 'get_discussion',
	UP_DISC = 'add_discussion',				// AJOUT D'UNE NOUVELLE DISCUSION
	RM_DISC = 'remove_discussion',			// REMOVE D'UNE DISCUSSION 
	UP_CURR = 'up_current_discussion',		// INDEX DE LA DISCUSSION AFFICHEE
	NEW_MSG = 'receive_message',			// RECU D'UN NOUVEAU MESSAGE
	DISPLAY = 'change_chat_display'
}

export type TChatSocketContextAction = EChatSocketActionType.UP_SOKET |
	EChatSocketActionType.UP_UID |
	EChatSocketActionType.GET_DISC |
	EChatSocketActionType.UP_DISC |
	EChatSocketActionType.RM_DISC |
	EChatSocketActionType.UP_CURR |
	EChatSocketActionType.NEW_MSG |
	EChatSocketActionType.DISPLAY;

export type TChatSocketContextPayload = number | Socket | number[] | IDiscussion[] | IMessage | IDiscussion | IUser | boolean;

export interface IChatSocketContextAction {
	type: TChatSocketContextAction;
	payload: TChatSocketContextPayload;
}

export const ChatSocketReducer = (state: IChatSocketContextState, action: IChatSocketContextAction) => {
	console.log(`ChatContext - Action: ${action.type} - Payload : `, action.payload);

	switch (action.type) {
		case EChatSocketActionType.UP_SOKET:
			return { ...state, socket: action.payload as Socket };
		case EChatSocketActionType.UP_UID:
			return { ...state, me: action.payload as IUser };
		case EChatSocketActionType.UP_DISC:
			return { ...state, discussion: [ ...state.discussion ] };
		case EChatSocketActionType.RM_DISC:
			return { ...state, discussion: state.discussion.filter((did) => did.id !== (action.payload as number)) };
		case EChatSocketActionType.UP_CURR:
			const newIndex = action.payload as number;
			if (newIndex != -1) {
				state.discussion[newIndex].notif = 0;
				console.log("reset notif: ", state.discussion[newIndex].notif);
			}
			return { ...state, index_active: newIndex };
		case EChatSocketActionType.DISPLAY:
			return { ...state, chat_display: action.payload as boolean };
		case EChatSocketActionType.NEW_MSG:
			const index = state.discussion.findIndex(disc => disc.id == (action.payload as IMessage).discussionId)
			state.discussion[index].messages.push(action.payload as IMessage);
			state.discussion[index].notif += 1;
			console.log("index ", index, " inc notif: ", state.discussion[index].notif);
			console.log("disc: ", state.discussion);
			return { ...state };
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
