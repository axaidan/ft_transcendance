// Extern:
import { AxiosResponse } from 'axios';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';

// Intern:

import "../styles/components/profile_components/OthNavProfile.css"
import { useContext } from 'react';
import { AxiosJwt } from '../hooks/AxiosJwt';
import { DflUser, IUser } from '../types/interfaces/IUser';
import { ESocketActionType, SocketContext } from '../context';
import { DflRelationship, IRelationship } from '../types';
import { IGame } from '../types/interfaces/IGame';


export function OtherProfile() {
	const axios = AxiosJwt();
	const { id } = useParams();
	const [othUser, setOthUser] = useState<IUser>(DflUser);
	const { me, friends, blocks } = useContext(SocketContext).SocketState;
	const dispatch = useContext(SocketContext).SocketDispatch
	const [isFriend, setisFriend] = useState(false);
	const [isBlocked, setisBlocked] = useState(false);
	const [games, setGames] = useState<IGame[]>([]);
	const [victories, setVictories] = useState(0);
	const [defeat, setDefeat] = useState(0);
	const [draw, setDraw] = useState(0);

	useEffect(() => {
		axios.get("/user/" + id)
			.then((res: AxiosResponse<IUser>) => {
				let User: IUser = res.data;
				setOthUser(User);
			})
			.catch(() => { alert('This user does not exist.') });
	}, []);


	useEffect(() => {
		axios.get('/game/historique/' + id)
			.then((res: AxiosResponse<IGame[]>) => { setGames(res.data) });
	}, [games]);

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



	const getVictories = (userId: number): void => {
		let victories: number = 0;
		games.map((game: IGame) => {
			if (game.player1.id === userId) {
				if (game.score1 > game.score2) {
					victories++;
				}
			}
			if (game.player2.id === userId) {
				if (game.score2 > game.score1) {
					victories++;
				}
			}
		});
		setVictories(victories);
	};

	const getDefeat = (userId: number): void => {
		let defeat: number = 0;
		games.map((game: IGame) => {
			if (game.player1.id === userId) {
				if (game.score1 < game.score2) {
					defeat++;
				}
			}
			if (game.player2.id === userId) {
				if (game.score2 < game.score1) {
					defeat++;
				}
			}
		});
		setDefeat(defeat);
	};

	const getDraw = (userId: number): void => {
		let draws: number = 0;
		games.map((game: IGame) => {
			if (game.player1.id === userId || game.player2.id === userId) {
				if (game.score1 === game.score2) {
					draws++;
				}
			}
		});
		setDraw(draws);
	};

	useEffect(() => {
		getVictories(othUser.id);
		getDefeat(othUser.id);
		getDraw(othUser.id);
	});

	return (
		<div className="otherProfileBody">
			<div className="other-left-side">
				<div className="other-banner">
					<div className="other-options">
						{isBlocked ?
							<></> :
							isFriend ? <button id="other-remove" onClick={() => RemoveFriend(othUser)} /> : <button id="other-add" onClick={() => AddFriend(othUser)} />
						}
						{isBlocked ? <button id="other-unblock" onClick={() => RemoveBlock(othUser)} /> : <button id="other-block" onClick={() => BlockFriend(othUser)} />}
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
							Victories : {victories}
						</div>
						<div className="other-txt">
							Defeats : {defeat}
						</div>
						<div className="other-txt">
							Draw : {draw}
						</div>
						<div className="other-txt">
							{/* Winrate: {othUser.winrate.gamesPlayed === 0 ?
								Math.round((othUser.winrate.victories / othUser.winrate.gamesPlayed) * 100) + '%' : '0%'
							} */}
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