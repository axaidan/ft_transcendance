import React, { PropsWithChildren, useEffect, useReducer, useState } from "react";
import { useSocket } from "../hooks/useSocket";
import { defaultSocketContextState, ESocketActionType, SocketContextProvider, SocketReducer } from "./Socket";

export interface ISocketContextComponentProps extends PropsWithChildren {}

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
        socket.connect();
        // Save the socket in context //
        SocketDispatch({type: ESocketActionType.UP_SOKET, payload: socket });
        // Start the envent listeners // 
        StartListeners();
        // Send the handshake //
        StartHandshake();

    }, [])

    const StartListeners = () => {

        /** User Connected Event */
        socket.on('user_connected', (users: string[]) => {
            console.info('User connected, new user list received.');
            SocketDispatch({ type: ESocketActionType.UP_USERS, payload: users});
        })

        /** User Disconnect Event */
        socket.on('user_disconnected', (uid: string) => {
            console.info('User connected, new user list received.');
            SocketDispatch({ type: ESocketActionType.RM_USER, payload: uid});
        })

        /** Reconnect event **/
        socket.io.on('reconnect', (attempt) => {
            console.info('Reconnected on attempt: ' + attempt);
        });

        /** Reconnect attempt event **/
        socket.io.on('reconnect_attempt', (attempt) => {
            console.info('Reconnection attempt: ' + attempt);
        });

        /** Reconnection error */
        socket.io.on('reconnect', (error) => {
            console.info('Reconnection error: ' + error);
        });

        /**  */
        socket.io.on('reconnect_failed', () => {
            console.info('Reconnection failure');
        });
    };

    const StartHandshake = () => {
        console.info('Sending handshake to server ...');

        socket.emit('handshake', (uid: string, users: string[]) => {
            console.log('User handshake callback message received');
            SocketDispatch({type: ESocketActionType.UP_UID, payload: uid});
            SocketDispatch({type: ESocketActionType.UP_USERS, payload: users});
        });

        setLoading( false );
    };

    if (loading) return <p>Loading socket IO ... </p>;

    return <SocketContextProvider value={{ SocketState, SocketDispatch }}>
        { children }
    </SocketContextProvider>;
}

export default SocketContextComponent;