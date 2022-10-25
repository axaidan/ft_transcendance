import { useContext } from "react";
import { ChatSocketContext, EChatSocketActionType } from "../../context";



type ChatNavProps = { user: string }
export function ChatNav() {
	const chat = useContext(ChatSocketContext).ChatSocketDispatch;

	function reduceChat() {
		chat({ type: EChatSocketActionType.DISPLAY, payload: false })
	}

	return (
		<div className='messages-nav'>
			<p>awdawdaw</p>
			<div className='messages-options'>
				<button id='btn-messages-reduction' onClick={() => reduceChat()}></button>
				<button id='btn-messages-panel'></button>
			</div>
		</div>
	)
}

