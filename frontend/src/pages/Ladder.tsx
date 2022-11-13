
//EXTERN
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AxiosResponse } from "axios";

//CONTEXT
import { UserCreateChat } from "../components";
import { SocketContext } from "../context";

//CUSTOM HOOK
import { AxiosJwt } from '../hooks/AxiosJwt'

//ASSET
import { IUser } from '../types/interfaces/IUser';

type LadderProps = {
	user: IUser,

}

function LadderList({ user }: LadderProps) {
	const { me, blocks } = useContext(SocketContext).SocketState;
	const [isBlocked, setisBlocked] = useState(false);
	const axios = AxiosJwt();

	useEffect(() => {
		axios.get('/relation/is_block/' + user.id)
			.then((res: AxiosResponse<boolean>) => { setisBlocked(res.data) })
	}, [blocks])

	return (
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
				{user.id === me.id || isBlocked ?
					<></> :
					<UserCreateChat user={user}>
						<button id='friend-chat' className="ladder-chat"></button>
					</UserCreateChat>
				}
			</div>
			<div className="ladder-stats">
				Rank points: {user.ranking}
			</div>
		</div>
	);
}

export function Ladder() {
	const [users, setUsers] = useState<IUser[]>([]);
	const axios = AxiosJwt();

	useEffect(() => {
		axios.get('/user/all')
			.then((res) => setUsers(res.data))
	}, []);

	const SortUsersByWinrate = (users: IUser[]): IUser[] => {
		const usersSorted = users.sort((user1: IUser, user2: IUser) => user2.ranking - user1.ranking)
		return usersSorted;
	};

	return (
		<div className="ladder-body">
			<ul className="ladder-list">
				<div className="ladder-title">
					LADDERBOARD
				</div>
				{SortUsersByWinrate(users).map((user: IUser, index: number) => (
					<LadderList key={index} user={user} />
				))}
			</ul>
		</div>
	)
}