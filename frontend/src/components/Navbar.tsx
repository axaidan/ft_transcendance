import { NavLink, useLocation } from "react-router-dom";
import { useState } from 'react';
import { useEffect } from 'react';
import { IUser } from "../types";
import { AxiosJwt } from "../hooks/AxiosJwt";
import '../styles/components/Navbar.css'

type NavProps = {
	me: IUser;
}

export function Navbar({ me }: NavProps) {

	const request = AxiosJwt();
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
					<li className={pathname === "/home/accueil" ? "items_active" : "items"}>
						<NavLink to='/home/acceuil'>
							home
						</NavLink>
					</li>
					<li className={splitLocation[1] === "/me" ? "items_active" : "items"}>
						<NavLink to='/home/me'>
							profile
						</NavLink>
					</li>
				</div>
				<div className="items_right">
					<li className={splitLocation[1] === "" ? "items_active" : "items"}>
						<NavLink to='/home/ladder'>
							Ladder
						</NavLink>
					</li>
					<li className={splitLocation[1] === "" ? "items_active" : "items"}>
						<NavLink to='/home/channel'>
							Channels
						</NavLink>
					</li>
					<li className={splitLocation[1] === "" ? "items_active" : "items"} >
						<NavLink to='/home/store'>
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
							{me.username}
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