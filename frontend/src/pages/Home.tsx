import React from "react";
import { useEffect, useState } from "react"
import axios from 'axios'
import { useCookies } from "react-cookie";
import { useNavigate } from 'react-router-dom'

export function Home () {

	const navigate = useNavigate();
	const [ cookies ] = useCookies();
	const [ user, setUser ] = useState('username');
	
	useEffect( () => {
		const API_URL = "http://localhost:3000"
		const jwtToken = cookies.access_token;
		const jwtConfig = {
			headers: {
				Authorization: `Bearer ${jwtToken}`,
			}
		}
		axios.get(API_URL + "/user/me", jwtConfig)
		.then((res) => {
			setUser (res.data.login);
		})
		.catch(() => {
			navigate('/');
		});
	}, []);


	return (
		<div>
			<h1>{ user }</h1>
		</div>
	)
}

