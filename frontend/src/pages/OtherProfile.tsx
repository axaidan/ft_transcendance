// Extern:
import { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';

// Intern:

import "../styles/components/profile_components/OthNavProfile.css"
import { useContext } from 'react';
import { AxiosJwt } from '../hooks/AxiosJwt';
import { DflUser, IUser } from '../types/interfaces/IUser';
import { ESocketActionType, SocketContext } from '../context';
import { DflRelationship, IRelationship } from '../types';


export function OtherProfile() {
	const axios = AxiosJwt();
	const { id } = useParams();
	const [othUser, setOthUser] = useState<IUser>(DflUser);
	const { me, friends, blocks } = useContext(SocketContext).SocketState;
	const dispatch = useContext(SocketContext).SocketDispatch
	const [isFriend, setisFriend] = useState(false);
	const [isBlocked, setisBlocked] = useState(false);

	useEffect(() => {
		axios.get("/user/" + id)
			.then((res: AxiosResponse<IUser>) => { setOthUser(res.data) })
			.catch(() => { alert('This user does not exist.'); useNavigate() });
	}, [id]);


	useEffect(() => {
		axios.get('/relation/is_friend/' + id)
			.then((res: AxiosResponse<boolean>) => { setisFriend(res.data) })
	})

	useEffect(() => {
		axios.get('/relation/is_block/' + id)
			.then((res: AxiosResponse<boolean>) => { setisBlocked(res.data) })
	})

	const BlockFriend = async (user: IUser) => {
		await axios.post('/relation/block_user/' + user.id);
		dispatch({ type: ESocketActionType.ADD_BLOCKS, payload: user });
		dispatch({ type: ESocketActionType.RM_FRIENDS, payload: user });
	}


	const AddFriend = async (user: IUser) => {
		await axios.post('/relation/add_friend/' + user.id);
		dispatch({ type: ESocketActionType.ADD_FRIENDS, payload: user });
	}

	const RemoveFriend = async (user: IUser) => {
		await axios.post('/relation/remove_friend/' + user.id);
		dispatch({ type: ESocketActionType.RM_FRIENDS, payload: user });
	}

	const RemoveBlock = async (user: IUser) => {
		await axios.post('/relation/unblock_user/' + user.id)
		dispatch({ type: ESocketActionType.RM_BLOCKS, payload: user });
		if (await IsFriend(user.id) === true)
			dispatch({ type: ESocketActionType.ADD_FRIENDS, payload: user });
	}

	const IsFriend = async (cibleId: number): Promise<boolean> => {
		return (await axios.get('/relation/is_friend/' + cibleId)).data;
	}


	return (
		<div className="otherProfileBody">
			<div className="other-left-side">
				<div className="other-banner">
					<div className="other-options">
						{isBlocked ?
							<></> :
							isFriend ? <button onClick={() => RemoveFriend(othUser)} >Remove</button> : <button onClick={() => AddFriend(othUser)} >Add</button>
						}
						{isBlocked ? <button onClick={() => RemoveBlock(othUser)}>Unblock</button> : <button onClick={() => BlockFriend(othUser)}>Block</button>}
					</div>
					<div className="other-clan">
						My clan
					</div>
					<div className="other-xp-bar"></div>
					<div className="other-xp-fill"></div>
					<div className="other-xp-nbr"></div>
					<div className="other-xp-value">
						25
					</div>
					<div className="other-profile-icon-div">
						<img src={othUser.avatarUrl} id="other-profile-icon" />
					</div>
					<div className="other-end-of-banner">
					</div>
				</div>
				<div className="other-loot">
					<div className="other-coffer"> 0 </div>
					<div className="other-boost"> 0 </div>
					<div className="other-reroll"> 0 </div>
				</div>
			</div>
			<div className="other-stats">
				<div className="other-setting">
				</div>
				<div className="other-lol-stats">
					<div className="other-rank">
						<h3>Rank</h3>
						<div className="other-txt">
							unranked
						</div>
					</div>
					<div className="other-honor">
						<h3>Honor</h3>
						<div className="other-txt">
							none
						</div>
					</div>
					<div className="other-champion">
						<h3>Victories</h3>
						<div className="other-txt">
							No game yet
						</div>
					</div>
					<div className="other-trophee">
						<h3>Trophee</h3>
						<div className="other-txt">
							none
						</div>
					</div>
					<div className="other-clash">
						<div id='other-stats-column'>
							<h3>Banner</h3>
							<div className="other-txt">
								none
							</div>
						</div>
					</div>
				</div>
			</div>
		</div >
	)
}