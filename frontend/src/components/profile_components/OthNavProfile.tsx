// Extern:
import { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Outlet, Link } from "react-router-dom";
import { NavOption } from '.';

// Intern:
import { AxiosJwt } from '../../hooks/AxiosJwt'
import { DflUser, IUser } from "../../types";

import "../../styles/components/profile_components/OthNavProfile.css"

export function OthNavProfile() {
	const axios = AxiosJwt();
	const { id } = useParams();
	const [othUser, setOthUser] = useState<IUser>(DflUser);

	useEffect(() => {
		axios.get("/user/" + id)
			.then((res: AxiosResponse<IUser>) => { setOthUser(res.data) })
			.catch(() => { /* GO TO User NotFound Component */ });
	}, [id]);

	return (
		<div className="user-body" >
			<div className='othNavProfile-container'>
				<div className='othNavProfile-title-ctn'>
					<p id='othNavProfile-title'>{othUser.username}</p>
				</div>
				<nav>
					<Link to={'/home/' + id}><button>Profile</button></Link>
					<Link to={'/home/' + id + '/history'} ><button>Historique</button></Link>
					<Link to={'/home/' + id + '/achievement'} ><button>Achievements</button></Link>
					{/* <NavOption userId={ parseInt(id!) }/> */}
				</nav>

				<div className="user-left-side">
					<div className="user-banner">
						<div className="user-nickname">
							{othUser.username}
						</div>
					</div>
					<div className="user-clan">
						My clan
					</div>
					<div className="user-xp-bar"></div>
					<div className="user-xp-fill"></div>
					<div className="user-xp-nbr"></div>
					<div className="user-xp-value">
						25
					</div>
					<div className="user-profile-icon-div">

						<img src={othUser.avatarUrl} id="user-profile-icon" />
					</div>
					<div className="user-end-of-banner">
					</div>
				</div>
				<div className="user-loot">
					<div className="user-coffer">
						0
					</div>
					<div className="user-boost">
						0
					</div>
					<div className="user-reroll">
						0
					</div>
				</div>
			</div>
			<div className="user-stats">
				<div className="user-setting">
				</div>
				<div className="user-lol-stats">
					<div className="user-rank">
						<h3>Rank</h3>
						<div className="user-txt">
							unranked
						</div>
					</div>
					<div className="user-honor">
						<h3>Honor</h3>
						<div className="user-txt">
							none
						</div>
					</div>
					<div className="user-champion">
						<h3>Victories</h3>
						<div className="user-txt">
							No game yet
						</div>
					</div>
					<div className="user-trophee">
						<h3>Trophee</h3>
						<div className="user-txt">
							none
						</div>
					</div>
					<div className="user-clash">
						<div id='user-stats-column'>
							<h3>Banner</h3>
							<div className="user-txt">
								none
							</div>
						</div>
					</div>
				</div>
			</div>
		</div >
	)
}