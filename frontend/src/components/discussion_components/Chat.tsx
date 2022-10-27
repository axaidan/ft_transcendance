
// Extern:
import { useContext, useEffect, useRef } from "react";

// Intern:
import { ChatNav, DiscussionNav } from ".";
import { ChatSocketContext, EChatSocketActionType, SocketContext } from "../../context";

// Assets:
import '../../styles/components/discussion_components/Chat.css'
import { IMessage, IUser } from "../../types";


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
			<p id='messages-careful'>N'oubliez pas que notre equipe transendence ne vous demandera jamais votre mot de passe pour vous aider.</p>
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

	const ChatAble = () => {
		return (
			<>
				<DiscussionNav />
				<div className='messages-container'>
					<ChatNav />
					<ChatBody />
					<input id="messages-input" placeholder='Tapez votre message ici...' onKeyDown={handleKeyDown} />
				</div>
			</>
		);
	}

	const ChatNotAble = () => {
		return (
			<>
				<DiscussionCreate />
				<div className='messages-container-search'>
					<ChatSearch />
					<input id="messages-input" placeholder='Tapez votre message ici...' onKeyDown={handleKeyDown} />
					<ChatSearchFriends />
				</div>
			</>
		)
	}

	return (
		<div id={chat_display ? "chat-container-display" : "chat-container-none"}>
			{(index_active != -1 ? < ChatAble /> : <ChatNotAble />)}
		</div>
	)
}

type ChatUserProps = { user: IUser };
const ChatUser = ({ user }: ChatUserProps) => {
	return (
		<div className="chat-user">
			<div className="chat-user-avatar">
				<img src={user.avatarUrl} className="chat-user-icon" />
			</div>
			<div>
				<p id="chat-username">{user.username}</p>
				<p id="chat-user-origin">{user.login + " #EUW"}</p>
			</div>
		</div>
	)
}


function ChatSearchFriends() {
	const { friends } = useContext(SocketContext).SocketState;
	return (<div id='chat-search-friends'>{friends.map(friend => { return < ChatUser user={friend} /> })}</div>)
}

function ChatSearch() {
	const chat = useContext(ChatSocketContext).ChatSocketDispatch;
	function reduceChat() { chat({ type: EChatSocketActionType.DISPLAY, payload: false }) }

	return (
		<div className='messages-nav'>
			<div className="chat-user">
				<div className="disc-user-avatar">
					<img className="disc-user-icon" />
				</div>
				<div>
					<p>Nouveau message</p>
				</div>
			</div>
			<div className='messages-options'>
				<button id='btn-messages-reduction' onClick={() => reduceChat()}></button>
				<button id='btn-messages-panel'></button>
			</div>
		</div>
	)
}

function DiscussionCreate() {
	return (
		<div className='discussion-container'>
			<div className='disc-user-active'>
				<div className="disc-box-active"></div>
				<div className="disc-user-avatar">
					<img className="disc-user-icon" />
				</div>
				<div>
					<p id="disc-create-message">Nouveau message</p>
					<p id="disc-create-submess">creation d'un nouveau...</p>
				</div>
			</div>
		</div>
	)
}