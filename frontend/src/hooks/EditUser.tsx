import { AxiosJwt } from './AxiosJwt';
import { useEffect } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';




export const updateUser = () => {
	const [cookies] = useCookies();
	const jwtToken = cookies.access_token;
	useEffect(() => {
		axios.patch('http://localhost:3000/user/',
			{ email: 'yo@gmail.com', username: 'victor', twoFactorAuth: false },
			{
				headers: {
					Authorization: jwtToken ? `Bearer ${jwtToken}` : '',
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
			},
		).catch((error) => {
			if (axios.isAxiosError(error)) {
				return error.message;
			} else {
				return 'An unexpected error occurred';
			}
		})
	}, []);
}