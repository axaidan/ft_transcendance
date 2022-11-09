// Extern:
import { useContext } from 'react';

// Intern:
import { ChatSocketContext, EChatSocketActionType, EChannelSocketActionType, ChannelSocketContext } from '../../context';

// Assets:
import '../../styles/components/friendsbar_components/FooterFriend.css'

export function FooterFriendBar() {
	const { chat_display } = useContext(ChatSocketContext).ChatSocketState;
	const { channel_display } = useContext(ChannelSocketContext).ChannelSocketState;
	const chat = useContext(ChatSocketContext).ChatSocketDispatch;
	const channel = useContext(ChannelSocketContext).ChannelSocketDispatch;
	const HandleClicReduction = () => { chat({ type: EChatSocketActionType.DISPLAY, payload: !chat_display }) }
	const HandleClicChannel = () => { channel({ type: EChannelSocketActionType.DISPLAY, payload: !channel_display }) }

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
