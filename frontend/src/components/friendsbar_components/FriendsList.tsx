// Extern:
import { useContext, useEffect, useState } from "react";

// Intern:
import { Contact } from ".";
import { IDiscussion, IUser } from "../../types";
import { ChatSocketContext, ESocketActionType, IStatus, SocketContext } from "../../context";
import { UserCreateChat } from "../discussion_components";

// Assets:
import '../../styles/components/friendsbar_components/FriendsList.css'
import { AxiosJwt } from "../../hooks";
import { AxiosResponse } from "axios";

interface UserListCategorieProps { users: IUser[], title: string, counter: boolean };
const UserListCategorie: React.FunctionComponent<UserListCategorieProps> = ({ users, title, counter }) => {

	const [active, setActive] = useState<boolean>(true);
	const activeCategorie = () => { setActive(!active) };

	return (
		<div>
			<div id='title-container' onClick={() => activeCategorie()}>
				<div id={'triangle-categories' + (active ? '-active' : '')} />
				<p id="title-categories">{title}</p>
				<p id="title-categories">{(counter ? " (" + users.length + ")" : "")}</p>
			</div>
			{active ? users.map((user, index) => {
				return (
					<UserCreateChat key={index} user={user}>
						<Contact user={user} />
					</UserCreateChat>
				)
			}) : <></>}
		</div>
	);
}


export function othUserChat() {
	const { me, allDiscussions } = useContext(ChatSocketContext).ChatSocketState;
	const { friends } = useContext(SocketContext).SocketState;

	console.log("ALL DISCUSSION: ", allDiscussions);

	let othUser: IUser[] = [];
	const discTab = allDiscussions;



	for (const disc of discTab) {
		console.log( friends );
		console.log("U1 IS IN ? " , friends.includes(disc.user1))
		console.log("U2 IS IN ? " , friends.includes(disc.user2))
		if (disc.user1Id != me.id && friends.includes(disc.user1)) {
			othUser.push( disc.user1 );
		} else if (disc.user2Id != me.id && friends.includes(disc.user2)) {
			othUser.push( disc.user2 );
		}
	}
	return othUser;
}

export function FriendsList() {
	const { users, friends } = useContext(SocketContext).SocketState;

	const userOnline = () => {
		return friends.filter((friend) => {
			if (users.find((user) => { return user.userId == friend.id })?.status != undefined)
				return friend;
		})
	}

	const userOffline = () => {
		return friends.filter((friend) => {
			if (users.find((user) => { return user.userId == friend.id })?.status == undefined)
				return friend;
		})
	}
	
	return (
		<ul id='contact-list'>
			<UserListCategorie users={[]} title="CHANNELS" counter={false} />
			<UserListCategorie users={userOnline()} title="ONLINE" counter={true} />
			<UserListCategorie users={userOffline()} title="OFFLINE" counter={true} />
			<UserListCategorie users={othUserChat()} title="OTHER" counter={true} />
		</ul>
	)
}

