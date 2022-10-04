import { useEffect, useState } from "react"
import axios from 'axios'
import { Login } from './Login';

export function Home() {

	interface IUser {
		login: string;
		username: string;
		createdAt: string;
	}

	const [user, setUser] = useState({ login: 'username', username: '', createdAt: '' });
	const [achievement, setAchievment] = useState('')

	useEffect(() => {
		axios.get('http://localhost:3000/user/1')
			.then((res) => { console.log(res.data); setUser(res.data); })
	}, []);

	useEffect(() => {
		axios.get('http.//localhost:3000/achiv/1')
			.then((res) => { console.log(res.data); setAchievment(res.data); })
	}, []);

	return (
		<div>
			<h1>{user.login}</h1>
			<h2>{user.username}</h2>
			<h2>{user.createdAt}</h2>
			<h2>{achievement}</h2>
		</div>
	)
}