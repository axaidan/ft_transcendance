import React from "react";
import { NavLink } from "react-router-dom";
import '../styles/components/Navbar.css';
import { useState, useEffect } from 'react';
import { AxiosJwt } from "../hooks";
import { Setting } from "./profile_componants/Setting";

export function Navbar() {

	const axios = AxiosJwt();

	interface IUser {
		login: string;
		username: string;
		createdAt: string;
	}

	const [user, setUser] = useState({ login: 'username', username: 'test', createdAt: '' });
	const [achievement, setAchievment] = useState('')

	console.log(user);

	useEffect(() => {
		axios.get('/user/me')
			.then((res) => {
				setUser(res.data);
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


	const [isShown, setIsShown] = useState(false);

	const handleClick = () => {
		setIsShown(true);
	};

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
						<NavLink to='/home' className='links'>
							Home
						</NavLink>
					</li>
					<li className="items">
						<NavLink to={'/profile/1' } className='links'>
							{user.login}
						</NavLink>
					</li>
					<div className="items_r">
						<li className="items">
							<NavLink to='/home' className='links'>
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
						{/* <li className="items" >
     						<button onClick={handleClick}>Click</button>
							{ isShown && <Setting /> }
						</li> */}
					</div>
				</ul >
			)
			}
			<button onClick={toggleNavResponsive} className="btn">BTN</button>
		</nav >
	);
}