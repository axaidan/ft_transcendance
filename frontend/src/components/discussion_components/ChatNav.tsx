import { useContext } from "react";
import { ChatSocketContext, EChatSocketActionType } from "../../context";



export function ChatNav() {
	const chat = useContext(ChatSocketContext).ChatSocketDispatch;
	const { me, discussion, index_active } = useContext(ChatSocketContext).ChatSocketState;

	function othUsername() {
		const user1: string = discussion[index_active].user1.username;
		const user2: string = discussion[index_active].user2.username;
		return ( me.username != user1 ? user1 : user2 );
	}

	function reduceChat() {
		chat({ type: EChatSocketActionType.DISPLAY, payload: false })
	}

	return (
		<div className='messages-nav'>
			<p>{othUsername()}</p>
			<div className='messages-options'>
				<button id='btn-messages-reduction' onClick={() => reduceChat()}></button>
				<button id='btn-messages-panel'></button>
			</div>
		</div>
	)
}

