// Extern:
import React from 'react';
import { useEffect, useState } from "react"
import { AxiosResponse } from "axios";
import { Socket } from 'socket.io-client';

// Intern:
import { AxiosJwt } from "../hooks";
import { IUser } from '../types';

// Assets:
import '../styles/components/Friendsbar.css'

type FriendbarProps = {
	userId: number;
	socket: Socket
}

export function Friendsbar({ userId, socket }: FriendbarProps) {
	const [friends, setFriends] = useState<IUser[]>([]);
	const [connectFriends, setConnectFriends] = useState<IUser[]>([])

	const axios = AxiosJwt();

	useEffect(() => {
		axios.get('/relation/list_friend')
			.then((res: AxiosResponse<IUser[]>) => { setFriends(res.data) });
	}, []);

	useEffect(() => {
		const connectedListener = (connectId: number) => {
			const isFriend = friends.find(user => {
				return (user.id === connectId);
			})
			setConnectFriends(current => [...current, isFriend!]);
		}

		const disconnectedListener = (disconnectId: number) => {
			const isFriend = friends.find(user => {
				return (user.id === disconnectId);
			})
			setConnectFriends((prevMessages) => {
				const newMessages = { ...prevMessages };
				delete newMessages[isFriend!.id];
				return newMessages;
			});
		};

		socket.on('loginToClient', (connectId: number) => {
			const isFriend = friends.find(user => {
				return (user.id === connectId);
			})
			setConnectFriends(current => [...current, isFriend!]);
		});
		
		socket.on('logoutToClient', disconnectedListener);

		return () => {
			socket.off('loginToClient', connectedListener);
			socket.off('logoutToClient', disconnectedListener);
		};
	}, [socket]);

	return (
		<nav className='Friendsbar'>
			{connectFriends.map((friend: IUser) => (
				<div>{friend.username}</div>
			))}
		</nav>
	);
};