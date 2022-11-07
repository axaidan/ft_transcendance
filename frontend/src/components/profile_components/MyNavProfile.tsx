// Extern:
import React, { useRef } from 'react';
import { Outlet, useOutletContext, Link, NavLink, useNavigate, useParams } from 'react-router-dom';
import "../../styles/components/profile_components/MyNavProfile.css";

// Intern:
import { DflUser, IUser } from "../../types";
import { AxiosJwt } from '../../hooks';
import { useEffect, useState } from 'react';
import { AxiosResponse } from 'axios';

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
				<div className="user_search">
					<input className='input_search' type="text" placeholder="Recherche d'invocateur" >
					</input>
				</div>
			</ul>
			<Outlet context={user} />
		</div >
	)
}
