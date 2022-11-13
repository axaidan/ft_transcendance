// Extern:
import React, { useContext, useEffect, useState } from "react";

// Intern:
import { ChatSocketContext, EChatSocketActionType } from "../../context";

// Assets:
import "../../styles/components/discussion_components/ChatOptionMenu.css"
import { IUser } from "../../types";

const btn = ( id: number ) => {
	console.log(id)
}

const ChatOptionMenu = () => {

	return (
		<div className="Chat-Option-Menu">
			<div className="div1" onClick={() => btn(1)} >1</div>
			<div className="div1" onClick={() => btn(2)}>2</div>
			<div className="div1" onClick={() => btn(3)}>3</div>
			<div className="div1" onClick={() => btn(4)}>4</div>
		</div>
	);
}

interface ChatOptionProps { user: IUser, mod?: boolean };
export const ChatOption = ({ user, mod }:ChatOptionProps) => {
	const dispatch = useContext(ChatSocketContext).ChatSocketDispatch;
	const { index_active } = useContext(ChatSocketContext).ChatSocketState;
	function reduceChat() { dispatch({ type: EChatSocketActionType.DISPLAY, payload: false })}

	useEffect(() => {
		setDisplay(false);
	}, [index_active])

	const [ display, setDisplay ] = useState<boolean>(false)

	return (
		<div className='messages-options'>
			<button id='btn-messages-reduction' onClick={() => reduceChat()} />
			<button id={ mod ? 'btn-messages-panel' : "btn-messages-panel-disable" } onClick={() => {if (mod) { setDisplay(!display)}} } />
			{ display ? <ChatOptionMenu /> : <></> }
			<></>
		</div>
	)
}