
import { useContext, useEffect } from 'react';
import { ChatSocketContext, EChatSocketActionType } from '../../context';
import { IDiscussion, IMessage, IUser } from '../../types';

type DiscUserProps = { user: IUser, index: number, msg: IMessage[], did: number };
function DiscUser({ user, index, msg, did }:DiscUserProps) {
	const dispatch = useContext(ChatSocketContext).ChatSocketDispatch;
	const { index_active, discussion } = useContext(ChatSocketContext).ChatSocketState;

	const UpDateActiveDiscusion = () => { if (index_active != index) dispatch({ type: EChatSocketActionType.UP_CURR, payload: index }) };
	
	const lastMsg = () => {
		let last = msg[msg.length - 1]?.text.slice(0, 12)
		if (last && last.length >= 11) last = last + "...";
		return last
	}

	const removeDisc = () => { 
		dispatch({ type: EChatSocketActionType.RM_DISC, payload: did})
		if (index_active == index) dispatch({ type: EChatSocketActionType.UP_CURR, payload: (discussion.length - 2)})
		if (discussion.length <= 1) dispatch({ type: EChatSocketActionType.DISPLAY, payload: false});
	};
	
	return (
		<div className={ index_active == index ? "disc-user-active" : 'disc-user'} onClick={() => {UpDateActiveDiscusion()}}>
			<div className={ index_active == index ? "disc-box-active" : "none" }></div>
			<div className="disc-user-avatar">
				<img src={user.avatarUrl} className="disc-user-icon" />
			</div>
			<div>
				<p id="disc-username">{user.username}</p>
				<p id="disc-user-lastmsg">{lastMsg()}</p>
			</div>
			<button id="disc-close" onClick={() => removeDisc()} />
		</div>
	)
}

export function DiscussionNav() {
	const { me, discussion } = useContext(ChatSocketContext).ChatSocketState;
	const othUser = (disc: IDiscussion) => { return ( disc.user1Id != me.id ? disc.user1 : disc.user2 ); }

	return (
		<div className='discussion-container'>
			{discussion?.map((disc: IDiscussion, index) => (
				<DiscUser key={index} user={othUser(disc)} index={index} msg={disc.messages} did={disc.id}/> // add last message  
			)).reverse()}
		</div>
	)
}
