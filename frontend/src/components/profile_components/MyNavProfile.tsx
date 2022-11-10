// Extern:
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useForm, Resolver } from 'react-hook-form';

//Assets
import "../../styles/components/profile_components/MyNavProfile.css";

// Intern:
import { FormValues } from '../../pages/Profile';
import { AxiosJwt } from '../../hooks';

//Context
import { useContext } from 'react';
import { SocketContext } from '../../context/UserSocket/Socket';

export function MyNavProfile() {

	const navigate = useNavigate();
	const { me } = useContext(SocketContext).SocketState;
	const axios = AxiosJwt();


	const ExistantUsername = async (value: string) => {
		return (await axios.get('/user/is_user/' + value)).data;
	}

	const resolver: Resolver<FormValues> = async (values) => {
		return {
			values: values.username ? values : {},
			errors: (await ExistantUsername(values.username) && values.username) ?
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

	const onSubmit = handleSubmit(async (data) => {
		const userId: number = (await axios.get('/user/get_user_by_name/' + data.username)).data;
		navigate('/home/' + userId);
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
						<input {...register("username")} placeholder="Recherche d'invocateur" maxLength={15} className='input_search' />
						{errors.username && <p id='user-error-input'>{errors.username.message}</p>}
					</form>
				</div>
			</ul >
			<Outlet context={me} />
		</div >
	)
}
