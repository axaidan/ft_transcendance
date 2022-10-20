
import { AxiosResponse } from "axios";
import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Contact } from ".";
import { SocketContext } from "../../context";
import { AxiosJwt } from "../../hooks";
import { IUser } from "../../types";


type FriendListProps = { setDisc: (arg: number) => void }
export function FriendsList({ setDisc }: FriendListProps) {
	const axios = AxiosJwt();
	const [friends, setFriends] = useState<IUser[]>([]);
	const { users } = useContext(SocketContext).SocketState;

	useEffect(() => {
		axios.get('/relation/list_friend')
			.then((res: AxiosResponse<IUser[]>) => { setFriends(res.data) });
	}, []);

	const isOnline = (uid: number, index: number, user: IUser) => {
		if (users.includes(uid)) {
			return (
				<div onClick={() => {
					setDisc(user.id)!;
					HandleClicContact();
				}}>
					<Contact user={user} status={0} />
				</div>
			)
		}
	}

	const isOffline = (uid: number, index: number, user: IUser) => {
		if (users.includes(uid) == false) {
			return (
				<div onClick={() => {
					setDisc(user.id)!;
					HandleClicContact();
				}}>
					<Contact user={user} status={4} />
				</div>
			)
		}
	}

	return (
		<ul id='contact-list'>
			{friends.map((user: IUser, index) => (isOnline(user.id, index, user)))}
			{friends.map((user: IUser, index) => (isOffline(user.id, index, user)))}
		</ul>
	)
}

function HandleClicContact() {
	const chatComponents = document.querySelector('#chat-container') as HTMLElement;
	chatComponents.style.display = 'grid';
}