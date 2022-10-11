// Extern:
import React from "react";
import { useNavigate, Outlet } from 'react-router-dom'
import { useEffect, useState } from "react"
import { AxiosResponse } from "axios";

// Intern:
import { Friendsbar, Navbar } from '../componants'
import { AxiosJwt } from "../hooks/AxiosJwt";
import { IUser, DflUser } from "../types";
import io, { Socket } from 'socket.io-client';
import { useCookies } from "react-cookie";

// Assets:
import '../styles/pages/Home.css'

export function Home() {
	const navigate = useNavigate();
	const [user, setUser] = useState<IUser>(DflUser);
	const [userId, setUserId] = useState<number>(0)
	const [ cookies ] = useCookies();
	const [socket, setSocket] = useState<Socket>();
	
	const axios = AxiosJwt();
	const jwtToken = cookies.access_token;
	


	useEffect(() => {
		axios.get("/user/me")
		.then((res: AxiosResponse<IUser>) => {
			setUser(res.data);
			setUserId(res.data.id);
		 })
		.catch(() => { navigate('/'); });
	}, []);

	useEffect(() => {
		const newSocket = io(`http://localhost:3000`, { extraHeaders: 
		{ Authorization: `Bearer ${jwtToken}` }});
		newSocket.emit('loginToServer', user.id);
		setSocket(newSocket);
	}, [setSocket]);

	return (
		<div>
			{ socket ? <div>U ARE CONNECTED</div> : <></>}
			<Navbar me={user} />

			{/* 	WALTER:
				Ici tu doit t'arranger pour que
				Friendsbar ne soit pas en fix
				mais partage le body avec Outlet 
			*/}

			<div className='container-body'>
				<Outlet context={ user } />
				<Friendsbar userId={userId} socket={socket!}/>
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
