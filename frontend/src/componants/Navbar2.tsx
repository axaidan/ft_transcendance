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
	const [toggleStatus, setToggleStatus] = useState(true);

	const toggleNavResponsive = () => {
		setToggleMenu(!toggleMenu);
	}

	const toggleUserStatus = () => {
		setToggleStatus(!toggleStatus);
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

	const location = useLocation();

	const { pathname } = location;

	const splitLocation = pathname.split("/");

	return (
		<div className="navbar">
			<ul className="nav_links">
				<div className="items_left">
					<li className="play">
						<NavLink to='/game'>
							<div className="play_div">
								<button className="play_btn">
									Play
								</button>
							</div>
						</NavLink>
					</li>
					<li className={splitLocation[1] === "" ? "active" : "items"}>
						<NavLink to='/home'>
							Home
						</NavLink>
					</li>
					<li className={splitLocation[1] === "" ? "items_active" : "items"}>
						<NavLink to='/profile'>
							profile
						</NavLink>
					</li>
				</div>
				<div className="items_right">
					<li className={splitLocation[1] === "" ? "items_active" : "items"}>
						<NavLink to='/friends'>
							Friends
						</NavLink>
					</li>
					<li className={splitLocation[1] === "" ? "items_active" : "items"}>
						<NavLink to='/channels'>
							Channels
						</NavLink>
					</li>
					<li className={splitLocation[1] === "" ? "items_active" : "items"} >
						<NavLink to='/store'>
							Store
						</NavLink>
					</li>
				</div>
				<div className="nav_user">
					<div className="avatar">
						<img src='https://2.bp.blogspot.com/-sT67LUsB61k/Ul7ocxgFhTI/AAAAAAAACdc/iAQ2LgxMvG4/s1600/image+115.jpg' className="user_icon">
						</img>
					</div>
					<div className="nav_user_info">
						<div className="nickname">
							{user}
						</div>
						<div className={toggleStatus === true ? "online" : "absent"}>
							<button onClick={toggleUserStatus} className={toggleStatus === true ? "btn_online" : "btn_abs"}>
								◉
							</button>
							{toggleStatus === true ? 'online' : "absent"}
						</div>
					</div>
				</div>
			</ul >
		</div>


	);
}