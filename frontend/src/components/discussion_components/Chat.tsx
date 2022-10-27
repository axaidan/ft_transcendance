
// Extern:
import { useContext, useEffect, useRef } from "react";

// Intern:
import { ChatNav, DiscussionNav } from ".";
import { ChatSocketContext, SocketContext } from "../../context";

// Assets:
import '../../styles/components/discussion_components/Chat.css'
import { IMessage } from "../../types";


type DiscMessageProps = { msg: IMessage }
export function DiscMessage({ msg }: DiscMessageProps) {
	const { me } = useContext(SocketContext).SocketState;

	// COMPARE LES UIDS, RENVOIE LA CLASSE CSS APPROPRIER. 
	const message_side = () => { return ((me.id != msg.userId ? "left" : "right")); }

	return (
			<div className={"message-" + message_side()}>
				<div id={"triangle-" + message_side()}></div>
				<p>{msg.text}</p>
			</div>
	)
}

export function ChatBody() {
	const { discussion, index_active } = useContext(ChatSocketContext).ChatSocketState;
	if (!discussion) return <></>

	useEffect(() => {
		let element = document.getElementById("messages-body");
		element!.scrollTop = element!.scrollHeight;
	})

	return (
		<div id='messages-body'>
			{discussion[index_active]?.messages?.map((message, index) => {
				return <DiscMessage key={index} msg={message} />
			})}
		</div>
	)
}

export function Chat() {
	const { me, chat_display, socket, index_active, discussion } = useContext(ChatSocketContext).ChatSocketState;

	/* Permet d'envoyer le message au back - dans le cas ou l'input nest pas vide */
	const handleKeyDown = (e: any) => {
		const input = document.getElementById('messages-input') as HTMLInputElement;
		if (e.key === 'Enter') {
			if (input.value.length != 0) {

				socket!.emit('discMsgToServer', { discId: discussion[index_active].id, userId: me.id, text: input.value });

				// ICI je doit emit le message au back!
				// il me faut donc: - socket - userId - input.value - discId
			}
			// Flush du contenu d'input:
			input.value = "";
		}
	}

	return (
		<div id={chat_display ? "chat-container-display" : "chat-container-none"}>
			<DiscussionNav />
			<div className='messages-container'>
				{(index_active != -1 ? <><ChatNav /><ChatBody /></> : <></>)}
				<input id="messages-input" placeholder='Tapez votre message ici...' onKeyDown={handleKeyDown} />
			</div>
		</div>
	)
}
