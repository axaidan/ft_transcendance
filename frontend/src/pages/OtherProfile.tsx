// Extern:
import { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { useParams } from 'react-router';

// Intern:

import "../styles/components/profile_components/OthNavProfile.css"
import { AxiosJwt } from '../hooks/AxiosJwt';
import { ESocketActionType, SocketContext } from '../context';

//INTERFACES
import { IUser, DflUser } from '../types/interfaces/IUser';

//CUSTOM HOOK
import { getVictories, getDefeat, getWinrate, getDraws } from '../hooks/useWinrate';
import { useUser } from '../hooks/useUser';
import { IGame } from '../types';
import { useNavigate } from 'react-router-dom';

//ASSET


export function OtherProfile() {

	const { id } = useParams();
	const { friends, blocks } = useContext(SocketContext).SocketState;
	const { me } = useContext(SocketContext).SocketState;
	const dispatch = useContext(SocketContext).SocketDispatch
	const navigate = useNavigate();

	const axios = AxiosJwt();

	const [othUser, setOthUser] = useState(DflUser);
	const [games, setGames] = useState<IGame[]>([]);
	const [isFriend, setisFriend] = useState(false);
	const [isBlocked, setisBlocked] = useState(false);

	useEffect(() => {
		axios.get('/game/historique/' + id)
			.then((res: AxiosResponse<IGame[]>) => { setGames(res.data) });
		axios.get('/user/' + id)
			.then((res) => {
				setOthUser(res.data);
				if (!res.data)
					navigate('/home/acceuil');
			})
	}, []);

	useEffect(() => {
		axios.get('/relation/is_friend/' + id)
			.then((res: AxiosResponse<boolean>) => { setisFriend(res.data) })
		axios.get('/relation/is_block/' + id)
			.then((res: AxiosResponse<boolean>) => { setisBlocked(res.data) })
	}, [friends, blocks])

	const BlockFriend = async (user: IUser) => {
		await axios.post('/relation/block_user/' + user.id);
		dispatch({ type: ESocketActionType.ADD_BLOCKS, payload: user });
		dispatch({ type: ESocketActionType.RM_FRIENDS, payload: user });
		axios.post('/achiv/unlock', { userId: me.id, achivId: 5 });
		location.reload();
	}


	const AddFriend = async (user: IUser) => {
		await axios.post('/relation/add_friend/' + user.id);
		dispatch({ type: ESocketActionType.ADD_FRIENDS, payload: user });
	}

	const RemoveFriend = async (user: IUser) => {

		await axios.post('/relation/remove_friend/' + user.id);
		const friend = friends.filter(friend => friend.id == user.id);
		dispatch({ type: ESocketActionType.RM_FRIENDS, payload: friend[0] });
	}

	const RemoveBlock = async (user: IUser) => {
		await axios.post('/relation/unblock_user/' + user.id)
		dispatch({ type: ESocketActionType.RM_BLOCKS, payload: user });
		if (await IsFriend(user.id) === true)
			dispatch({ type: ESocketActionType.ADD_FRIENDS, payload: user });
		location.reload();
	}

	const IsFriend = async (cibleId: number): Promise<boolean> => {
		return (await axios.get('/relation/is_friend/' + cibleId)).data;
	}

	return (
		<div className="otherProfileBody">
			<div className="other-left-side">
				<div className="other-banner">
					<div className="other-options">
						{othUser.id === me.id ?
							<></> :
							isBlocked ?
								<></> :
								isFriend ? <button id="other-remove" onClick={() => RemoveFriend(othUser)} /> : <button id="other-add" onClick={() => AddFriend(othUser)} />
						}
						{othUser.id === me.id ?
							<></> :
							isBlocked ? <button id="other-unblock" onClick={() => RemoveBlock(othUser)} /> : <button id="other-block" onClick={() => BlockFriend(othUser)} />}
					</div>
					<div className="other-clan">
						My clan
					</div>
					<div className="other-xp-bar"></div>
					<div className="other-xp-fill"></div>
					<div className="other-xp-nbr"></div>
					<div className="other-xp-value">
						{othUser.id}
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
							Victories : {getVictories(games, othUser.id)}
						</div>
						<div className="other-txt">
							Defeats : {getDefeat(games, othUser.id)}
						</div>
						<div className="other-txt">
							Draw : {getDraws(games, othUser.id)}
						</div>

						<div className="other-txt">
							<div className={getWinrate(games, othUser.id) >= 50 ? 'other-winrate-pos' : 'other-winrate-neg'}>
								Winrate: {getWinrate(games, othUser.id)}%
							</div>
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