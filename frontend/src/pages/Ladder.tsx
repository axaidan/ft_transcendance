import { useEffect, useState } from "react";
import axios from 'axios';



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
				{/* { users.map((user: any, index) => (
					<li key={index}>{user.translations.fra.common}</li>
				))} */}
			</ul>
		</div>
	)
}