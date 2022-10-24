import { AxiosResponse } from "axios";
import { PropsWithChildren, useEffect, useReducer, useState } from "react";
import { ChatSocketContext, ChatSocketContextProvider, ChatSocketReducer, dflChatSocketContextState, EChatSocketActionType } from ".";
import { useSocket } from "../../hooks/useSocket";
import { IDiscussion, IMessage } from "../../types";
import { AxiosJwt } from "../../hooks";


export interface IChatSocketContextComponentProps extends PropsWithChildren {
	userId: number;
}

export const ChatSocketContextComponent: React.FunctionComponent<IChatSocketContextComponentProps> = (props) => {
	const { children } = props;
	const [ChatSocketState, ChatSocketDispatch] = useReducer(ChatSocketReducer, dflChatSocketContextState);
	const [ loadingSocket, setLoading ] = useState(true);
	const axios = AxiosJwt();

	const chatSocket = useSocket('localhost:3000/chatNs', {
		reconnectionAttempts: 5,
		reconnectionDelay: 5000,
		autoConnect: false,
	})

	useEffect(() => {
		if (props.userId != 0) {
			chatSocket.connect();
			// Save the socket in context //
			ChatSocketDispatch({ type: EChatSocketActionType.UP_SOKET, payload: chatSocket });
			ChatSocketDispatch({ type: EChatSocketActionType.UP_UID, payload: props.userId });

			axios.get('/discussion')
			.then((res: AxiosResponse<IDiscussion[]>) => {
				ChatSocketDispatch({ type: EChatSocketActionType.GET_DISC, payload: res.data });
			});
			// Start the envent listeners // 
			StartListeners();
			StartHandshake(props.userId);
		}
	}, [props.userId])

	const StartListeners = () => {

		chatSocket.on('discMsgToClient', (message: IMessage) => {
            console.info('J\'ai recu un nouveau message.');
			ChatSocketDispatch({ type: EChatSocketActionType.NEW_MSG, payload: message });
		})


	};

	const StartHandshake = (userId: number) => {
		console.info('Sending handshake to server ...');
		chatSocket.emit('loginToServer', userId);
		setLoading(false);
	};

	if ( loadingSocket ) return <p>Loading socket IO ... </p>;

	return (<ChatSocketContextProvider value={{ ChatSocketState, ChatSocketDispatch }}>
		{children}
	</ChatSocketContextProvider>);
}