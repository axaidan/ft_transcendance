// Extern:
import { useEffect, useState } from "react"
import { useOutletContext, Link } from "react-router-dom";
import { AxiosResponse } from "axios";

// Intern:
import { IUser } from "../../types/interfaces/IUser"
import { AxiosJwt } from "../../hooks";


export function Friends() {
	const axios = AxiosJwt();
	const user: IUser = useOutletContext();
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
		<div>
			<div> FRIEND PAGE of: {user.login}</div>

			<h1>friend:</h1>
			<ul>
				{friends.map((friend: IUser) => (
					<Link to={"/home/" + friend.id}>
						<li>{friend.username}</li>
					</Link>
				))}
			</ul>

			<h1>Block:</h1>
			<ul>
				{blocks.map((block: IUser) => (
					<Link to={"/home/" + block.id}>
						<li>{block.username}</li>
					</Link>
				))}
			</ul>
		</div>
	)
}