// Extern:
import { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Outlet, Link } from "react-router-dom";
import { NavOption } from '.';

// Intern:
import { AxiosJwt } from '../../hooks/AxiosJwt'
import { DflUser, IUser } from "../../types";

export function OthNavProfile() {
	const axios = AxiosJwt();
	const { id } = useParams();
	const [ othUser, setOthUser ] = useState<IUser>(DflUser);

	useEffect(() => {
		axios.get("/user/" + id)
		.then((res: AxiosResponse<IUser>) => { setOthUser(res.data) })
		.catch(() => { /* GO TO User NotFound Component */ });
	}, [id]);

	return (
		<div>
			<nav>
				<Link to={'/home/' + id }><button>Profile</button></Link>
				<Link to={'/home/' + id + '/history'} ><button>Historique</button></Link>
				<Link to={'/home/' + id + '/achievement'} ><button>Achievements</button></Link>
				<NavOption userId={ parseInt(id!) }/>
			</nav>
			<Outlet context={othUser} />
		</div>
	)
}