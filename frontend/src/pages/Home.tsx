import { useEffect, useState } from "react"
import axios from 'axios'
import { useCookies } from "react-cookie";

const TOKEN_BRUTE_TEST = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImxvZ2luIjoibWxvcm1vaXMiLCJpYXQiOjE2NjQ4ODQyNDYsImV4cCI6MTY2NDg4NjA0Nn0.za4eziSjsAESlTJIPMlz_4NLSm0PlOIN3Es5XUNw6NE";

export function Home () {
	
	const [ user, setUser ] = useState('username');
	const [cookies, setCookie] = useCookies();

	console.log('===============================');
	console.log(cookies.access_token);
	console.log('===============================');


	
	useEffect( () => {
		const config = {
			headers: {
				Authorization: `Bearer ${cookies.access_token}`,
			},
			// withCredentials: true,
		};
		axios.get('http://localhost:3000/user/me', config)
			.then((res) => { console.log(res.data); setUser(res.data.login); })
	}, []);

	return (
		<div>
			<h1>{ user }</h1>
		</div>
	)
}