import React from "react";
import { Link } from "react-router-dom";
import './Navbar.css'

export function Navbar() {
	return (
		<header>
			<div className="Box">
				<div className="logo"><img alt='0' src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/42_Logo.svg/2048px-42_Logo.svg.png"/></div>
				<div className="name"><h1>Ft_transendence</h1></div>
			</div>
			<div className="nav">
				<Link to="/">
					<div className="Box" >
						<div className="logo"><img alt='0' src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/42_Logo.svg/2048px-42_Logo.svg.png"/></div>
						<div className="name">Acceuil</div>
					</div>
				</Link>
				<Link to="/ladder">
					<div className="Box" >
							<div className="logo"><img alt='0' src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/42_Logo.svg/2048px-42_Logo.svg.png"/></div>
							<div className="name">LadderBoard</div>
					</div>
				</Link>
				{/* <Link to="/login"> */}
				<a href="http://localhost:3000/auth/signin">
					<div className="Box">
							<div className="logo"><img alt='0' src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/42_Logo.svg/2048px-42_Logo.svg.png"/></div>
							<div className="name">LOGIN</div>
					</div>
				</a>
				{/* </Link> */}
				<Link to="/login">
					<div className="Box" >
						<div className="logo"><img alt='0' src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/42_Logo.svg/2048px-42_Logo.svg.png"/></div>
						<div className="name">Game</div>
					</div>
				</Link>
				<Link to="/profile">
					<div className="Box"><img alt='0' src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/42_Logo.svg/2048px-42_Logo.svg.png"/></div>
				</Link>
			</div>
		</header>
	)
}