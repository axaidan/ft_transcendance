import React from "react";
import { NavLink } from "react-router-dom";
import '../styles/components/Navbar.css';
import { useState, useEffect } from 'react';
import { AxiosJwt } from "../hooks";
import { IUser } from "../types";
import { isConstructorDeclaration } from "typescript";

type NavProps = {
	me: IUser;
}

export function Navbar({ me }:NavProps ) {

	const axios = AxiosJwt();
	const [achievement, setAchievment] = useState('');

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
						<NavLink to='/home' className='links'>
							Home
						</NavLink>
					</li>
					<li className="items">
						<NavLink to={'/home/me' } className='links'>
							{me.login}
						</NavLink>
					</li>
					<div className="items_r">
						<li className="items">
							<NavLink to='/home/ladder' className='links'>
								Ladder
							</NavLink>
						</li>
						{/* <li className="items">
							<NavLink to='/' className='links'>
								Channels
							</NavLink>
						</li>
						<li className="items" >
							<NavLink to='/' className='links'>
								Ladder
							</NavLink>
						</li> */}
					</div>
				</ul >

			)
			}
			<button onClick={toggleNavResponsive} className="btn">BTN</button>
		</nav >
	);
}