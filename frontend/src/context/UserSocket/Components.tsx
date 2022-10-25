// Extern :
import React, { PropsWithChildren, useEffect, useReducer, useState } from "react";
import { defaultSocketContextState, ESocketActionType, SocketContextProvider, SocketReducer } from "./Socket";

// Intern :
import { useSocket } from "../../hooks/useSocket";
import { IUser } from "../../types";
import { AxiosJwt } from "../../hooks";
import { AxiosResponse } from "axios";

export interface ISocketContextComponentProps extends PropsWithChildren {
    user: IUser;
}

const SocketContextComponent: React.FunctionComponent<ISocketContextComponentProps> = ({ children, user }) => {
    const [ SocketState, SocketDispatch ] = useReducer( SocketReducer, defaultSocketContextState );
    const [ loadingSocket, setLoading ] = useState(true);
	const axios = AxiosJwt();
    
    const socket = useSocket('localhost:3000', {
        reconnectionAttempts: 5,
        reconnectionDelay: 5000,
        autoConnect: false,
    })

    useEffect(() => {
        if (user.id != 0)
        {
            // socket.connect();
            SocketDispatch({type: ESocketActionType.UP_SOKET, payload: socket });
            SocketDispatch({type: ESocketActionType.UP_UID, payload: user });
            // GET FRIENDS:
            axios.get('/relation/list_friend')
            .then((res: AxiosResponse<IUser[]>) => { 
                SocketDispatch({type: ESocketActionType.GET_FRIENDS, payload: res.data }); 
            });
            // // GET BLOCKS:
            axios.get('/relation/list_block')
            .then((res: AxiosResponse<IUser[]>) => {
                SocketDispatch({type: ESocketActionType.GET_BLOCKS, payload: res.data }); 
            });
            StartListeners();
            StartHandshake();
        }
    }, [user])

    const StartListeners = () => {

        /** User Connected Event */
        socket.on('loginToClient', (uid: number) => {
            console.info('User connected, new user list received.');
            SocketDispatch({ type: ESocketActionType.UP_USERS, payload: uid});
        })

        /** User Disconnect Event */
        socket.on('logoutToClient', (uid: number) => {
            console.info('User connected, new user list received.');
            SocketDispatch({ type: ESocketActionType.RM_USER, payload: uid});
        })

        socket.on('getOnlineUsersToClient', ( onlineUsers: number[]) => {
            console.log('Users: ' + onlineUsers);
            SocketDispatch({ type: ESocketActionType.GET_USERS, payload: onlineUsers});
        })

        /* ---- GESTION DE L'ACTUALISATION DYNAMIQUE DES LIST D'AMIS ---- */
        socket.on('addFriendToClient', ( newFriend: IUser ) => {
            console.log('New friend: ', newFriend.username, "was added");
            SocketDispatch({ type: ESocketActionType.ADD_FRIENDS, payload: newFriend});
        })
        socket.on('removeFriendToClient', ( rmFriend: IUser ) => {
            console.log('New friend: ', rmFriend.username, "was removed");
            SocketDispatch({ type: ESocketActionType.RM_FRIENDS, payload: rmFriend});
        })
        socket.on('addBlockToClient', ( newBlock: IUser ) => {
            console.log('New Block: ', newBlock.username, "was added");
            SocketDispatch({ type: ESocketActionType.ADD_BLOCKS, payload: newBlock});
        })
        socket.on('removeBlockToClient', ( rmBlock: IUser ) => {
            console.log('Remove block: ', rmBlock.username, "was removed");
            SocketDispatch({ type: ESocketActionType.RM_BLOCKS, payload: rmBlock});
        })

        // /** Reconnect event **/
        // socket.io.on('reconnect', (attempt) => {
        //     console.info('Reconnected on attempt: ' + attempt);
        // });

        // /** Reconnect attempt event **/
        // socket.io.on('reconnect_attempt', (attempt) => {
        //     console.info('Reconnection attempt: ' + attempt);
        // });

        // socket.io.on('reconnect_failed', () => {
        //     console.info('Reconnection failure');
        // });
    };

    const StartHandshake = () => {
        console.info('Sending handshake to server ...');

		// Emission de notre connections au autres
		socket.emit('loginToServer', user.id);

		// Fin de l'ecan d'affichage d'erreur
        setLoading( false );

    };

    if (loadingSocket  ) return <p>Loading socket IO ... </p>;

    return <SocketContextProvider value={{ SocketState, SocketDispatch }}>
        { children }
    </SocketContextProvider>;
}

export default SocketContextComponent;