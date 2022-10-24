import axios from "axios";
import { createContext } from "react";
import { Socket } from "socket.io-client";
import { IDiscussion, IMessage } from "../../types";

export interface IChatSocketContextState {
	socket: Socket | undefined;
	uid: number;
	
	discussion: IDiscussion[];

	index_active:	number;
	active_disc:	number[];
}

export const dflChatSocketContextState: IChatSocketContextState = {
	socket: undefined,
	uid: 0,
	
	discussion: [],

	index_active: 0,
	active_disc: [] ,
}

export enum EChatSocketActionType {
	UP_SOKET	= 'update_socket',
	UP_UID		= 'update_uid',
	GET_DISC	= 'get_discussion',				// RECUPERATION DE LA DATA 
	UP_DISC		= 'update_discussion',			// AJOUT D'UNE NOUVELLE DISCUSION
	UP_CURR		= 'up_current_discussion',		// INDEX DE LA DISCUSSION AFFICHEE
	A_DISC		= 'add_active_discussion',		// ADD TO ATCIVE DISCUSSION
	R_DISC		= 'remove_active_discussion',	// RM TO ACTIVE DISCUSSION
	SEND_MSG	= 'send_message',				// SEND D'UN MESSAGE AU BACK
	NEW_MSG		= 'receive_message',			// RECU D'UN NOUVEAU MESSAGE
}

export type TChatSocketContextAction =	EChatSocketActionType.UP_SOKET	|
										EChatSocketActionType.UP_UID	|
										EChatSocketActionType.GET_DISC	|
										EChatSocketActionType.UP_DISC	|
										EChatSocketActionType.UP_CURR	|
										EChatSocketActionType.A_DISC	|
										EChatSocketActionType.R_DISC	|
										EChatSocketActionType.SEND_MSG	|
										EChatSocketActionType.NEW_MSG	;

export type TChatSocketContextPayload = number | Socket | number[] | IDiscussion[] | IMessage | IDiscussion;

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
			return { ...state, uid: action.payload as number };

		case EChatSocketActionType.GET_DISC:
			return { ...state, discussion: action.payload as IDiscussion[] };
		case EChatSocketActionType.UP_DISC:
			return { ...state, discussion: [...state.discussion, action.payload as IDiscussion] };

		case EChatSocketActionType.UP_CURR:
			return { ...state, index_active: action.payload as number };

		case EChatSocketActionType.A_DISC:
			return { ...state, active_disc: [...state.active_disc, action.payload as number] };
		case EChatSocketActionType.R_DISC:
			return { ...state, active_disc: state.active_disc.filter((did) => did !== ( action.payload as number ))};

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
