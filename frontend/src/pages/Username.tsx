import { useContext, useState, useEffect } from "react";
import { Resolver, useForm } from "react-hook-form";
import { ESocketActionType, SocketContext } from "../context";
import { AxiosJwt } from "../hooks";
import { FormValues } from "./Profile";
import { useNavigate } from 'react-router-dom';
import '../styles/pages/Username.css'

export function UsernameLogger() {
	const { me } = useContext(SocketContext).SocketState;
	const axios = AxiosJwt();
	const [nick, setNick] = useState(false);
	const navigate = useNavigate();

	const ExistantUsername = async (value: string) => {
		return (await axios.get('/user/is_user/' + value)).data;
	}

	const resolver: Resolver<FormValues> = async (values) => {
		return {
			values: values.username ? values : {},
			errors: !values.username
				? {
					username: {
						type: 'required',
						message: 'Enter a new username.',
					},
				}
				: {}
					&&
					(values.username.length < 3) ?
					{
						username: {
							type: 'required',
							message: 'You must have at least 3 characters.',
						}
					}
					: {}
						&&
						await ExistantUsername(values.username) ?
						{
							username: {
								type: 'required',
								message: 'This username is already taken',
							}
						}
						: {}
		};
	};


	const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ resolver });

	const onSubmit = handleSubmit(async (data) => {
		await axios.patch('/user', data);
		if (!me.username !== null)
			navigate('/home/acceuil')
	}
	);



	return (
		<div className="signin-body">
			<div className="signin-box">
				<div className="signin-text">Choose your first Username</div>
				<form onSubmit={onSubmit} className="signin-form">
					<div className="signin-input">
						<input {...register("username")} placeholder='Username...' maxLength={15} id={errors.username ? 'user-inputbox-error' : 'user-input'} />
						{errors?.username && <p id='user-error-input'>{errors.username.message}</p>}
					</div>
					<div className="signin-buttons">
						<button onClick={onSubmit} id='signin-validate'>Validate</button>
					</div>
				</form>
			</div>
		</div>
	);
}