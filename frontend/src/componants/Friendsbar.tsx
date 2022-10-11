// Extern:
import React from 'react';
import { useEffect, useState } from "react"
import { AxiosResponse } from "axios";

// Intern:
import { AxiosJwt } from "../hooks";
import { IUser } from '../types';

// Assets:
import '../styles/components/Friendsbar.css'

type FriendbarProps = {
	userId: number;
}

export function Friendsbar({ userId }:FriendbarProps ) {
	const [ friends , setFriends ] = useState<IUser[]>([]);
	const axios = AxiosJwt();

	useEffect(() => {
		axios.get('/relation/list_friend')
		.then( (res: AxiosResponse<IUser[]>) => { setFriends(res.data)} );
	}, [])

	return (
		<nav className='Friendsbar'>
			{friends.map(( friend: IUser ) => (
				<li>{ friend.username }</li>
			))}
		</nav>
	);
};
