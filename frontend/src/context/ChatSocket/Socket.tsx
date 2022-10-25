import { createContext } from "react";
import { Socket } from "socket.io-client";
import { AxiosJwt } from "../../hooks";
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
	index_active: 0,
	chat_display: false,
}

export enum EChatSocketActionType {
	UP_SOKET	= 'update_socket',
	UP_UID		= 'update_uid',
	UP_DISC		= 'add_discussion',				// AJOUT D'UNE NOUVELLE DISCUSION
	RM_DISC		= 'remove_discussion',			// REMOVE D'UNE DISCUSSION 
	UP_CURR		= 'up_current_discussion',		// INDEX DE LA DISCUSSION AFFICHEE
	SEND_MSG	= 'send_message',				// SEND D'UN MESSAGE AU BACK
	NEW_MSG		= 'receive_message',			// RECU D'UN NOUVEAU MESSAGE
	DISPLAY		= 'change_chat_display'
}

export type TChatSocketContextAction =	EChatSocketActionType.UP_SOKET	|
										EChatSocketActionType.UP_UID	|
										EChatSocketActionType.UP_DISC	|
										EChatSocketActionType.RM_DISC	|
										EChatSocketActionType.UP_CURR	|
										EChatSocketActionType.SEND_MSG	|
										EChatSocketActionType.NEW_MSG	|
										EChatSocketActionType.DISPLAY	;

export type TChatSocketContextPayload = number | Socket | number[] | IDiscussion[] | IMessage | IDiscussion | IUser | boolean;

export interface IChatSocketContextAction {
	type:		TChatSocketContextAction;
	payload:	TChatSocketContextPayload;
}

export const ChatSocketReducer = (state: IChatSocketContextState, action: IChatSocketContextAction) => {
	console.log(`ChatContext - Action: ${action.type} - Payload : `, action.payload);

	switch (action.type) {
		case EChatSocketActionType.UP_SOKET:
			return { ...state, socket: action.payload as Socket };
		case EChatSocketActionType.UP_UID:
			return { ...state, uid: action.payload as IUser };
		case EChatSocketActionType.UP_DISC:
			return { ...state, discussion: [...state.discussion, action.payload as IDiscussion] };
		case EChatSocketActionType.RM_DISC:
			return { ...state, discussion: state.discussion.filter((did) => did.discId !== ( action.payload as number ))};
		case EChatSocketActionType.UP_CURR:
			return { ...state, index_active: action.payload as number };
		case EChatSocketActionType.DISPLAY:
			return { ...state, chat_display: action.payload as boolean };

		// case EChatSocketActionType.SEND_MSG:
		// 	console.log( (action.payload ) )
		// 	return { ...state };
		// case EChatSocketActionType.NEW_MSG:
		// 	console.log( (action.payload ) )
		// 	return { ...state };

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
