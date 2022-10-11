// Extern:
import React, { useEffect } from "react";
import { useOutletContext } from "react-router-dom";

// Intern:
import { IUser } from "../types";

// Assets:
import '../styles/pages/Profile.css'

export function Profile() {
	let user: IUser = useOutletContext();

	return (
		<>
			<p> 0</p>
			<p> 1</p>
			<p> 2</p>
			<p> 3</p>
			<p> 4</p>
			<p> </p>
			<p>page profile de: {user.username}</p>
		</>
	)
}