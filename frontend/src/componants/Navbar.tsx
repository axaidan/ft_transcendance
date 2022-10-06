import React, { useCallback } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import '../styles/components/Navbar.css';
import { FaUserCircle, FaHome, FaComments, FaStore } from 'react-icons/fa';
import { useState } from 'react';
import { useEffect } from 'react';
import { useCookies } from "react-cookie";
import axios from 'axios'

export function Navbar() {

	interface IUser {
		login: string;
		username: string;
		createdAt: string;
	}

	const [cookies] = useCookies();


	const [user, setUser] = useState({ login: 'username', username: 'test', createdAt: '' });
	const [achievement, setAchievment] = useState('')

	useEffect(() => {
		if (cookies.access_token === 'undefined') {
			setUser({ login: 'Go check your mails to login.', username: 'default', createdAt: '' })
			return;
		}
		const config = {
			headers: {
				Authorization: `Bearer ${cookies.access_token}`,
			},
		};
		axios.get('http://localhost:3000/user/me', config)
			.then((res) => {
				setUser(res.data.login);
			});
	}, []);

	const [toggleMenu, setToggleMenu] = useState(false);
	const [largeur, setLargeur] = useState(window.innerWidth);

	const toggleNavResponsive = () => {
		setToggleMenu(!toggleMenu);
	}

	useEffect(() => {

		const changeWidth = () => {
			setLargeur(window.innerWidth);
			if (window.innerWidth > 700) {
				setToggleMenu(false);
			}
		}

		window.addEventListener('resize', changeWidth);
		return () => {
			window.removeEventListener('resize', changeWidth);
		}
	}, [])



	return (
		<nav className="navbar">
			{(toggleMenu || largeur > 700) && (

				<ul className="liste">
					<li className="items">
						<NavLink to='/game' className="play">
							<span></span>
							<span></span>
							<span></span>
							<span></span>
							Play
						</NavLink>
					</li>
					<li className="items">
						<NavLink to='/' className='links'>
							Home
						</NavLink>
					</li>
					<li className="items">
						<NavLink to='/profile/:id' className='links'>
							{user.login}
						</NavLink>
					</li>
					<div className="items_r">
						<li className="items">
							<NavLink to='/' className='links'>
								Friends
							</NavLink>
						</li>
						<li className="items">
							<NavLink to='/' className='links'>
								Channels
							</NavLink>
						</li>
						<li className="items" >
							<NavLink to='/' className='links'>
								Store
							</NavLink>
						</li>
					</div>
				</ul >

			)
			}
			<button onClick={toggleNavResponsive} className="btn">BTN</button>
		</nav >
	);
}