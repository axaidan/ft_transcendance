import { useContext } from "react";
import { ChatSocketContext, EChatSocketActionType } from "../../context";
import { IUser } from "../../types";



function ChatNavUser() {
	const { me, discussion, index_active } = useContext(ChatSocketContext).ChatSocketState;

	function othUser() {
		const user1: IUser = discussion[index_active].user1;
		const user2: IUser = discussion[index_active].user2;
		return ( me.id != user1.id ? user1 : user2 );
	}

	const oth_User = othUser();

	return (
		<div className="chat-user">	
			<div className="chat-user-avatar">
				<img src={oth_User.avatarUrl} className="chat-user-icon" />
			</div>
			<div>
				<p id="chat-username">{oth_User.username}</p>
				<p id="chat-user-origin">{oth_User.login + " #EUW"}</p>
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

