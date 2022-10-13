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

	return (
		<div className="user_body">
			<div className="left_side">
				<div className="banner">
					<div className="user_nickname">
						{user.username}
					</div>
					<div className="clan">
						My clan
					</div>
					<div className="xp_bar">
						<div className="xp_fill">
							<div className="xp_nbr">
								<div className="xp_value">
									25
								</div>
							</div>
						</div>
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