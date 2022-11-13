// Extern:
import { useContext } from "react";

// Intern:
import { ChatSocketContext } from "../../context";
import { IUser } from "../../types";
import { ChatOption } from ".";

export interface ChatUserProps { user: IUser, msg: string | undefined }
export const ChatUser: React.FunctionComponent<ChatUserProps> = ({ user, msg }) => {
	return (
		<div className="chat-user">	
			<div className="chat-user-avatar">
				<img src={user.avatarUrl} className="chat-user-icon" />
			</div>
			<div>
				<p id="chat-username">{user.username}</p>
				<p id="chat-user-origin">{msg}</p>
			</div>
		</div>
	)
}

export function ChatNav() {
	const { me, discussion, index_active } = useContext(ChatSocketContext).ChatSocketState;

	const oth_User = () => {
		const user1: IUser = discussion[index_active].user1;
		const user2: IUser = discussion[index_active].user2;
		return ( me.id != user1.id ? user1 : user2 );
	};

	const user = oth_User();

	return (
		<div className='messages-nav'>
			<ChatUser user={user} msg={user.login + " #EUW"}/>
			<ChatOption user={user} mod={true} />
		</div>
	)
}

