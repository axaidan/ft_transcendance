import React, { useCallback } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { FaUserCircle, FaHome, FaComments, FaStore } from 'react-icons/fa';
import { useState } from 'react';
import { useEffect } from 'react';
import { useCookies } from "react-cookie";
import axios from 'axios'
import { AxiosJwt } from "../hooks/AxiosJwt";
import '../styles/components/Navbar2.css'

export function Navbar2() {

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
		<div className="navbar">
			<ul className="nav_links">
				<div className="items_left">
					<li className="play">
						<NavLink to='/game'>
							Play
						</NavLink>
					</li>
					<li className="items">
						<NavLink to='/home'>
							Home
						</NavLink>
					</li>
					<li className="items">
						<NavLink to='/profile'>
							profile
						</NavLink>
					</li>
				</div>
				<div className="items_right">
					<li className="items">
						<NavLink to='/'>
							Friends
						</NavLink>
					</li>
					<li className="items">
						<NavLink to='/'>
							Channels
						</NavLink>
					</li>
					<li className="items" >
						<NavLink to='/'>
							Store
						</NavLink>
					</li>
				</div>
				<div className="nav_user">
					<div className="avatar">
						photo
					</div>
					<div className="nav_user_info">
						<div className="nickname">
							walter
						</div>
						<div className="status">
							online
						</div>
					</div>
				</div>
			</ul >
		</div>
	);
}