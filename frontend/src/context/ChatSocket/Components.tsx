import { AxiosResponse } from "axios";
import { PropsWithChildren, useEffect, useReducer, useState } from "react";
import { ChatSocketContext, ChatSocketContextProvider, ChatSocketReducer, dflChatSocketContextState, EChatSocketActionType } from ".";
import { useSocket } from "../../hooks/useSocket";
import { IDiscussion, IMessage } from "../../types";
import { AxiosJwt } from "../../hooks";


export interface IChatSocketContextComponentProps extends PropsWithChildren {
	userId: number;
}

type IMessageDto = {
	text: string;
	userId: number;
	discId: number;
}

export const ChatSocketContextComponent: React.FunctionComponent<IChatSocketContextComponentProps> = (props) => {
	const { children } = props;
	const [ChatSocketState, ChatSocketDispatch] = useReducer(ChatSocketReducer, dflChatSocketContextState);
	const [loading, setLoading] = useState(true);
	const axios = AxiosJwt();

	const chatSocket = useSocket('localhost:3000/chatNs', {
		reconnectionAttempts: 5,
		reconnectionDelay: 5000,
		autoConnect: false,
	})

	useEffect(() => {
		// Connect to the Web Socket //
		if (props.userId != 0) {
			chatSocket.connect();
			// Save the socket in context //
			ChatSocketDispatch({ type: EChatSocketActionType.UP_SOKET, payload: chatSocket });
			ChatSocketDispatch({ type: EChatSocketActionType.UP_UID, payload: props.userId });
			axios.get('/discussion')
				.then((res: AxiosResponse<IDiscussion[]>) => {
					ChatSocketDispatch({ type: EChatSocketActionType.GET_DISC, payload: res.data });
					console.log(res.data);
					// Start the envent listeners // 
					StartListeners();
					// Send the handshake //
					StartHandshake(props.userId);
				});
		}
	}, [props.userId])

	const StartListeners = () => {

		chatSocket.on('discMsgToClient', (message: IMessage) => {
            console.info('J\'ai recu un nouveau message.');
			ChatSocketDispatch({ type: EChatSocketActionType.NEW_MSG, payload: message });
		})

		// /** Reconnect event **/
		// chatSocket.io.on('reconnect', (attempt) => {
		//     console.info('Reconnected on attempt: ' + attempt);
		// });

		// /** Reconnect attempt event **/
		// chatSocket.io.on('reconnect_attempt', (attempt) => {
		//     console.info('Reconnection attempt: ' + attempt);
		// });

		// chatSocket.io.on('reconnect_failed', () => {
		//     console.info('Reconnection failure');
		// });



	};

	const StartHandshake = (userId: number) => {
		console.info('Sending handshake to server ...');

		// Recuperation des users en ligne

		// Emission de notre connections au autres
		chatSocket.emit('loginToServer', userId);

		// socket2.emit('loginToServer', userId);

		// Fin de l'ecan d'affichage d'erreur
		setLoading(false);
	};

	return (<ChatSocketContextProvider value={{ ChatSocketState, ChatSocketDispatch }}>
		{children}
	</ChatSocketContextProvider>);
}