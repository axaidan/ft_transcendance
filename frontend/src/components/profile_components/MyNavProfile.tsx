// Extern:
import React, { useRef } from 'react';
import { Outlet, useOutletContext, Link, NavLink, useNavigate, useParams } from 'react-router-dom';
import "../../styles/components/profile_components/MyNavProfile.css";

// Intern:
import { DflUser, IUser } from "../../types";
import { AxiosJwt } from '../../hooks';
import { useForm, Resolver } from 'react-hook-form';
import { FormValues } from '../../pages/Profile';
import { useContext, useState } from 'react';
import { SocketContext, ESocketActionType } from '../../context/UserSocket/Socket';

export function MyNavProfile() {

	const navigate = useNavigate();
	const dispatch = useContext(SocketContext).SocketDispatch
	const { me } = useContext(SocketContext).SocketState;
	const axios = AxiosJwt();

	const [nick, setNick] = useState(false);

	const ExistantUsername = (value: string) => {
		axios.get('/user/is_user/' + value).then((res) => setNick(res.data));
		return nick;
	}

	const resolver: Resolver<FormValues> = async (values) => {
		return {
			values: values.username ? values : {},
			errors: ExistantUsername(values.username) ?
				{} :
				{
					username: {
						type: 'required',
						message: 'This user does not exist.',
					}
				}

		};
	};


	const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ resolver });

	const onSubmit = handleSubmit((data) => {
		// if (ExistantUsername(data.username)) {
		axios.get('/user/get_user_by_name/' + data.username).then((res) => navigate('/home/' + res.data));
		// }
	});


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
					<form onSubmit={onSubmit}>
						<input {...register("username")} placeholder="Recherche d'invocateur" maxLength={20} className='input_search' />
						{errors?.username && <p id='user-error-input'>{errors.username.message}</p>}
					</form>
				</div>
			</ul >
			<Outlet context={me} />
		</div >
	)
}
