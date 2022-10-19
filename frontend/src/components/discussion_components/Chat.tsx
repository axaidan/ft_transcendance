import { ChatNav, DiscussionNav } from ".";

import '../../styles/components/discussion_components/Chat.css'

export function Chat() {
	return (
		<div id="chat-container">
			<DiscussionNav />
			<div className='messages-container'>
				<ChatNav />
				<div className='messages-body'></div>
				<input className="messages-input" placeholder='Tapez votre message ici...'/>
			</div>
		</div>
	)
}