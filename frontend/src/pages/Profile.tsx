// Extern:
import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

// Intern:
import { IUser } from "../types";

// Assets:
import '../styles/pages/Profile.css'
import { AxiosJwt } from '../hooks/AxiosJwt';

export function Profile() {

	const axios = AxiosJwt();
	let user: IUser = useOutletContext();
	const [avatar, setAvatar] = useState('');
	const [toggleEdit, setToggleEdit] = useState(false);


	const toggleUserEdit = () => {
		setToggleEdit(!toggleEdit);
	}


	const onChange = () => {
		const newUsername = {
			username: 'test',
		};

		useEffect(() => {
			axios.patch('/user/', newUsername);
		})
		toggleUserEdit();
	}

	return (
		<div className="user_body">
			<div className="left_side">
				<div className="banner">
					<div className="user_nickname">
						<input className={toggleEdit ? "edit-input" : "disabled"} placeholder={user.username} />
						<div className={toggleEdit ? "disabled" : "user-nick"}>
							{user.username}
						</div>
						<button onClick={onChange} className={toggleEdit ? "validate-edit" : "disabled"}>
							Validate
						</button>
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

		</div>
	);
}