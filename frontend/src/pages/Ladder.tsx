import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Link, useNavigate } from "react-router-dom";
import { AxiosJwt } from '../hooks/AxiosJwt'


export function Ladder () {

	const navigate = useNavigate();
	const [users, setUsers ] = useState([]);
	const axios = AxiosJwt();

	useEffect( () => {
		axios.get( '/user/all')
			.then((res) => setUsers(res.data))
			.catch(() => {
				navigate('/');
			});
	}, []);

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