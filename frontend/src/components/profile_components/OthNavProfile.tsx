// Extern:
import { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';

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
			.catch((e) => { alert(e + 'This user does not exist.'); useNavigate() });
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
				</div>
			</div>
			<Outlet context={othUser} />
		</div >
	)
}