
import { AxiosResponse } from "axios";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Contact } from ".";
import { SocketContext } from "../../context";
import { AxiosJwt } from "../../hooks";
import { IUser } from "../../types";

export function FriendsList() {
	const axios = AxiosJwt();
	const [ friends, setFriends] = useState<IUser[]>([]);
	const { users } = useContext(SocketContext).SocketState;

	useEffect(() => {
		axios.get('/relation/list_friend')
			.then((res: AxiosResponse<IUser[]>) => { setFriends(res.data) });
	}, []);

	const isOnline = ( uid: number, index: number, user: IUser ) => {
		if ( users.includes(uid)) {
			return (
				<Link key={index} className='no_decoration' to={""}>
					<Contact user={user} status={0}/>
				</Link> 
			)
		}
	}

	const isOffline = ( uid: number, index: number, user: IUser ) => {
		if ( users.includes(uid) == false ) {
			return (
				<Link key={index} className='no_decoration' to={""}>
					<Contact user={user} status={4}/>
				</Link> 
			)
		}
	}

	return (
		<ul id='contact-list'>
			{friends.map((user: IUser, index) => ( isOnline( user.id, index, user )))}
			{friends.map((user: IUser, index) => ( isOffline( user.id, index, user )))}
		</ul>
	)
}