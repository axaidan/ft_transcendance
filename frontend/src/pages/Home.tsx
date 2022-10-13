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


const GetCookie = () => {
	const [ cookies ] = useCookies();
	return cookies.access_token;
}

const GetSocket = ( userId: number ) => {
	const newSocket = io(`http://localhost:3000`, 
	{ extraHeaders: 
		{ Authorization: `Bearer ${GetCookie}` }
	});
	newSocket.emit('loginToServer', userId);

	const chatSocket = io(`http://localhost:3000/chatNs`, 
	{ extraHeaders: 
		{ Authorization: `Bearer ${GetCookie}` }
	});
	chatSocket.emit('loginToServer', userId);

	// newSocket.on("disconnect", () => {
	// 	newSocket.emit('logoutToServer', userId);
	// });

	return (newSocket);
}

export function Home() {
	const navigate = useNavigate();
	const [user, setUser] = useState<IUser>(DflUser);
	const [socket, setSocket] = useState<Socket>();

	const axios = AxiosJwt();
	
	useEffect(() => {
		axios.get("/user/me")
		.then((res: AxiosResponse<IUser>) => {
			setUser(res.data);
			setSocket(GetSocket(res.data.id));
		 })
		.catch(() => { navigate('/'); });
	}, []);

	return (
		<div>
			<Navbar me={user} />
			<div className='container-body'>
				<Outlet context={ user } />
				<Friendsbar userId={user.id} socket={socket!}/>
			</div>
		</div>
	)
}