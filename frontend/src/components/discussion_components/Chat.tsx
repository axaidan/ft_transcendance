import { useEffect, useReducer, useState } from "react";
import { Socket } from "socket.io-client";
import { ChatNav, DiscussionNav } from ".";
import { AxiosJwt } from "../../hooks";

import '../../styles/components/discussion_components/Chat.css'
import { DflUser, IUser } from "../../types";

type IMessage = {
	id: number;
	createdAt: Date;
	text: string;
	userId: number;
	discussionId: number;
}

type IDiscussion = {
	discId: number;
	user1: {
		id: number;
		username: string;
	};
	user1Id: number;
	user2: {
		id: number;
		username: string;
	};
	user2Id: number;
	messages: IMessage[];
}

const dflDiscussion = {
	discId: 0,
	user1: {
		id: 0,
		username: 'string',
	},
	user1Id: 0,
	user2: {
		id: 0,
		username: 'string',
	},
	user2Id: 0,
	messages: [],
}

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

type ChatProps = { userDisc: number; }
export function Chat({ userDisc }: ChatProps) {
	const [discussion, setDiscussion] = useState<IDiscussion[]>([dflDiscussion,]);
	const [activeDisc, setActiveDisc] = useState<number>(0);
	const axios = AxiosJwt();

	useEffect(() => {
		axios.get('/discussion')
		.then((res) => {
			setDiscussion(res.data);
			console.log(res.data);
		});
		
		HandleChange();
	}, []);

	useEffect(() => {
		let did = getDiscId(userDisc);
		if (did == undefined) {
			axios.post('/discussion', { user2Id: userDisc })
			.then((res) => {
				setDiscussion( current => [...current, res.data]);
				did = getDiscId(userDisc);
			});
			console.log('La discusion est cree et push dans le tableau de discussion');
		}
		setActiveDisc( did! );
		console.log('ActiveDisc', activeDisc);
	}, [userDisc])

	function getDiscId(userDisc: number): number | undefined {
		for (let i = 0; discussion[i]; i++) {
			if ( discussion[i].user1Id == userDisc || discussion[i].user2Id == userDisc )
				return i;
		}
		return undefined;
	}

	return (
		<div id="chat-container">
			<DiscussionNav />
			<div className='messages-container'>
				<ChatNav user1={discussion[activeDisc].user1.username}/>
				<ChatBody disc={discussion[activeDisc]} />
				<input id="messages-input" placeholder='Tapez votre message ici...' />
			</div>
		</div>
	)
}

function HandleChange() {
	const input = document.getElementById('messages-input') as HTMLInputElement;

	// socket2.on(discMsgToClient)

	input.addEventListener("keypress", function (event) {
		if (event.key === 'Enter') {
			console.log('Enter pressed: ');
			// socket2.emit('discMsgToServer', {
			// 	userId: user.id,
			// 	text: input.valut,
			// 	discId: discussion.id,
			// });
			input.value = "";
		}
	})
}