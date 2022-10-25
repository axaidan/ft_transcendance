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
		console.log("New: ", newDisc);
		if (!newDisc) {
			console.log( " U ARE HERE ");
			return;
		}
		console.log("Discussion 1: ", discussion)
		let new_current = discussion.findIndex((elem) => elem.id === newDisc.id);
		console.log("FIRST current: ", new_current)
		if (new_current === -1) {
			discussion.push(newDisc);
			console.log("Discussion 2: ", discussion)
			new_current = discussion.findIndex((elem) => elem.id === newDisc.id);
			console.log("SECOND current: ", new_current)
		}
		chat({ type: EChatSocketActionType.UP_CURR, payload: new_current })
		chat({ type: EChatSocketActionType.DISPLAY, payload: true })
	}, [newDisc])

	async function UpDateActiveDiscusion(uid: number) {
		const test: IDiscussion = (await axios.get('/discussion/user/' + uid)).data;
		console.log('test = ', test);
		// const discussions: IDiscussion[] = (await axios.get('/discussion')).data;
		// console.log('discussion[] = ', discussions);
		// for (const discussion of discussions) {
		// 	if (discussion.user1Id === uid || discussion.user2Id === uid) {
		// 		setNewDisc(discussion);
		// 		return;
		// 	}
		// }
		if (!test) {
			const createdDiscussion = (await axios.post('/discussion', {user2Id: uid})).data;
			setNewDisc(createdDiscussion);
		} else {
			setNewDisc(test);
		}
	}

	// .then(async (res: AxiosResponse<IDiscussion | undefined>) => {
	// 	if (res.data != undefined) {
	// 		console.log('DATA: ', res.data)
	// 		discussion.push(res.data);
	// 		console.log("Discussion: ", discussion)
	// 		new_current = discussion.indexOf(res.data);
	// 		chat({ type: EChatSocketActionType.UP_CURR, payload: new_current })
	// 		chat({ type: EChatSocketActionType.DISPLAY, payload: true })
	// 	} else {
	// 		await axios.post('/discussion/' + uid, { body: { user2Id: uid } })
	// 			.then((res: AxiosResponse<IDiscussion>) => {
	// 				console.log('DATA: ', res.data)
	// 				discussion.push(res.data);
	// 				console.log("Discussion: ", discussion)
	// 				new_current = discussion.indexOf(res.data);
	// 				chat({ type: EChatSocketActionType.UP_CURR, payload: new_current })
	// 				chat({ type: EChatSocketActionType.DISPLAY, payload: true })
	// 			})
	// 	}
	// })

	const isOnline = (user: IUser, index: number) => {
		if (users.includes(user.id)) {
			return (
				<div key={index} onClick={() => {
					UpDateActiveDiscusion(user.id);
				}}>
					<Contact user={user} status={0} />
				</div>
			)
		}
	}

	const isOffline = (user: IUser, index: number) => {
		if (users.includes(user.id) == false) {
			return (
				<div key={index} onClick={() => {
					UpDateActiveDiscusion(user.id);
				}}>
					<Contact user={user} status={4} />
				</div>
			)
		}
	}

	return (
		<ul id='contact-list'>
			<p>CHANNELS</p>
			<p>ONLINE</p>
			{friends.map((user: IUser, index) => (isOnline(user, index)))}
			<p>OFFLINE</p>
			{friends.map((user: IUser, index) => (isOffline(user, index)))}
		</ul>
	)
}
