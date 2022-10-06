
import React from "react";
import '../styles/pages/Welcomer.css'
import bg_welcomer from '../assets/video/bg_welcomer_loop.webm'

const Welcomer = () => {



	return (
		<div>
			<video src={bg_welcomer} loop autoPlay>

			</video>

			<nav className="login-container">
				<a href="http://localhost:3000/auth/signin">
					<button>LOGIN</button>
				</a>
			</nav>
		</div>
	)

}

export default Welcomer;
