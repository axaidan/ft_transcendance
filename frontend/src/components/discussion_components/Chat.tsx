
// Extern:
import { useContext } from "react";

// Intern:
import { ChatNav, DiscussionNav } from ".";
import { ChatSocketContext, SocketContext } from "../../context";

// Assets:
import '../../styles/components/discussion_components/Chat.css'



export function ChatBody() {


	const { discussion, index_active } = useContext(ChatSocketContext).ChatSocketState;

	if ( !discussion ) return <></>

	return (
		<div className='messages-body'>
			{ discussion.at(index_active)?.messages.map((message, index) => { 
				return <div key={index}>{message.text}</div>
			 })}
		</div>
	)
}

export function Chat() {
	const { uid } = useContext(SocketContext).SocketState;

	/* Permet d'envoyer le message au back - dans le cas ou l'input nest pas vide */
	const handleKeyDown = ( e: any ) => {
		const input = document.getElementById('messages-input') as HTMLInputElement;
		if ( e.key === 'Enter') {
			if (input.value.length != 0) {
				console.log('uid ', uid, " to did " , "" , " : ", input.value);
				// ICI je doit emit le message au back!
				// il me faut donc: - socket - userId - input.value - discId

			} else { console.log('input is empty'); }
			// Flush du contenu d'input:
			input.value = "";
		}
	}

	return (
		<div id="chat-container">
			<DiscussionNav />
			<div className='messages-container'>
				<ChatNav />
				<ChatBody />
				<input	id="messages-input" placeholder='Tapez votre message ici...' onKeyDown={handleKeyDown}/>
			</div>
		</div>
	)
}
