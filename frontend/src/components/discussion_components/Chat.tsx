
// Extern:
import { useContext, useEffect } from "react";

// Intern:
import { ChatNav, DiscussionNav, ChatOption, ChatUser, UserCreateChat } from ".";
import { ChatSocketContext, SocketContext } from "../../context";
import { DflUser, IMessage } from "../../types";

// Assets:
import '../../styles/components/discussion_components/Chat.css'


type DiscMessageProps = { msg: IMessage }
export function DiscMessage({ msg }: DiscMessageProps) {
	const { me } = useContext(SocketContext).SocketState;
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

	const handleKeyDown = (e: any) => {
		const input = document.getElementById('messages-input') as HTMLInputElement;
		if (e.key === 'Enter') {
			if (input.value.length != 0) {socket!.emit('discMsgToServer', { discId: discussion[index_active].id, userId: me.id, text: input.value });}
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

	const ChatNotAble = () => { return (
			<>
				<DiscussionCreate />
				<div className='messages-container-search'>
					<ChatSearch />
					<input id="messages-input" placeholder='  Filter' onKeyDown={handleKeyDown} />
					<ChatSearchFriends />
				</div>
			</>
	)}

	return (
		<div id={chat_display ? "chat-container-display" : "chat-container-none"}>
			{(index_active != -1 ? < ChatAble /> : <ChatNotAble />)}
		</div>
	)
}

function ChatSearchFriends() {
	const { friends } = useContext(SocketContext).SocketState;
	return (
		<div id='chat-search-friends'>{friends.map((friend, index) => { return (
			<UserCreateChat key={index} user={friend}>
				<div className="disc-user">
					<ChatUser user={friend} msg={friend.login + " #EUW"} />
				</div>
			</UserCreateChat>
		)})}</div>)
}

function ChatSearch() {
	return (
		<div className='messages-nav'>
			<ChatUser user={DflUser} msg={undefined} />
			<ChatOption user={DflUser} />
		</div>
	)
}

function DiscussionCreate() {
	return (
		<div className='discussion-container'>
			<div className='disc-user-active'>
				<div className="disc-box-active" />
				<ChatUser user={DflUser} msg={'creation d\'un nouveau...'} />
			</div>
		</div>
	)
}