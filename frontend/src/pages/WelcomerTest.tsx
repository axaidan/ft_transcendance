import { useState } from "react"

import { AxiosJwt } from "../hooks";

import '../styles/pages/WelcomerTest.css'

export function WelcomerTest() {

	const axios = AxiosJwt();
	const [ login , setLogin ] = useState<string>("");

	const OnChangeHandler = (event: any) => {
		setLogin( event.target.value )
	}

	const OnClickHandler = () => {

		const option = {
			data: {
				login: login,
			}
		}

		axios.post('/auth/signin-test', option)
	}

	return (
		<div className="body">
			<form action="" method="post">
					<input type="text" placeholder="Enter Username" onChange={OnChangeHandler} required />
					<button type="submit" onClick={OnClickHandler}>Login</button>
			</form>
		</div>
	)
}