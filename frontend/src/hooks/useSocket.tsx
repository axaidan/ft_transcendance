import { createContext, useEffect, useRef } from 'react';
import { io, ManagerOptions, Socket, SocketOptions } from "socket.io-client";

export const useSocket = (
    uri: string = "localhost:3000",
    opts?: Partial<ManagerOptions & SocketOptions> | undefined, 
    ): Socket => {
    const { current: socket } = useRef(io( uri, opts ));

    useEffect(() => {
        return () => {
            if (socket ) socket.close();
        }
    }, [socket])

    return socket;
}