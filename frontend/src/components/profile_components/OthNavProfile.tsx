// Extern:
import { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Outlet, Link, NavLink } from 'react-router-dom';
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
		<div className="other-body" >
			<div className='othNavProfile-container'>
				<p id='othNavProfile-title'>{othUser.username}</p>
				<div className="othNavLinks">
					<NavLink to={'/home/' + id} className='other-navlinks'>
						Profile
					</NavLink>
					<NavLink to={'/home/' + id + '/history'} className='other-navlinks'>
						Historique
					</NavLink>
					<NavLink to={'/home/' + id + '/achievement'} className='other-navlinks'>
						Achievements
					</NavLink>
				</div>
			</div>
			<div className="otherProfileBody">
				<div className="other-left-side">
					<div className="other-banner">
						<div className="other-options">
							<button>Add</button>
							<button>Remove</button>
							<button>Block</button>
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
			</div>
		</div >
	)
}