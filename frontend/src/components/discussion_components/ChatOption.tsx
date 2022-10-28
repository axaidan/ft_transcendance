// Extern:
import React, { useContext } from "react";

// Intern:
import { ChatSocketContext, EChatSocketActionType } from "../../context";

export const ChatOption = () => {
	const dispatch = useContext(ChatSocketContext).ChatSocketDispatch;
	function reduceChat() { dispatch({ type: EChatSocketActionType.DISPLAY, payload: false })}
	return (
		<div className='messages-options'>
			<button id='btn-messages-reduction' onClick={() => reduceChat()}></button>
			<button id='btn-messages-panel'></button>
		</div>
	)
}