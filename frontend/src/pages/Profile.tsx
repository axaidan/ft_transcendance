// Extern:
import React, { SyntheticEvent, useEffect, useState } from "react";
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

// function updateUser() {
// 	useEffect(() => {
// 		axios.patch<UpdateUserResponse>('http://localhost:3000/user/',
// 			{ username: 'victor' },
// 			{
// 				headers: {
// 					Authorization: jwtToken ? `Bearer ${jwtToken}` : '',
// 					'Content-Type': 'application/json',
// 					Accept: 'application/json',
// 				},
// 			},
// 		).catch((error) => {
// 			if (axios.isAxiosError(error)) {
// 				console.log('error message: ', error.message);
// 				return error.message;
// 			} else {
// 				console.log('unexpected error: ', error);
// 				return 'An unexpected error occurred';
// 			}
// 		})
// 	}, []);
// }

type State = {
	newUsername: string;
};

export function Profile() {

	let user: IUser = useOutletContext();
	const [avatar, setAvatar] = useState('');
	const [toggleEdit, setToggleEdit] = useState(false);
	const axios = AxiosJwt();

	const [cookies] = useCookies();
	const jwtToken = cookies.access_token;

	const editUser = () => {
		console.log(values);
		console.log(initialState);
		axios.patch('/user',
			{ username: 'Anne-France' },
			{
				headers: {
					Authorization: jwtToken ? `Bearer ${jwtToken}` : '',
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
			},
		)
		toggleUserEdit();
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

	return (
		<div className="user_body" >
			<div className="left_side">
				<div className="banner">
					<div className="user_nickname">
						<div className={toggleEdit ? "disabled" : "user-nick"}>
							{user.username}
						</div>
						<form onSubmit={onSubmit}>
							<input className={toggleEdit ? "edit-input" : "disabled"} placeholder={user.username} onChange={onChange} />
							<button onClick={editUser} className={toggleEdit ? "validate-edit" : "disabled"}>
								Validate
							</button>
						</form>
						<button onClick={toggleUserEdit} className={toggleEdit === true ? "edit-up" : "no-edit"}>
						</button>
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
						<img src='https://2.bp.blogspot.com/-sT67LUsB61k/Ul7ocxgFhTI/AAAAAAAACdc/iAQ2LgxMvG4/s1600/image+115.jpg' id="profile_icon" />
					</div>
					<div className="end-of-banner">
					</div>
				</div>
				<div className="loot">
					<div className="coffer">
						coffre
					</div>
					<div className="boost">
						boost
					</div>
					<div className="reroll">
						reroll
					</div>
				</div>
			</div>
			<div className="stats">
				<div className="rank">
					bronze
				</div>
				<div className="honor">
					none
				</div>
				<div className="champion">
					morgana
				</div>
				<div className="trophee">
					no trophee
				</div>
				<div className="clash">
					no clash yet
				</div>
			</div>
		</div >
	);
}