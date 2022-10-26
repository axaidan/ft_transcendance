import { useContext } from "react";
import { ChatSocketContext, EChatSocketActionType } from "../../context";



function ChatNavUser() {
	const { me, discussion, index_active } = useContext(ChatSocketContext).ChatSocketState;

	function othUsername() {
		const user1: string = discussion[index_active].user1.username;
		const user2: string = discussion[index_active].user2.username;
		return ( me.username != user1 ? user1 : user2 );
	}

	return (
		<div className="chat-user">	
			<div className="chat-user-avatar">
				<img src={me.avatarUrl} className="chat-user-icon" />
			</div>
			<div>
				<p id="chat-username">{me.username}</p>
				<p id="chat-user-origin">{me.login + " #EUW"}</p>
			</div>
		</div>
	)
}



export function ChatNav() {
	const chat = useContext(ChatSocketContext).ChatSocketDispatch;

	function reduceChat() {
		chat({ type: EChatSocketActionType.DISPLAY, payload: false })
	}

	return (
		<div className='messages-nav'>
			<ChatNavUser />
			<div className='messages-options'>
				<button id='btn-messages-reduction' onClick={() => reduceChat()}></button>
				<button id='btn-messages-panel'></button>
			</div>
		</div>
	)
}

