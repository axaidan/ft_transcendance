// Extern :
import React, { PropsWithChildren, useEffect, useReducer, useState } from "react";
import { defaultSocketContextState, ESocketActionType, SocketContextProvider, SocketReducer } from "./Socket";

// Intern :
import { useSocket } from "../../hooks/useSocket";
import { IUser } from "../../types";
import { AxiosJwt } from "../../hooks";
import { AxiosResponse } from "axios";
import { IStatus } from ".";

import bg_website from '../../assets/videos/bg_website.webm'
import { useNavigate } from "react-router-dom";


export interface ISocketContextComponentProps extends PropsWithChildren {
	user: IUser;
}

const SocketContextComponent: React.FunctionComponent<ISocketContextComponentProps> = ({ children, user }) => {
	const [SocketState, SocketDispatch] = useReducer(SocketReducer, defaultSocketContextState);
	const [loadingSocket, setLoading] = useState(true);
	const axios = AxiosJwt();
	const navigate = useNavigate();

	const socket = useSocket('localhost:3000', {
		reconnectionAttempts: 5,
		reconnectionDelay: 5000,
		autoConnect: false,
	})

	useEffect(() => {
		if (user.id != 0) {
			socket.connect();
			SocketDispatch({ type: ESocketActionType.UP_SOKET, payload: socket });
			SocketDispatch({ type: ESocketActionType.UP_UID, payload: user });
			// GET FRIENDS:
			axios.get('/relation/list_friend')
				.then((res: AxiosResponse<IUser[]>) => {
					SocketDispatch({ type: ESocketActionType.GET_FRIENDS, payload: res.data });
				});
			// // GET BLOCKS:
			axios.get('/relation/list_block')
				.then((res: AxiosResponse<IUser[]>) => {
					SocketDispatch({ type: ESocketActionType.GET_BLOCKS, payload: res.data });
				});
			StartListeners();
			StartHandshake();
		}
	}, [user])

	const StartListeners = () => {

		/** User Connected Event */
		socket.on('loginToClient', (uid: IStatus) => {
			SocketDispatch({ type: ESocketActionType.UP_USERS, payload: uid });

		})

		/** User Disconnect Event */
		socket.on('logoutToClient', (uid: number) => {
			SocketDispatch({ type: ESocketActionType.RM_USER, payload: uid });
		})

		socket.on('getOnlineUsersToClient', (onlineUsers: IStatus[]) => {
			SocketDispatch({ type: ESocketActionType.GET_USERS, payload: onlineUsers });
		})

		socket.on('ChangeStatusToClient', (userStatus: IStatus) => {
			SocketDispatch({ type: ESocketActionType.UP_STATUS, payload: userStatus })
			if ( userStatus.status == 3 ) {
				SocketDispatch({ type: ESocketActionType.DISABLE, payload: true })
			} else {
				SocketDispatch({ type: ESocketActionType.DISABLE, payload: false })
			}

		})

		/* ---- GESTION DE L'ACTUALISATION DYNAMIQUE DES LIST D'AMIS ---- */
		socket.on('addFriendToClient', (newFriend: IUser) => {
			SocketDispatch({ type: ESocketActionType.ADD_FRIENDS, payload: newFriend });
		})
		socket.on('removeFriendToClient', (rmFriend: IUser) => {
			SocketDispatch({ type: ESocketActionType.RM_FRIENDS, payload: rmFriend });
		})
		socket.on('addBlockToClient', (newBlock: IUser) => {
			SocketDispatch({ type: ESocketActionType.ADD_BLOCKS, payload: newBlock });
		})
		socket.on('removeBlockToClient', (rmBlock: IUser) => {
			SocketDispatch({ type: ESocketActionType.RM_BLOCKS, payload: rmBlock });
		})

		socket.on('mouveToGame', (lobbyId: number) => {
			navigate('/home/game');
			setTimeout(() => {
				socket.emit('inviteNavigateDone', lobbyId);
			}, 1000);
		})
	};

	const StartHandshake = () => {

		socket.emit('getOnlineUsersToServer');
		socket.emit('loginToServer', user.id);

		// Fin de l'ecan d'affichage d'erreur
		setLoading(false);

	};

	if (loadingSocket)
		return (
			<div>
				<video src={bg_website} playsInline autoPlay loop muted className='bg_video' />
			</div>
		);

	return <SocketContextProvider value={{ SocketState, SocketDispatch }}>
		{children}
	</SocketContextProvider>;
}

export default SocketContextComponent;