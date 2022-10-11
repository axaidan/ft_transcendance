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
import { Navbar2 } from '../componants/Navbar2';
import bg_website from '../assets/videos/bg_website.webm'

export function Home() {
	const navigate = useNavigate();
	const [user, setUser] = useState<IUser>(DflUser);
	const axios = AxiosJwt();

	useEffect(() => {
		axios.get("/user/me")
			.then((res: AxiosResponse<IUser>) => {
				setUser(res.data);
			})
			.catch(() => { navigate('/'); });
	}, []);

	return (
		<div>
			<Navbar2 me={user} />

			{/* 	WALTER:
				Ici tu doit t'arranger pour que
				Friendsbar ne soit pas en fix
				mais partage le body avec Outlet 
			*/}

			<div className='container-body'>
				<video src={bg_website} autoPlay loop muted className='bg_video' />
				<Outlet context={user} />
				<Friendsbar userId={user.id} />
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
