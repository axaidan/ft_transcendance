// Extern:
import { useContext } from 'react';

// Intern:
import { ChatSocketContext, EChatSocketActionType } from '../../context';

// Assets:
import '../../styles/components/friendsbar_components/FooterFriend.css'

export function FooterFriendBar() {
	const { chat_display, channel_display } = useContext(ChatSocketContext).ChatSocketState;
	const chat = useContext(ChatSocketContext).ChatSocketDispatch;
	const HandleClicReduction = () => { chat({ type: EChatSocketActionType.DISPLAY, payload: !chat_display }) }
	const HandleClicChannel = () => { chat({ type: EChatSocketActionType.DISPLAY_CHAN, payload: !channel_display }) }

	return (
		<div className="footer-friend">
			<button id='btn-footer-discussion' onClick={HandleClicReduction} />
			<button id='btn-footer-mission' onClick={HandleClicChannel} />
			<button></button>
			<div><p> V12.19 </p></div>
			<button id='btn-footer-help'></button>
		</div>
	)
}
