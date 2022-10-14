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
			<p>page profile de: {user.username}</p>
		</>
	)
}