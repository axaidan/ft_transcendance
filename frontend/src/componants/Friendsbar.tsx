import React from 'react';
import '../styles/components/Friendsbar.css';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios'
import { AxiosJwt } from "../hooks/AxiosJwt";

const Friendsbar = () => {

	const [user, setUser] = useState('username');
	const [avatar, setAvatar] = useState('');
	const request = AxiosJwt();

	useEffect(() => {
		request.get("/user/me")
			.then((res) => {
				setUser(res.data.login);
			})
	}, []);

	return (
		<nav className='Friendsbar'>
			<ul>
				<div className='user_info'>
					{user}
				</div>
				<div className='friends_list'>
					You don't have friends yet
				</div>
			</ul>
		</nav>
	);
};

export default Friendsbar;