// Extern:
import { useEffect, useState, useContext } from "react"
import { useOutletContext, Link } from "react-router-dom";
import { AxiosResponse } from "axios";
import '../../styles/components/profile_components/Friends.css'

// Intern:
import { IUser } from "../../types/interfaces/IUser"
import { AxiosJwt } from "../../hooks";
import { SocketContext } from '../../context/UserSocket/Socket';


type FriendProps = {
	friend: IUser;
}

function FriendList({ friend }: FriendProps) {
	return (
		<div className="friend-bloc">
			<img src={friend.avatarUrl} id='friend-avatar' />
			<div className="friend-username">
				{friend.username}
			</div>
			<Link to={"/home/" + friend.id}>
				<button id='friend-redirect'>
				</button>
			</Link>
			<div className="friend-right-button">
				<button id='friend-chat'>Chat</button>
				<button id='friend-unfriend'></button>
			</div>
		</div>
	)
}

export function Friends() {
	const axios = AxiosJwt();
	const { me } = useContext(SocketContext).SocketState;
	const [friends, setFriends] = useState<IUser[]>([]);
	const [blocks, setBlocks] = useState<IUser[]>([]);

	useEffect(() => {
		// GET FRIENDS:
		axios.get('/relation/list_friend')
			.then((res: AxiosResponse<IUser[]>) => { setFriends(res.data) });
		// GET BLOCKS:
		axios.get('/relation/list_block')
			.then((res: AxiosResponse<IUser[]>) => { setBlocks(res.data) });
	}, [])

	return (
		<div className="friends-body">
			<ul>
				<h1>friend:</h1>
				{friends.map((friend: IUser, index: number) => (
					<FriendList key={index} friend={friend} />
				))}
			</ul>

			<ul>
				<h1>Block:</h1>
				{blocks.map((block: IUser, index) => (
					<Link key={index} to={"/home/" + block.id}>
						<li>{block.username}</li>
					</Link>
				))}
			</ul>
		</div>
	)
}