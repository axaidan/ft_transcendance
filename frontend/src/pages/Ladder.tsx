import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AxiosJwt } from '../hooks/AxiosJwt'
import { IUser } from '../types/interfaces/IUser';

export function Ladder() {

	const [users, setUsers] = useState([]);
	const axios = AxiosJwt();
	const [ladder, setLadder] = useState([]);

	useEffect(() => {
		axios.get('/user/all')
			.then((res) => setUsers(res.data))
	}, []);

	const SortUsersByWinrate = (users: IUser[]): IUser[] => {
		const usersSorted = users.sort((user1: IUser, user2: IUser) => user2.id - user1.id)
		return usersSorted;
	};

	return (
		<div>
			<ul>
				{SortUsersByWinrate(users).map((user: IUser) => (
					<Link to={"/home/" + user.id} >
						<li key={user.id}>{user.login} + {user.id} </li>
					</Link>
				))}
			</ul>
		</div>
	)
}