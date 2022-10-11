// Extern:
import React from 'react';
import { useEffect, useState } from "react"
import { AxiosResponse } from "axios";
import { useOutletContext, Link } from "react-router-dom";
import { io } from 'socket.io-client';
import { useCookies } from "react-cookie";

// Intern:
import { AxiosJwt } from "../hooks";
import { IUser } from '../types';

// Assets:
import '../styles/components/Friendsbar.css'

const ConnectSocket = () => {
	
	const [ cookies ] = useCookies();
	const jwtToken = cookies.access_token;

	const socketDiscution = io("http://localhost/3000/discussionNs", {
		extraHeaders: {
			Authorization: `Bearer ${jwtToken}`
		}
	});

	return socketDiscution;
}

type FriendbarProps = {
	userId: number;
}

export function Friendsbar({ userId }:FriendbarProps ) {
	const [ friends , setFriends ] = useState<IUser[]>([]);
	const socket = ConnectSocket();
	const axios = AxiosJwt();

	useEffect(() => {
		// GET FRIENDS:
		axios.get('/relation/list_friend')
		.then( (res: AxiosResponse<IUser[]>) => { setFriends(res.data)} );
		// GET BLOCKS:
	}, [])

	return (
		<nav className='Friendsbar'>
			{friends.map(( friend: IUser ) => (
				<li>{ friend.username }</li>
			))}
		</nav>
	);
};
