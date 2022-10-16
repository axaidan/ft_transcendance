import { useState } from "react"

import '../styles/pages/WelcomerTest.css'

export function WelcomerTest() {
	return (
		<div className="body">
			<a className="user-select" href="http://localhost:3000/auth/signin-test?login=user0">user0</a>
			<a className="user-select" href="http://localhost:3000/auth/signin-test?login=user1">user1</a>
			<a className="user-select" href="http://localhost:3000/auth/signin-test?login=user2">user2</a>
			<a className="user-select" href="http://localhost:3000/auth/signin-test?login=user3">user3</a>
			<a className="user-select" href="http://localhost:3000/auth/signin-test?login=user4">user4</a>
			<a className="user-select" href="http://localhost:3000/auth/signin-test?login=user5">user5</a>
			<a className="user-select" href="http://localhost:3000/auth/signin-test?login=user6">user6</a>
			<a className="user-select" href="http://localhost:3000/auth/signin-test?login=user7">user7</a>
			<a className="user-select" href="http://localhost:3000/auth/signin-test?login=user8">user8</a>
			<a className="user-select" href="http://localhost:3000/auth/signin-test?login=user9">user9</a>
		</div>
	)
}