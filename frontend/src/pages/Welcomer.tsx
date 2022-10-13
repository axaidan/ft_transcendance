
import React from "react";
import '../styles/pages/Welcomer.css'
import bg_welcomer from '../assets/videos/bg_welcomer_loop.webm'

export const Welcomer = () => {
	return (
		<div>
			<video src={bg_welcomer} autoPlay loop muted className='bg_video' />
			<nav className="login-container">
				<a href="http://localhost:3000/auth/signin">
					<button className='login-btn'>LOGIN</button>
				</a>
			</nav>
		</div>
	);
}
