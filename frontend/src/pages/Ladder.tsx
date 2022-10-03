import { useEffect, useState } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";

const APIURL = 'http://localhost:3000'

export function Ladder () {
	const [users, setUsers ] = useState([]);

	useEffect( () => {
		axios.get( 'http://localhost:3000/user/all' )
			.then((res) => setUsers(res.data))
			.catch((error) => console.error(error));
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