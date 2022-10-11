// Extern:
import React from "react";
import { useNavigate, Outlet } from 'react-router-dom'
import { useEffect, useState } from "react"
import { AxiosResponse } from "axios";

// Intern:
import { Friendsbar, Navbar } from '../componants'
import { AxiosJwt } from "../hooks/AxiosJwt";
import { IUser, DflUser } from "../types";

// Assets:
import '../styles/pages/Home.css'

export function Home() {
	const navigate = useNavigate();
	const [user, setUser] = useState<IUser>(DflUser);
	const [userId, setUserId] = useState<number>(0)
	const axios = AxiosJwt();

	useEffect(() => {
		axios.get("/user/me")
			.then((res: AxiosResponse<IUser>) => {
				setUser(res.data);
				setUserId(res.data.id);
			})
			.catch(() => { navigate('/'); });
	}, []);

	return (
		<div>
			<Navbar me={user} />

			{/* 	WALTER:
				Ici tu doit t'arranger pour que
				Friendsbar ne soit pas en fix
				mais partage le body avec Outlet 
			*/}

			<div className='container-body'>
				<Outlet context={user} />
				<Friendsbar userId={userId} />
			</div>
		</div>
	)
}

/*		<Outlet />
	Grace a Outlet Navbar et Friendsbar 
	on leurs places uniquement dans ce fichier!
	TOUT le reste des componant ( sauf exeption css )
	ce situe dans cette Outlet! 
*/

/*		useContext()
	Dans l'Outlet je te donne en context l'user current
	donc nous n'avons plus a faire la requete pour savoir
	a qui est la session. juste recuper l'user grace a:
	useContext().
*/
