import React from "react";
import { AxiosJwt } from "../hooks/AxiosJwt";
import { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'

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
			<h1>{user}</h1>
		</div>
	)
}

