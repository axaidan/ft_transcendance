import React from "react";
import { Link, NavLink } from "react-router-dom";
import '../styles/components/Navbar.css';
import { FaUserCircle, FaHome, FaComments, FaStore } from 'react-icons/fa';

export function Navbar() {
	return (
		<div>
			<ul className="nav">
				<li>
					<NavLink exact to="/">Home</NavLink>
				</li>
				<li>
					<NavLink activeStyle={{ color: '#5754a8' }} to="/about">
						About
					</NavLink>
				</li>
				<li>
					<NavLink activeStyle={{ color: '#5754a8' }} to="/projects">
						Projects
					</NavLink>
				</li>
				<li>
					<NavLink activeStyle={{ color: '#5754a8' }} to="/blogs">
						Blogs
					</NavLink>
				</li>
				<li>
					<NavLink activeStyle={{ color: '#5754a8' }} to="/contact">
						Contact
					</NavLink>
				</li>
			</ul>
		</div>


		// <div className="nav">
		// 	<ul>
		// 		<div className="L_Box" >
		// 			<Link to="/game">
		// 				<div className="name">Jouer</div>
		// 			</Link>
		// 			<Link to="/">
		// 				<span className="icon"></span>
		// 				<FaHome />
		// 				<div className="name">Acceuil</div>
		// 			</Link >
		// 			<Link to="/profile">
		// 				<span className="icon"></span>
		// 				<FaUserCircle />
		// 				<div className="name">User</div>
		// 			</Link >
		// 		</div>
		// 		<div className="R_Box" >
		// 			<Link to="/login">
		// 				<span className="icon"></span>
		// 				<FaComments />
		// 				<div className="name">Channel</div>
		// 			</Link>
		// 			<Link to="/store">
		// 				<span className="icon"></span>
		// 				<FaStore />
		// 				<div className="name">Store</div>
		// 			</Link>
		// 		</div>
		// 	</ul >
		// </div >
	)
}