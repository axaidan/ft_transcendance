import { createContext } from "react";
import { Socket } from "socket.io-client";
import { IUser } from "../../types";

export interface ISocketContextState {
    socket : Socket | undefined;
    uid: number; 
    users: number[];
	friends: IUser[];
	blocks: IUser[];
}

export const defaultSocketContextState: ISocketContextState = {
    socket: undefined,
    uid: 0,
    users: [],
    friends: [],
    blocks: [],
}

export enum ESocketActionType {
    UP_SOKET = 'update_socket',
    UP_UID = 'update_uid',
    UP_USERS = 'update_users',
    RM_USER = 'remove_user',
    GET_USERS = 'get_users',
    GET_FRIENDS= 'get_friends',
    GET_BLOCKS= 'get_blocks',
    ADD_FRIENDS= 'add_new_friend' ,
    RM_FRIENDS= 'rm_new_friend' ,
    ADD_BLOCKS= 'add_new_block' ,
    RM_BLOCKS= 'rm_new_block' ,
}

export type TSocketContextActions = ESocketActionType.UP_SOKET  |
                                    ESocketActionType.UP_UID    |
                                    ESocketActionType.RM_USER   |
                                    ESocketActionType.UP_USERS  |
                                    ESocketActionType.GET_USERS |
                                    ESocketActionType.GET_FRIENDS |
                                    ESocketActionType.GET_BLOCKS |
                                    ESocketActionType.ADD_FRIENDS |
                                    ESocketActionType.RM_FRIENDS |
                                    ESocketActionType.ADD_BLOCKS | 
                                    ESocketActionType.RM_BLOCKS; 

export type TSocketContextPayload = number[] | number | Socket | IUser | IUser[] ;

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
            return { ...state, uid: action.payload as number};
        case ESocketActionType.GET_USERS:
            return { ...state, users: action.payload as number[] };
        case ESocketActionType.UP_USERS:
            return { ...state, users: [ ...state.users, action.payload as number] };
        case ESocketActionType.RM_USER:
            return { ...state, users: state.users.filter((uid) => uid !== ( action.payload as number ))};
        case ESocketActionType.GET_FRIENDS:
            return { ...state, friends: action.payload as IUser[] };
        case ESocketActionType.ADD_FRIENDS:
            return { ...state, friends: [ ...state.friends, action.payload as IUser] };
        case ESocketActionType.RM_FRIENDS:
            return { ...state, friends: state.friends.filter((user) => user !== ( action.payload as IUser ))};
        case ESocketActionType.GET_BLOCKS:
            return { ...state, blocks: action.payload as IUser[] };
        case ESocketActionType.ADD_BLOCKS:
            return { ...state, blocks: [ ...state.blocks, action.payload as IUser] };
        case ESocketActionType.RM_BLOCKS:
            return { ...state, blocks: state.blocks.filter((user) => user !== ( action.payload as IUser ))};
        default:
            return { ...state };
    }
}

export interface ISocketContextProps {
    SocketState: ISocketContextState;
    SocketDispatch: React.Dispatch<ISocketContextActions>;
}

export const SocketContext = createContext<ISocketContextProps>({
    SocketState: defaultSocketContextState,
    SocketDispatch: () => {}
});

export const SocketContextConsumer = SocketContext.Consumer;
export const SocketContextProvider = SocketContext.Provider;
