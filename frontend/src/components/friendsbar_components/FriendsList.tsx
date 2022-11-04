// Extern:
import { useContext, useEffect, useState } from "react";

// Intern:
import { Contact } from ".";
import { IUser } from "../../types";
import { ESocketActionType, IStatus, SocketContext } from "../../context";
import { UserCreateChat } from "../discussion_components";

// Assets:
import '../../styles/components/friendsbar_components/FriendsList.css'

interface UserListCategorieProps { users: IUser[], title: string, counter: boolean };
const UserListCategorie: React.FunctionComponent<UserListCategorieProps> = ({ users, title, counter }) => {

	const [ active, setActive ] = useState<boolean>(true);
	const activeCategorie = () => { setActive(!active) }

	return (
		<div>
			<div id='title-container' onClick={() => activeCategorie()}>
				<div id={ 'triangle-categories' + (active ? '-active' : '' )} />
				<p id="title-categories">{title}</p>
				<p id="title-categories">{(counter ? " (" + users.length + ")" : "")}</p>
			</div>
			{ active ? users.map((user, index) => { return (
				<UserCreateChat key={index} user={user}> 
					<Contact user={user} mode={title == "ONLINE"}/>
				</UserCreateChat>
			)}) : <></> }
		</div>
	);
}

export function FriendsList() {
	const { users, friends } = useContext(SocketContext).SocketState;

	const userOnline = () => { return friends.filter((friend) => { return (users.includes(friend.id) == true)})}
	const userOffline = () => { return friends.filter((friend) => { return (users.includes(friend.id) == false)})}

	return (
		<ul id='contact-list'>
			<UserListCategorie users={[]} title="CHANNELS" counter={false}/>
			<UserListCategorie users={userOnline()} title="ONLINE" counter={true}/>
			<UserListCategorie users={userOffline()} title="OFFLINE" counter={true}/>
		</ul>
	)
}

