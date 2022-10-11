import React, { useEffect, useState } from "react";
import { AxiosJwt } from '../../hooks/AxiosJwt'
import { useLocation } from "react-router-dom";

type NavOptionProps = {
	userId: number;
}

export function NavOption( { userId }: NavOptionProps ) {
	const [ user, setUsers ] = useState({ id: 0, login: 'username', username: 'test', createdAt: '' });
	// const [response, setResponse] = useState(null);
    const history = useLocation()
	const axios = AxiosJwt();

	useEffect(() => {
		axios.get('/user/' + userId )
		.then((res) => {
			setUsers(res.data)
		})
	}, [history])

	function AddFriend( cibleId: number) {
		axios.post('/relation/add_friend/' + cibleId)
		// .then((res) => { setResponse(res.data); })
		// .catch((e) => { setResponse(e); })
	}

	function RemoveFriend( cibleId: number) {
		axios.post('/relation/remove_friend/' + cibleId)
		// .then((res) => { setResponse(res.data); })
		// .catch((e) => { setResponse(e); })
	}

	function AddBlock( cibleId: number) {
		axios.post('/relation/add_block/' + cibleId)
		// .then((res) => { setResponse(res.data); })
		// .catch((e) => { setResponse(e); })
	}

	function RemoveBlock( cibleId: number) {
		axios.post('/relation/remove_block/' + cibleId)
		// .then((res) => { setResponse(res.data); })
		// .catch((e) => { setResponse(e); })
	}

	return (
		<nav className='container-nav-option'>
			<div>
				<p>{user.login}, {user.id}, {user.username}</p>
			</div>
			<div>
				<button className='btn-friend' onClick={ () => AddFriend( user.id ) } >f+</button>
				<button className='btn-block' onClick={ () => RemoveFriend( user.id )} >f-</button>
				<button className='btn-friend' onClick={ () => AddBlock( user.id ) } >b+</button>
				<button className='btn-block' onClick={ () => RemoveBlock( user.id )} >b-</button>
			</div>
		</nav>
	)
}