import { AxiosResponse } from "axios";
import { useContext, useEffect, useReducer, useState } from "react";
import { Socket } from "socket.io-client";
import { ChatNav, DiscussionNav } from ".";
import { ChatSocketContext } from "../../context/ChatSocket";
import { AxiosJwt } from "../../hooks";

import '../../styles/components/discussion_components/Chat.css'
import { dflDiscussion, DflUser, IDiscussion, IMessage, IUser } from "../../types";


type ChatBodyProps = { disc: IDiscussion };
export function ChatBody({ disc }: ChatBodyProps) {

	const axios = AxiosJwt();
	const [user, setUser] = useState<IUser>(DflUser);

	useEffect(() => {
		axios.get('/user/me')
			.then((res) => {
				setUser(res.data)
			})
	}, []);

	// LISTE DES DISCUSSIONS SUR LE COTE
	// const discussion: Discussion[] = axios.get('/discussion');

	//  A L'OUVERTURE D'UNE FENETRE
	// const messages: DiscussionMessage[] = axios.get('/discussion/discussion[i].id');

	// DANS LA STATE
	// - 1 DiscussionMessage
	//	QUI CHANGE DES QUE JE RECOIS 'discMsgToClient'

	let comp_style: string;

	return (
		<div className='messages-body'>
			{disc.messages.map((message: IMessage) => {
				comp_style = (user.id === message.userId ? 'message-right' : 'message-left');
				return (
					<div className={comp_style}>
						{message.text}
					</div>
				)
			})}
		</div>
	)
}

type ChatProps = { userDisc: number; userId: number }
export function Chat({ userDisc, userId }: ChatProps) {
	const { socket, uid } = useContext(ChatSocketContext).ChatSocketState;
	const [discussion, setDiscussion] = useState<IDiscussion[]>([dflDiscussion,]);
	const [activeDisc, setActiveDisc] = useState<number>(0);
	const [othUser, setOthUser] = useState<string>('RANDOM');
	const axios = AxiosJwt();
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		setLoading(true)
		let did = getDiscId(userDisc);
		if (did == undefined) {
			axios.post('/discussion', { user2Id: userDisc })
				.then((res: AxiosResponse<IDiscussion>) => {
					console.log(res.data);
					setDiscussion(current => [...current, res.data]);
					console.log('ASYNC ActiveDisc', activeDisc);
					setOthUser(getOthUser(userId, res.data.user1, res.data.user2))
					setLoading(false)
				});
			console.log('La discusion est cree et push dans le tableau de discussion');
		}
		else {
			setActiveDisc(did!);
			setOthUser(getOthUser(userId, discussion[did!].user1, discussion[did!].user2));
			setLoading(false)
		}
		console.log('ActiveDisc', activeDisc);
		console.log(discussion);
	}, [userDisc])


	useEffect(() => {
		HandleChange(socket, uid, discussion[activeDisc].discId)
		setActiveDisc(getDiscId(userDisc)!)
	}, [discussion])

	function getOthUser(me: number, user1: { id: number, username: string }, user2: { id: number, username: string }) {
		return (me != user1.id ? user1.username : user2.username)
	}

	function getDiscId(userDisc: number): number | undefined {
		for (let i = 0; discussion[i]; i++) {
			if (discussion[i].user1Id == userDisc || discussion[i].user2Id == userDisc)
				return i;
		}
		return undefined;
	}


	return (
		<div id="chat-container">
			<DiscussionNav />
			<div className='messages-container'>
				{loading ? <div>Incoming</div> : <ChatNav user={othUser} />}
				{loading || activeDisc == undefined ? <div>Creation de votre discussion</div> : <ChatBody disc={discussion[activeDisc]} />}
				<input id="messages-input" placeholder='Tapez votre message ici...' />
			</div>
		</div>
	)
}

function HandleChange(socket: any, uid: any, did: number) {
	const input = document.getElementById('messages-input') as HTMLInputElement;

	input.addEventListener("keypress", function (event) {
		if (event.key === 'Enter') {
			console.log('Enter pressed: ');
			console.log(socket);
			console.log('handleChange(): uid = ', uid);
			console.log('handleChange(): did = ', did);
			console.log('handleChange(): text = ', input.value);
			socket!.emit('discMsgToServer', {
				userId: uid,
				text: input.value,
				discId: did,
			});
			input.value = "";
		}
	})
}