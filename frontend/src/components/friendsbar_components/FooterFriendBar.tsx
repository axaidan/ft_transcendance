
import { useContext } from 'react';
import { ChatSocketContext, EChatSocketActionType } from '../../context';
import '../../styles/components/friendsbar_components/FooterFriend.css'

export function FooterFriendBar() {
	const { chat_display } = useContext(ChatSocketContext).ChatSocketState;
	const chat = useContext(ChatSocketContext).ChatSocketDispatch;

	const HandleClicReduction = () => {
		chat({ type: EChatSocketActionType.DISPLAY, payload: !chat_display })
	}

	return (
		<div className="footer-friend">
			<button id='btn-footer-discussion' onClick={HandleClicReduction} />
			<button id='btn-footer-mission'></button>
			<button></button>
			<div><p> V12.19 </p></div>
			<button id='btn-footer-help'></button>
		</div>
	)
}

