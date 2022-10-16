import { createContext } from "react";
import { Socket } from "socket.io-client";


export interface ISocketContextState {
    socket : Socket | undefined;
    uid: string; 
    users: string[];
}

export const defaultSocketContextState: ISocketContextState = {
    socket: undefined,
    uid: '',
    users: []
}

export enum ESocketActionType {
    UP_SOKET = 'update_socket',
    UP_UID = 'update_uid',
    UP_USERS = 'update_users',
    RM_USER = 'remove_user',
}

export type TSocketContextActions = ESocketActionType.UP_SOKET | ESocketActionType.UP_UID | ESocketActionType.RM_USER | ESocketActionType.UP_USERS;

export type TSocketContextPayload = string | string[] | Socket;

export interface ISocketContextActions {
    type: TSocketContextActions;
    payload: TSocketContextPayload;
}

export const SocketReducer = ( state: ISocketContextState, action: ISocketContextActions ) => { 
    console.log( `Message Receive - Action: ${action.type} - Payload : `, action.payload );

    switch(action.type) {
        case ESocketActionType.UP_SOKET:
            return { ...state, socket: action.payload as Socket};
        case ESocketActionType.UP_UID:
            return { ...state, uid: action.payload as string};
        case ESocketActionType.UP_USERS:
            return { ...state, users: action.payload as string[]};
        case ESocketActionType.RM_USER:
            return { ...state, users: state.users.filter((uid) => uid !== ( action.payload as string ))};
        default:
            return { ...state };
    }
}

export interface ISocketContextProps {
    SocketState: ISocketContextState;
    SocketDispatch: React.Dispatch<ISocketContextActions>;
}

const SocketContext = createContext<ISocketContextProps>({
    SocketState: defaultSocketContextState,
    SocketDispatch: () => {}
});

export const SocketContextConsumer = SocketContext.Consumer;
export const SocketContextProvider = SocketContext.Provider;

export default SocketContext;
