import axios from 'axios'
import { useEffect } from 'react';

const test = async () => {

	

	await axios.get("http://localhost:3000/auth/signin")
	.then( res => {
		console.log(res);
		return (res);
	})
	.catch( e => {
		console.log(e);
		return (e);
	})
}

export function Login () {

	useEffect( () => {
		test();
	}, []);

	return (
		<>
			<h1>SUCCESS</h1>
			<h1>salut</h1>
		</>
	)
}