import { AxiosResponse } from "axios";
import React, { PropsWithChildren, useEffect, useReducer, useState } from "react";
import { AxiosJwt } from "../../hooks";
import { useSocket } from "../../hooks/useSocket";
import { DflUser, IUser } from "../../types";
import { defaultSocketContextState, ESocketActionType, SocketContextProvider, SocketReducer } from "./Socket";

export interface ISocketContextComponentProps extends PropsWithChildren {
    userId: number;
}

const SocketContextComponent: React.FunctionComponent<ISocketContextComponentProps> = (props) => {
    const { children } = props;
    const [ SocketState, SocketDispatch ] = useReducer( SocketReducer, defaultSocketContextState );
    const [ loading, setLoading ] = useState(true);
    
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
            // Start the envent listeners // 
            StartListeners();
            // Send the handshake //
            StartHandshake( props.userId );
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

        // socket.emit('handshake', (uid: string, users: number[]) => {
        //     console.log('User handshake callback message received');
        //     SocketDispatch({type: ESocketActionType.UP_UID, payload: uid});
        // });

        socket.emit('getOnlineUsersToServer');


		socket.emit('loginToServer', userId);
        console.info('userId: ' + userId )
        
        setLoading( false );

    };

    if (loading) return <p>Loading socket IO ... </p>;

    return <SocketContextProvider value={{ SocketState, SocketDispatch }}>
        { children }
    </SocketContextProvider>;
}

export default SocketContextComponent;