import { useEffect, useState } from "react"
import axios from 'axios'

export function Home () {
	
	const [ user, setUser ] = useState('username');

	useEffect( () => {
		axios.get('http://localhost:3000/user/1')
			.then((res) => { console.log(res.data); setUser(res.data.login); })
	}, []);

	return (
		<div>
			<h1>{ user }</h1>
		</div>
	)
}