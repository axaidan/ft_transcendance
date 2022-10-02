import React from "react"
import './Profile.css'

export function Idcard () {
	return (
		<div>
			<div className='photo'><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/42_Logo.svg/2048px-42_Logo.svg.png"/></div>
		</div>
	)
}

export function Profile () {


	const name = 'maxime'

	return (
		<div className='profile'>
			<Idcard />
			<div>{name}</div>
		</div>
	)
}