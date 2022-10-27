// Extern:
import { AxiosHeaders, AxiosResponse } from "axios";
import { useContext, useEffect, useState } from "react";

// Intern:
import { Contact } from ".";
import { ChatSocketContext, EChatSocketActionType, SocketContext } from "../../context";
import { AxiosJwt } from "../../hooks";
import { IDiscussion, IUser } from "../../types";

export function FriendsList() {
	
	const { users, friends } = useContext(SocketContext).SocketState;
	const { discussion } = useContext(ChatSocketContext).ChatSocketState;
	const chat = useContext(ChatSocketContext).ChatSocketDispatch;

	const axios = AxiosJwt();
	
	const [newDisc, setNewDisc] = useState<IDiscussion>()

	useEffect(() => {
		if (!newDisc) { return; }
		let new_current = discussion.findIndex((elem) => elem.id === newDisc.id);
		if (new_current === -1) {
			discussion.push(newDisc);
			new_current = discussion.findIndex((elem) => elem.id === newDisc.id);
		}
		chat({ type: EChatSocketActionType.UP_CURR, payload: new_current })
		chat({ type: EChatSocketActionType.DISPLAY, payload: true })
	}, [newDisc])

	async function UpDateActiveDiscusion(uid: number) {
		const test: IDiscussion = (await axios.get('/discussion/user/' + uid)).data;
		if (!test) {
			const createdDiscussion = (await axios.post('/discussion', {user2Id: uid})).data;
			setNewDisc(createdDiscussion);
		} else {
			setNewDisc(test);
		}
	}

	const isOnline = (user: IUser, index: number) => {
		if (users.includes(user.id)) {
			return (
				<div key={index} onClick={() => { UpDateActiveDiscusion(user.id); }}>
					<Contact user={user} status={0} />
				</div>
			)
		}
	}

	const isOffline = (user: IUser, index: number) => {
		if (users.includes(user.id) == false) {
			return (
				<div key={index} onClick={() => { UpDateActiveDiscusion(user.id); }}>
					<Contact user={user} status={4} />
				</div>
			)
		}
	}

	return (
		<ul id='contact-list'>
			<p>CHANNELS</p>
			<p>ONLINE ({friends.filter((friend) => { return (users.includes(friend.id) == true)}).length})</p>
			{friends.map((user: IUser, index) => (isOnline(user, index)))}
			<p>HORS LIGNE ({friends.filter((friend) => {return (users.includes(friend.id) == false)}).length})</p>
			{friends.map((user: IUser, index) => (isOffline(user, index)))}
		</ul>
	)
}
