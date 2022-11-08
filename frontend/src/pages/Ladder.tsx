import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserCreateChat } from "../components";
import { AxiosJwt } from '../hooks/AxiosJwt'
import { IUser } from '../types/interfaces/IUser';

type LadderProps = {
	user: IUser
}

export function Ladder() {

	const [users, setUsers] = useState([]);
	const axios = AxiosJwt();
	const [ladder, setLadder] = useState([]);

	useEffect(() => {
		axios.get('/user/all')
			.then((res) => setUsers(res.data))
	}, []);

	const SortUsersByWinrate = (users: IUser[]): IUser[] => {
		const usersSorted = users.sort((user1: IUser, user2: IUser) => user1.id - user2.id)
		return usersSorted;
	};

	return (
		<div className="ladder-body">
			<ul className="ladder-list">
				<div className="ladder-title">
					LADDERBOARD
				</div>
				{SortUsersByWinrate(users).map((user: IUser) => (
					<div className="ladder-user-div">
						<div className="ladder-avatar-div">
							<img id="ladder-avatar" src={user.avatarUrl} />
						</div>
						<Link to={"/home/" + user.id} >
							<div className="ladder-username" key={user.id}>
								{user.username}
							</div>
						</Link>
						<Link to={"/home/" + user.id}>
							<button id='friend-redirect' />
						</Link>
						<div className="ladder-buttons">
							<UserCreateChat user={user}>
								<button id='friend-chat' className="ladder-chat"></button>
							</UserCreateChat>
						</div>
						<div className="ladder-stats">
							Rank: {user.id}
						</div>
					</div>
				))}
			</ul>
		</div>
	)
}