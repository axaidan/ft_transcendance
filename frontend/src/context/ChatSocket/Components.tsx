// Extern:
import { AxiosResponse } from "axios";
import { PropsWithChildren, useContext, useEffect, useReducer, useState } from "react";

// Intern:
import { ChatSocketContextProvider, ChatSocketReducer, dflChatSocketContextState, EChatSocketActionType } from ".";
import { AxiosJwt } from "../../hooks";
import { useSocket } from "../../hooks/useSocket";
import { IDiscussion, IMessage } from "../../types";
import { SocketContext  } from "../UserSocket";

export interface IChatSocketContextComponentProps extends PropsWithChildren {}
export const ChatSocketContextComponent: React.FunctionComponent<IChatSocketContextComponentProps> = ({ children }) => {
	const [ChatSocketState, ChatSocketDispatch] = useReducer(ChatSocketReducer, dflChatSocketContextState);
	const [loadingSocket, setLoading] = useState(true);
	const axios = AxiosJwt();

	const { me } = useContext(SocketContext).SocketState;

	const chatSocket = useSocket('localhost:3000/chatNs', {
		reconnectionAttempts: 5,
		reconnectionDelay: 5000,
		autoConnect: false,
	})

	useEffect(() => {
		console.log("UserId: ", me.id);
		chatSocket.connect();
		// Save the socket in context //
		ChatSocketDispatch({ type: EChatSocketActionType.UP_SOKET, payload: chatSocket });
		ChatSocketDispatch({ type: EChatSocketActionType.UP_UID, payload: me });
		// Start the envent listeners // 

		axios.get('/discussion')
		.then((res: AxiosResponse<IDiscussion[]>) => {
			ChatSocketDispatch({ type: EChatSocketActionType.GET_ALLDISC, payload: res.data});
		})

		StartListeners();
		StartHandshake();
	}, [])

	const StartListeners = () => {
		chatSocket.on('discMsgToClient', (message: IMessage) => {
			console.info('J\'ai recu un nouveau message.');
			ChatSocketDispatch({ type: EChatSocketActionType.NEW_MSG, payload: message });
		});

		chatSocket.on('newDiscToClient', (disc: IDiscussion) => {
		    console.info('J\'ai recu une nouvelle discussion.');
			ChatSocketDispatch({ type: EChatSocketActionType.UP_DISC, payload: disc });
		})
	};

	const StartHandshake = () => {
		console.info('Sending handshake to server ...');
		chatSocket.emit('loginToServer', me.id);
		setLoading(false);
	};

	if (loadingSocket) return <p>Loading socket IO ... </p>;

	return (<ChatSocketContextProvider value={{ ChatSocketState, ChatSocketDispatch }}>
		{children}
	</ChatSocketContextProvider>);
}