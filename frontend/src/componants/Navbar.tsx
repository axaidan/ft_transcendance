import React, { useCallback } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import '../styles/components/Navbar.css';
import { FaUserCircle, FaHome, FaComments, FaStore } from 'react-icons/fa';
import { useState } from 'react';
import { useEffect } from 'react';

export function Navbar() {

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

	// const navLinkStyle = ({ isActive }: boolean) => {
	// 	return isActive ? 'active' : 'links';
	// }


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
						<NavLink to='/' className='links'>
							User
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
						<li className="items">
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