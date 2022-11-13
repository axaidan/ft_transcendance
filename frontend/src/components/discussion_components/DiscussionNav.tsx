// Extern:
import { useContext } from 'react';

// Intern:
import { ChatSocketContext, EChatSocketActionType } from '../../context';
import { IDiscussion, IMessage, IUser } from '../../types';
import { DiscLinkUser } from './ChatUtils';
import { ChatUser } from './ChatNav';

type DiscUserProps = { user: IUser, active:boolean, msg: IMessage[], did: number };
function DiscUser({ user, active, msg, did }:DiscUserProps) {
	const dispatch = useContext(ChatSocketContext).ChatSocketDispatch;
	const { discussion } = useContext(ChatSocketContext).ChatSocketState;

	const lastMsg = () => {
		let last = msg[msg.length - 1]?.text.slice(0, 12)
		if (last && last.length >= 11) last = last + "...";
		return last
	}

	const removeDisc = () => { 
		dispatch({ type: EChatSocketActionType.RM_DISC, payload: did})
		if (active) dispatch({ type: EChatSocketActionType.UP_CURR, payload: (discussion.length - 2)})
		if (discussion.length <= 1) dispatch({ type: EChatSocketActionType.DISPLAY, payload: false});
	};
	
	return (
		<div className={ active ? "disc-user-active" : 'disc-user'}>
			<div className={ active ? "disc-box-active" : "none" }></div>
			<ChatUser user={user} msg={lastMsg()}/>
			<button id="disc-close" onClick={() => removeDisc()} />
		</div>
	)
}

export function DiscussionNav() {
	const { me, discussion, index_active } = useContext(ChatSocketContext).ChatSocketState;
	const othUser = (disc: IDiscussion) => { return ( disc.user1Id != me.id ? disc.user1 : disc.user2 ); }
	
	return (
		<div className='discussion-container'>
			{discussion?.map((disc: IDiscussion, index) => (
				<DiscLinkUser key={index} index={index} >
					<DiscUser user={othUser(disc)} active={(index_active == index)} msg={disc.messages} did={disc.id}/>
				</DiscLinkUser>
			)).reverse()}
		</div>
	)
}

