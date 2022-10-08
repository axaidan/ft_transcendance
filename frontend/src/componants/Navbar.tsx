import React, { useCallback } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import '../styles/components/Navbar.css';
import { FaUserCircle, FaHome, FaComments, FaStore } from 'react-icons/fa';
import { useState } from 'react';
import { useEffect } from 'react';
import { useCookies } from "react-cookie";
import axios from 'axios'
import { AxiosJwt } from "../hooks/AxiosJwt";

export function Navbar() {

	interface IUser {
		login: string;
		username: string;
		createdAt: string;
	}

	const [user, setUser] = useState('username');
	const request = AxiosJwt();

	useEffect(() => {
		request.get("/user/me")
			.then((res) => {
				setUser(res.data.username);
			})
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
						<NavLink to='/home' className='links'>
							Home
						</NavLink>
					</li>
					<li className="items">
						<NavLink to='/profile/:id' className='links'>
							profile
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
					<div className="user_log">
						<div className="avatar">
							<img className="picture" src='https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/88c6ac91-e30a-4c67-a92d-e8178abac9bd/devdlvv-6a12f604-4c12-4b6a-9fc3-b70090b6bdd3.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzg4YzZhYzkxLWUzMGEtNGM2Ny1hOTJkLWU4MTc4YWJhYzliZFwvZGV2ZGx2di02YTEyZjYwNC00YzEyLTRiNmEtOWZjMy1iNzAwOTBiNmJkZDMucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.eufR74FOEIghEPVNdTOuEREFJRd3puhZgnXxj5WjkU4' alt='' width='34' height='34'></img>

						</div>
						<div className="status">
							{user}
							<div className="online">
								online
							</div>
						</div>
					</div>
				</ul >
			)
			}
			<button onClick={toggleNavResponsive} className="btn">BTN</button>
		</nav >
	);
}