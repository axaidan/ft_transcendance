// Extern :
import React, { PropsWithChildren, useEffect, useReducer, useState } from "react";
import { defaultSocketContextState, ESocketActionType, SocketContextProvider, SocketReducer } from "./Socket";

// Intern :
import { useSocket } from "../../hooks/useSocket";
import { useAxios } from "../../hooks/useAxios";
import { IUser } from "../../types";
import { AxiosJwt } from "../../hooks";
import { AxiosResponse } from "axios";

export interface ISocketContextComponentProps extends PropsWithChildren {
    userId: number;
}

const SocketContextComponent: React.FunctionComponent<ISocketContextComponentProps> = (props) => {
    const { children } = props;
    const [ SocketState, SocketDispatch ] = useReducer( SocketReducer, defaultSocketContextState );
    const [ loadingSocket, setLoading ] = useState(true);
	const axios = AxiosJwt();
    
    const socket = useSocket('localhost:3000', {
        reconnectionAttempts: 5,
        reconnectionDelay: 5000,
        autoConnect: false,
    })

    useEffect(() => {
        // Connect to the Web Socket //
        if (props.userId != 0)
        {
            socket.connect();
            // Save the socket in context //
            SocketDispatch({type: ESocketActionType.UP_SOKET, payload: socket });
            SocketDispatch({type: ESocketActionType.UP_UID, payload: props.userId });

            // GET FRIENDS:
            axios.get('/relation/list_friend')
            .then((res: AxiosResponse<IUser[]>) => { 
                SocketDispatch({type: ESocketActionType.UP_UID, payload: res.data }); 
            
                StartListeners();
                // Send the handshake //
                StartHandshake( props.userId );

                console.log("FRIEND ON SOCKET: " , SocketState.friends);
            });
            // // GET BLOCKS:
            // axios.get('/relation/list_block')
			//     .then((res: AxiosResponse<IUser[]>) => { setBlocks(res.data) });

        }
    }, [props.userId])

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

        /** Reconnect event **/
        socket.io.on('reconnect', (attempt) => {
            console.info('Reconnected on attempt: ' + attempt);
        });

        /** Reconnect attempt event **/
        socket.io.on('reconnect_attempt', (attempt) => {
            console.info('Reconnection attempt: ' + attempt);
        });

        socket.io.on('reconnect_failed', () => {
            console.info('Reconnection failure');
        });
    };

    const StartHandshake = ( userId: number ) => {
        console.info('Sending handshake to server ...');

		// Emission de notre connections au autres
		socket.emit('loginToServer', userId);

		// Fin de l'ecan d'affichage d'erreur
        setLoading( false );

    };

    if (loadingSocket  ) return <p>Loading socket IO ... </p>;

    return <SocketContextProvider value={{ SocketState, SocketDispatch }}>
        { children }
    </SocketContextProvider>;
}

export default SocketContextComponent;