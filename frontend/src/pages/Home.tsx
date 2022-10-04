import { useEffect, useState } from "react"
import axios from 'axios'
import { useCookies } from "react-cookie";

export function Home () {
	
	const [ user, setUser ] = useState('username');
	const [ cookies ] = useCookies();
	
	useEffect( () => {
		if (cookies.access_token === 'undefined') {
			setUser('Go check your mails to login.')
			return ;
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

	return (
		<div>
			<h1>{ user }</h1>
		</div>
	)
}