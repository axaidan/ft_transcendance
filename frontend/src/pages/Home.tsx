import React from "react";
import { AxiosJwt } from "../hooks/AxiosJwt";
import { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'
import { Navbar, Friendsbar } from '../componants'

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
		<div>
			<Navbar />
			<Friendsbar />
			<h1>{user}</h1>
		</div>
	)
}

