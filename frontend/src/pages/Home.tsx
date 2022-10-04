import { useEffect, useState } from "react"
import axios from 'axios'
import { useCookies } from "react-cookie";
import { Login } from './Login';

export function Home() {

	// interface IUser {
	// 	login: string;
	// 	username: string;
	// 	createdAt: string;
	// }
	const [cookies] = useCookies();

	// const [user, setUser] = useState('{ login: 'username', username: '', createdAt: '' }');
	const [user, setUser] = useState('username');
	const [achievement, setAchievment] = useState('')

	useEffect(() => {
		if (cookies.access_token === 'undefined') {
			setUser('Go check your mails to login.')
			return;
		}
		const config = {
			headers: {
				Authorization: `Bearer ${cookies.access_token}`,
			},
		};
		axios.get('http://localhost:3000/user/me', config)
			.then((res) => {
				setUser(res.data.login);
			});
	}, []);

	useEffect(() => {
		axios.get('http.//localhost:3000/achiv/1')
			.then((res) => { console.log(res.data); setAchievment(res.data); })
	}, []);

	return (
		<div>
			<h1>{user}</h1>
			{/* <h2>{user.username}</h2>
			<h2>{user.createdAt}</h2>
			<h2>{achievement}</h2> */}
		</div>
	)
}