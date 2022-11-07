// Extern:
import React, { SyntheticEvent, useContext, useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";

// Intern:
import { IUser } from "../types";

// Assets:
import '../styles/pages/Profile.css'
import { AxiosJwt } from '../hooks/AxiosJwt';
import axios from "axios";
import { useCookies } from 'react-cookie';
import { updateUser } from "../hooks";
import { useForm } from '../hooks/UseForm';
import { IAvatar } from '../types/interfaces/IAvatar';
import { SocketContext } from "../context";

type State = {
	newUsername: string;
};

export function Profile() {

	const { me } = useContext(SocketContext).SocketState;

	const [avatar, setAvatar] = useState('');
	const [toggleEdit, setToggleEdit] = useState(false);
	const axios = AxiosJwt();

	const [cookies] = useCookies();
	const jwtToken = cookies.access_token;
	const [username, setUsername] = useState([user.username]);


	const editUser = () => {
		axios.patch('/user',
			values,
			{
				headers: {
					Authorization: jwtToken ? `Bearer ${jwtToken}` : '',
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
			},
		).catch(function (error) {
			if (error.response || error.request) {
				console.log('this nickname is already taken');
				return;
			}
			return;
		})
		toggleUserEdit();
		location.reload();
	}

	const toggleUserEdit = () => {
		setToggleEdit(!toggleEdit);
	}

	const initialState = {
		username: ''
	};

	const { onChange, onSubmit, values } = useForm(
		editUser,
		initialState
	)

	useEffect(() => {
		axios.get('/avatar/list').then((res) => setAvatar(res.data));
	}, []);

	const avatar_link = (avatar: IAvatar): string => {
		return avatar.url;
	}

	return (
		<div className="user_body" >
			<div className="left_side">
				<div className="banner">
					<div className="user_nickname">
						<div className={toggleEdit ? "disabled" : "user-nick"}>
							{user.username}
							<button onClick={toggleUserEdit} className={toggleEdit === true ? "edit-up" : "no-edit"}>
							</button>
						</div>
						<form onSubmit={onSubmit}>
							<input className={toggleEdit ? "edit-input" : "disabled"} placeholder={user.username} onChange={onChange} name="username" />
							<button onClick={editUser} className={toggleEdit ? "validate-edit" : "disabled"}>
								Validate
							</button>
						</form>
					</div>
					<div className="clan">
						My clan
					</div>
					<div className="xp_bar"></div>
					<div className="xp_fill"></div>
					<div className="xp_nbr"></div>
					<div className="xp_value">
						25
					</div>
					<div className="profile-icon-div">

						<img src={user.avatarUrl} id="profile_icon" />
					</div>
					<div className="end-of-banner">
					</div>
				</div>
				<div className="loot">
					<div className="coffer">
						0
					</div>
					<div className="boost">
						0
					</div>
					<div className="reroll">
						0
					</div>
				</div>
			</div>
			<div className="stats">
				<div className="empty-space">
				</div>
				<div className="lol-stats">
					<div className="rank">
						<h3>Rank</h3>
						<div className="txt">
							unranked
						</div>
					</div>
					<div className="honor">
						<h3>Honor</h3>
						<div className="txt">
							none
						</div>
					</div>
					<div className="champion">
						<h3>Victories</h3>
						<div className="txt">
							No game yet
						</div>
					</div>
					<div className="trophee">
						<h3>Trophee</h3>
						<div className="txt">
							none
						</div>
					</div>
					<div className="clash">
						<div id='stats-column'>
							<h3>Banner</h3>
							<div className="txt">
								none
							</div>
						</div>
					</div>
				</div>
			</div>
		</div >
	);
}