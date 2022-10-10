// Extern:
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useNavigate, useLocation } from "react-router-dom";

// Intern:
import { AxiosJwt } from '../hooks/AxiosJwt'
import { Navbar, NavOption, History } from '../componants'

// Assets:
import '../styles/pages/Profile.css'
import Friendsbar from '../componants/Friendsbar';

export function Profile() {
	const axios = AxiosJwt();
	const history = useLocation();
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