// Extern:
import React from 'react';
import { Outlet, useOutletContext, Link, NavLink } from 'react-router-dom';
import "../../styles/components/profile_components/MyNavProfile.css";

// Intern:
import { IUser } from "../../types";

export function MyNavProfile() {

	const user: IUser = useOutletContext();

	return (
		<div className='div_user'>
			<ul className='NavUser'>
				<NavLink to='/home/me/friend' className='user_nav_items'>
					Friends
				</NavLink>
				<NavLink to='/home/me/history' className='user_nav_items'>
					Historique
				</NavLink>
				<NavLink to='/home/me/collection' className='user_nav_items'>
					Collection
				</NavLink>
				<NavLink to='/home/me/achievement' className='user_nav_items'>
					Achievement
				</NavLink>
			</ul>
			<Outlet context={user} />
		</div>
	)
}
