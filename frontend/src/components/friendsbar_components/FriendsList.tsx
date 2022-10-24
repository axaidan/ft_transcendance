// Extern:
import { useContext } from "react";

// Intern:
import { Contact } from ".";
import { ChatSocketContext, EChatSocketActionType, SocketContext } from "../../context";
import { IDiscussion, IUser } from "../../types";

export function FriendsList() {
	const { users, friends } = useContext(SocketContext).SocketState;
	const { discussion, active_disc } = useContext(ChatSocketContext).ChatSocketState;
	const ChatDispatch = useContext(ChatSocketContext).ChatSocketDispatch;


	function UpDateActiveDiscusion( uid: number, discussion: IDiscussion[], active_disc: number[] ) {

		// console.log('OPEN USER: ', uid);
		const ret: IDiscussion[] = discussion.filter((disc) => {( disc.user1Id == uid || disc.user2Id == uid ) })
		
		console.log( "DISCUTION: ", discussion );
		console.log("SEARCH IF DISC EXESTING: ", ret);
	
		if ( ret.length == 0 ) { // LA CONVERSATION N'EXISTE PAS EXISTE: 
			console.log("ELLE N'EXISTE PAS");
			// Creation de la conversation.
		} else {
			console.log("ELLE EXISTE: ", ret.at(0) );
			const new_did = ret.at(0)!.discId;
			ChatDispatch({ type: EChatSocketActionType.A_DISC, payload: new_did });
			ChatDispatch({ type: EChatSocketActionType.UP_CURR, payload: active_disc.find(did => did == new_did )!});
		}
	
		// ACTIVE LA DIV HTML DU CHAT
		const chatComponents = document.querySelector('#chat-container') as HTMLElement;
		chatComponents.style.display = 'grid';
	}

	const isOnline = (uid: number, index: number, user: IUser) => {
		if (users.includes(uid)) {
			return (
				<div key={index} onClick={() => {
					UpDateActiveDiscusion(uid, discussion, active_disc);
					HandleClicContact();
				}}>
					<Contact user={user} status={0} />
				</div>
			)
		}
	}

	const isOffline = (uid: number, index: number, user: IUser) => {
		if (users.includes(uid) == false) {
			return (
				<div key={index} onClick={() => {
					UpDateActiveDiscusion(uid, discussion, active_disc);
					HandleClicContact();
				}}>
					<Contact user={user} status={4} />
				</div>
			)
		}
	}

	return (
		<ul id='contact-list'>
			<p>ONLINE</p>
			{friends.map((user: IUser, index) => (isOnline(user.id, index, user)))}
			<p>OFFLINE</p>
			{friends.map((user: IUser, index) => (isOffline(user.id, index, user)))}
			<p>CHANNELS</p>
		</ul>
	)
}

function HandleClicContact() {
	const chatComponents = document.querySelector('#chat-container') as HTMLElement;
	chatComponents.style.display = 'grid';
}