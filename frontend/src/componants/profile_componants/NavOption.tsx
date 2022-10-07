import React, { useEffect, useState } from "react";
import { AxiosJwt } from '../../hooks/AxiosJwt'
import { useNavigate, useLocation } from "react-router-dom";

type NavOptionProps = {
	userId: number;
}

export function NavOption( { userId }: NavOptionProps ) {

    const history = useLocation()
	const axios = AxiosJwt();
	const [ user, setUsers ] = useState({ id: 0, login: 'username', username: 'test', createdAt: '' });

	console.log(userId.toString())

	useEffect(() => {

		const path = '/user/' + userId ;
		console.log(path)
		axios.get(path)
		.then((res) => {
			setUsers(res.data)
		})
	}, [history])

	return (
		<nav className='container-nav-option'>
			<div>
				<p>{user.login}, {user.id}, {user.username}</p>
			</div>
			<div>
				
				<button className='btn-friend'>
				</button>
				<button className='btn-block'>
				</button>
			</div>
		</nav>
	)
}