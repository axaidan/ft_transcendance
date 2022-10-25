// Extern:
import { PropsWithChildren, useEffect, useReducer, useState } from "react";

// Intern:
import { ChatSocketContextProvider, ChatSocketReducer, dflChatSocketContextState, EChatSocketActionType } from ".";
import { useSocket } from "../../hooks/useSocket";
import { IMessage, IUser } from "../../types";
import { AxiosJwt } from "../../hooks";

export interface IChatSocketContextComponentProps extends PropsWithChildren {
	user: IUser;
}

export const ChatSocketContextComponent: React.FunctionComponent<IChatSocketContextComponentProps> = ({ children, user}) => {
	const [ChatSocketState, ChatSocketDispatch] = useReducer(ChatSocketReducer, dflChatSocketContextState);
	const [ loadingSocket, setLoading ] = useState(true);

	const chatSocket = useSocket('localhost:3000/chatNs', {
		reconnectionAttempts: 5,
		reconnectionDelay: 5000,
		autoConnect: false,
	})

	useEffect(() => {
		if (user.id != 0) {
			// chatSocket.connect();
			// Save the socket in context //
			ChatSocketDispatch({ type: EChatSocketActionType.UP_SOKET, payload: chatSocket });
			ChatSocketDispatch({ type: EChatSocketActionType.UP_UID, payload: user });
			// Start the envent listeners // 
			StartListeners();
			StartHandshake();
		}
	}, [user])

	const StartListeners = () => {
		chatSocket.on('discMsgToClient', (message: IMessage) => {
            console.info('J\'ai recu un nouveau message.');
			ChatSocketDispatch({ type: EChatSocketActionType.NEW_MSG, payload: message });
		})
	};

	const StartHandshake = () => {
		console.info('Sending handshake to server ...');
		chatSocket.emit('loginToServer', user.id);
		setLoading(false);
	};

	if ( loadingSocket ) return <p>Loading socket IO ... </p>;

	return (<ChatSocketContextProvider value={{ ChatSocketState, ChatSocketDispatch }}>
		{children}
	</ChatSocketContextProvider>);
}