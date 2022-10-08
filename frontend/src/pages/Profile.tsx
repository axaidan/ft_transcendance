import React, { useEffect, useState } from "react";
import { AxiosJwt } from '../hooks/AxiosJwt'
import { useParams } from "react-router";
import { Navbar, NavOption, History } from '../componants'
import { useNavigate, useLocation } from "react-router-dom";
import '../styles/pages/Profile.css'
import Friendsbar from '../componants/Friendsbar';

export function Profile() {
	const history = useLocation()
	const axios = AxiosJwt();
	const navigate = useNavigate();
	const { id } = useParams<string>();
	const userId = parseInt(id!);

	useEffect(() => {
		axios.get('/user/' + id)
			.then((res) => {
				if (!res.data)
					navigate('/404');
			})
	}, [history]);

	return (
		<>
			<Navbar />
			<Friendsbar />
			<div className='container-profile'>
				<NavOption userId={userId} />
				<div className='container-info-profile'>
					<History userId={userId} />
				</div>
			</div>
		</>
	)
}