import React, { useEffect, useState } from "react";
import { AxiosJwt } from '../hooks/AxiosJwt'
import { useParams } from "react-router";
import { Navbar, Friendsbar, NavOption, History } from '../componants'
import { useNavigate, useLocation } from "react-router-dom";
import '../styles/pages/Profile.css'

export function Profile() {
    const history = useLocation()
	const axios = AxiosJwt();
	const navigate = useNavigate();
	const { id } = useParams<string>();
	const userId = parseInt(id!);

	useEffect(() => {
		axios.get('/user/' + id)
		.catch(() => { navigate('/home'); });
	}, [history]);

	return (
		<>
			<Navbar />
			<Friendsbar />
			<div className='container-profile'>
				<NavOption userId={ userId }/>
				<div className='container-info-profile'>
					<History userId={ userId } />
				</div>
			</div>
		</>
	)
}