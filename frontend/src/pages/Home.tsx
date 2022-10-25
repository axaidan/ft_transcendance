// Extern:
import React from "react";
import { useNavigate, Outlet } from 'react-router-dom'

// Intern:
import { Friendsbar, Navbar } from '../components'
import { IUser } from "../types";

// Assets:
import '../styles/pages/Home.css'
import bg_website from '../assets/videos/bg_website.webm'
import { useAxios } from "../hooks/useAxios";
import SocketContextComponent from "../context/UserSocket/Components";
import { ChatSocketContextComponent } from "../context";

function LoadingHome() {
	return (
		<div>
			<video src={bg_website} autoPlay loop muted className='bg_video' />
		</div>
	)
}

export function Home() {
	const navigate = useNavigate();
	const [loading, user, error] = useAxios<IUser>({ method: 'GET', url: '/user/me'});

	if (loading) return <LoadingHome />
	if (error !== '') return navigate('/');
	if (!user) return navigate('/');
	
	console.log("USER: " , user)

	return (
		<SocketContextComponent user={user}>
			<ChatSocketContextComponent user={user}>
				<Navbar me={user} />
				<div className='container-body'>
					<video src={bg_website} playsInline autoPlay loop muted className='bg_video' />
					<Outlet />
				</div>
				<Friendsbar />
			</ChatSocketContextComponent>
		</SocketContextComponent>
	)
}