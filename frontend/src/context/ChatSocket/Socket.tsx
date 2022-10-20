import { createContext } from "react";
import { Socket } from "socket.io-client";

type IMessage = {
	text: string;
	userId: number;
	discId: number;
}

export interface IChatSocketContextState {
	socket : Socket | undefined;
	uid: number;
	newMessages: IMessage[];
}

export const dflChatSocketContextState: IChatSocketContextState = {
	socket: undefined,
	uid: 0,
	newMessages: []
}

export enum EChatSocketActionType {
    UP_SOKET = 'update_socket',
    UP_UID = 'update_uid',
    UP_DISC = 'update_discussion',
    GET_DISC = 'get_discussion',
}

export type TChatSocketContextAction =	EChatSocketActionType.GET_DISC	|
										EChatSocketActionType.UP_SOKET	|
										EChatSocketActionType.UP_UID	|
										EChatSocketActionType.UP_DISC;

export type TChatSocketContextPayload = number | Socket | number[];

export interface IChatSocketContextAction {
	type: TChatSocketContextAction;
	payload: TChatSocketContextPayload;
}

export const ChatSocketReducer = ( state: IChatSocketContextState, action: IChatSocketContextAction ) => { 
    console.log( `ChatContext - Action: ${action.type} - Payload : `, action.payload );

    switch(action.type) {
        case EChatSocketActionType.UP_SOKET:
            return { ...state, socket: action.payload as Socket};
        case EChatSocketActionType.UP_UID:
            return { ...state, uid: action.payload as number};
        case EChatSocketActionType.UP_DISC:
            return { ...state, newMessages: [ ...state.newMessages, action.payload as number] };
        case EChatSocketActionType.GET_DISC:
            return { ...state, newMessages: action.payload as number[] };
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
    ChatSocketDispatch: () => {}
});

export const ChatSocketContextConsumer = ChatSocketContext.Consumer;
export const ChatSocketContextProvider = ChatSocketContext.Provider;
