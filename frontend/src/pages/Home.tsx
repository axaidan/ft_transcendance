import React from "react";
import { AxiosJwt } from "../hooks/AxiosJwt";
import { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'
import Friendsbar from "../componants/Friendsbar";
import bg_website from '../assets/videos/bg_website.webm'
import '../styles/pages/Home.css'
// import { Navbar2 } from '../componants/Navbar2';
import { Navbar } from "../componants";

export function Home() {
	const navigate = useNavigate();
	const [user, setUser] = useState('username');
	const request = AxiosJwt();

	useEffect(() => {
		request.get("/user/me")
			.then((res) => {
				setUser(res.data.login);
			})
			.catch(() => {
				navigate('/');
			});
	}, []);

	return (
		<div >
			<Navbar />
			<Friendsbar />
			<video src={bg_website} autoPlay loop muted className='bg_video' />
			<div className='container-home'>
			</div>
		</div>
	)
}

