import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'

export function Ladder () {

	const navigate = useNavigate();
	const [users, setUsers ] = useState([]);
	const [ cookies ] = useCookies();

	const jwtToken = cookies.access_token;
	const jwtConfig = {
		headers: {
			Authorization: `Bearer ${jwtToken}`,
		}
	}

	useEffect( () => {
		axios.get( 'http://localhost:3000/user/all', jwtConfig)
			.then((res) => setUsers(res.data))
			.catch(() => {
				navigate('/');
			});
	}, []);

	console.log(users)

	return (
		<div>
			<ul>
				{ users.map((user: any) => (
					<Link to={"/profile/" + user.id} >
						<li key={user.id}>{user.login}</li>
					</Link>
				))}
			</ul>
		</div>
	)
}