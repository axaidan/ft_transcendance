// Extern:
import { PropsWithChildren, useContext, useEffect, useReducer, useState } from "react";

// Intern:
import { ChannelSocketContextProvider, ChannelSocketReducer, dflChannelSocketContextState, EChannelSocketActionType } from ".";
import { useSocket } from "../../hooks/useSocket";
import { SocketContext  } from "../UserSocket";

export interface IChannelSocketContextComponentProps extends PropsWithChildren {}
export const ChannelSocketContextComponent: React.FunctionComponent<IChannelSocketContextComponentProps> = ({ children }) => {
	const [ChannelSocketState, ChannelSocketDispatch] = useReducer(ChannelSocketReducer, dflChannelSocketContextState);
	const [loadingSocket, setLoading] = useState(true);

	const { me } = useContext(SocketContext).SocketState

	const channelSocket = useSocket('localhost:3000/ChannelNs', {
		reconnectionAttempts: 5,
		reconnectionDelay: 5000,
		autoConnect: false,
	})

	useEffect(() => {
		console.log("UserId: ", me.id);
		channelSocket.connect();
		// Save the socket in context //
		ChannelSocketDispatch({ type: EChannelSocketActionType.UP_SOKET, payload: channelSocket });
		ChannelSocketDispatch({ type: EChannelSocketActionType.UP_UID, payload: me });

        // ICI JE DOIS RECUPPERER TOUT LES CHANNEL EN COURS ET ME CONNECTER ( POUR LES NOTIF )
        // REGARDE UN TUTO POUR LES NOTIFICATION HISTOIRE DE PAS FAIRE DE LA MERDE

		// Start the envent listeners // 
		StartListeners();
		StartHandshake();
	}, [])

	const StartListeners = () => {
		// channelSocket.on('discMsgToClient', (message: IMessage) => {
		// 	console.info('J\'ai recu un nouveau message.');
		// 	ChannelSocketDispatch({ type: EChannelSocketActionType.NEW_MSG, payload: message });
		// });

		// ChannelSocket.on('newDiscToClient', (disc: IDiscussion) => {
		//     console.info('J\'ai recu une nouvelle discussion.');
		// 	ChannelSocketDispatch({ type: EChannelSocketActionType.UP_DISC, payload: disc });
		// })
	};

	const StartHandshake = () => {
		console.info('Sending handshake to server ...');
		channelSocket.emit('loginToServer', me.id);
		setLoading(false);
	};

	if (loadingSocket) return <p>Loading socket IO ... </p>;

	return (<ChannelSocketContextProvider value={{ ChannelSocketState, ChannelSocketDispatch }}>
		{children}
	</ChannelSocketContextProvider>);
}