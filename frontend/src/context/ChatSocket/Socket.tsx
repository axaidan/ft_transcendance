import axios from "axios";
import { createContext } from "react";
import { Socket } from "socket.io-client";
import { IDiscussion, IMessage } from "../../types";

export interface IChatSocketContextState {
	socket: Socket | undefined;
	uid: number;
	discussion: IDiscussion[];
	activeDisc: number;
}

export const dflChatSocketContextState: IChatSocketContextState = {
	socket: undefined,
	uid: 0,
	discussion: [],
	activeDisc: 0,
}

export enum EChatSocketActionType {
	UP_SOKET = 'update_socket',
	UP_UID = 'update_uid',
	UP_DISC = 'update_discussion',
	GET_DISC = 'get_discussion',
	NEW_MSG = 'nouveau_message'
}

export type TChatSocketContextAction = EChatSocketActionType.GET_DISC |
	EChatSocketActionType.UP_SOKET |
	EChatSocketActionType.UP_UID |
	EChatSocketActionType.UP_DISC |
	EChatSocketActionType.NEW_MSG;

export type TChatSocketContextPayload = number | Socket | number[] | IDiscussion[] | IMessage;

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
			return { ...state, uid: action.payload as number };
		case EChatSocketActionType.NEW_MSG:
			console.log( (action.payload as IMessage) )
			for (let i = 0; state.discussion[i]; i++)
				if (state.discussion[i].discId == (action.payload as IMessage).discussionId) {
					state.discussion[i].messages.push(action.payload as IMessage)
					break ;
				}
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
