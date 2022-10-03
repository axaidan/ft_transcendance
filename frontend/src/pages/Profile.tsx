import React, { useEffect, useState } from "react";
import axios from 'axios';
import './Profile.css';
import { useParams } from "react-router";

export function Idcard () {
	return (
		<div>
			<div className='photo'>
				<img alt='0' src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/42_Logo.svg/2048px-42_Logo.svg.png"/>
			</div>
		</div>
	)
}

export function Profile () {

	const [ user, setUser ] = useState('username');
	const { id } = useParams();

	console.log(id);

	useEffect( () => {
		axios.get('http://localhost:3000/user/' + id)
			.then((res) => setUser(res.data.login))
	}, []);

	return (
		<div className='profile'>
			<Idcard />
			<div>{user}</div>
		</div>
	)
}