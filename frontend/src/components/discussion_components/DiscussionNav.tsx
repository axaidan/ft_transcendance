
import { useContext } from 'react';
import { Contact } from '..';
import { ChatSocketContext } from '../../context';
import { IDiscussion, IUser } from '../../types';

export function DiscussionNav() {
	const { me, discussion } = useContext(ChatSocketContext).ChatSocketState;

	return (
		<div className='discussion-container'>
			{discussion?.map((disc: IDiscussion, index) => (
				<p key={index}>{me.id !== disc.user1Id ? disc.user2.username : disc.user1.username}</p>
			))}
		</div>
	)
}
