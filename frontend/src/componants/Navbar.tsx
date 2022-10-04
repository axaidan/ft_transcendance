import React from "react";
import { Link, NavLink } from "react-router-dom";
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

	return (
		<nav>
			{(toggleMenu || largeur > 700) && (

				<ul className="liste">
					<li className="items">Play</li>
					<li className="items">Home</li>
					<li className="items">User</li>
					<li className="items">Friends</li>
					<li className="items">Channels</li>
					<li className="items">Store</li>
				</ul>

			)}
			<button onClick={toggleNavResponsive} className="btn">BTN</button>
		</nav>
	);
}