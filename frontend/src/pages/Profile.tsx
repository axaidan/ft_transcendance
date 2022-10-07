import React, { useEffect, useState } from "react";
import { AxiosJwt } from '../hooks/AxiosJwt'
import { useParams } from "react-router";
import { Navbar, Friendsbar } from '../componants'
import { Link, useNavigate, useLocation } from "react-router-dom";
import '../styles/pages/Profile.css'
import { FaBeer } from 'react-icons/fa';

export function Idcard( { userId }: HistoryProps ) {

	const axios = AxiosJwt();
	const [ user, setUsers ] = useState();

	useEffect(() => {
		// axios.get('/user/' + userId)
		// .then((res) => {
		// 	setUsers(res.data)
		// })
	}, [])
	return (
		<div>
			<div className=''>
			</div>
		</div>
	)
}

type IUser = {
	id: number,
	login: string,
}

export function NavOption( { userId }: HistoryProps ) {

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
					<FaBeer />
				</button>
				<button className='btn-block'>
				</button>
			</div>
		</nav>
	)
}


const fewGame = [
	{
		user1: 1,
		user2: 2,
		score1: 6,
		score2: 3,
	},{
		user1: 1,
		user2: 2,
		score1: 6,
		score2: 3,
	},{
		user1: 1,
		user2: 2,
		score1: 6,
		score2: 3,
	},{
		user1: 1,
		user2: 2,
		score1: 6,
		score2: 3,
	}
]

type HistoryProps = {
	userId: number;
}

function History( { userId }: HistoryProps ) {

	const axios = AxiosJwt();
	const navigate = useNavigate();
	const [ games, setGames ] = useState( fewGame );

	useEffect(() => {
		// axios.get("/game/" + userId )
		// .then( (res) => {
		// 	setGames( res.data );
		// })
		// .catch((e) => {
		// 	navigate('/home');
		// })
	}, [])

	return (
		<div className='container-history'>
				{games.map((game: any) => (
					<div key={game.id} className='li-game'>
						<Link to={'/profile/' + game.user1}>
							<div>{game.user1}</div>
						</Link>
						<div>{game.score1}</div>
						<div>{game.score2}</div>
						<Link to={'/profile/' + game.user2}>
							<div>{game.user2}</div>
						</Link>
					</div>
				))}
		</div>
	)
}

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
				<Idcard userId={ userId }/>
				<div className='container-info-profile'>
					<History userId={ userId } />
				</div>
			</div>
		</>
	)
}