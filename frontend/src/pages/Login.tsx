import axios from 'axios'
import { useEffect } from 'react';
import { Navbar } from '../componants'
import Friendsbar from '../componants/Friendsbar';

export function Login() {

	return (
		<>
			<Navbar />
			<Friendsbar />
			<h1>SUCCESS</h1>
			<h1>salut</h1>
		</>
	)
}