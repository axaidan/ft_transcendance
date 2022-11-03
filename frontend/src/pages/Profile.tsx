// Extern:
import React, { SyntheticEvent, useContext, useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";

// Intern:
import { IUser } from "../types";

//Hooks
import { AxiosJwt } from '../hooks/AxiosJwt';
import { useCookies } from 'react-cookie';
import { useForm, Resolver } from 'react-hook-form'
import { ESocketActionType, SocketContext } from "../context";

// Assets:
import '../styles/pages/Profile.css'

export type FormValues = {
	username: string;
};



export function Profile() {

	const dispatch = useContext(SocketContext).SocketDispatch
	const { me } = useContext(SocketContext).SocketState;
	const axios = AxiosJwt();

	const DflChecked: boolean = me.twoFactorAuth;
	const [toggle2facheckbox, set2facheckbox] = useState(DflChecked);
	const [toggleEdit, setToggleEdit] = useState(false);
	const [nick, setNick] = useState(false);

	const ExistantUsername = (value: string) => {
		axios.get('/user/is_user/' + value).then((res) => setNick(res.data));
		return nick;
	}

	const resolver: Resolver<FormValues> = async (values) => {
		return {
			values: values.username ? values : {},
			errors: !values.username
				? {
					username: {
						type: 'required',
						message: 'Enter a new username or cancel.',
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
						ExistantUsername(values.username) ?
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

	const onSubmit = handleSubmit((data) => {
		axios.patch('/user', data)
			.catch(function (error) {
				if (error.response && error.request) {
					console.log('this nickname is already taken');
				}
			})
		toggleUserEdit();
		dispatch({ type: ESocketActionType.UP_USERNAME, payload: data.username });
	});

	const toggleUserEdit = () => {
		setToggleEdit(!toggleEdit);
	}

	useEffect(() => {
		document.title = me.username + "'s profile";
	}, [me]);

	return (
		<div className="user-body" >
			<div className="user-left-side">
				<div className="user-banner">
					<div className="user-nickname">
						<div className={toggleEdit ? "user-disabled" : "user-nick"}>
							{me.username}
							<button onClick={toggleUserEdit} className="user-no-edit">
							</button>
						</div>
						<form onSubmit={onSubmit} className={toggleEdit ? "user-edit-input" : "user-disabled"}>
							<div className="user-input-kit">
								<input {...register("username")} placeholder={me.username} maxLength={20} id={errors.username ? 'user-inputbox-error' : 'user-input'} />
								<div className="user-buttons">
									<button onClick={onSubmit} id='user-validate' />
									<button onClick={toggleUserEdit} id='user-cancel' />
								</div>
							</div>
							{errors?.username && <p id='user-error-input'>{errors.username.message}</p>}

						</form>
					</div>
					<div className="user-clan">
						My clan
					</div>
					<div className="user-xp-bar"></div>
					<div className="user-xp-fill"></div>
					<div className="user-xp-nbr"></div>
					<div className="user-xp-value">
						25
					</div>
					<div className="user-profile-icon-div">

						<img src={me.avatarUrl} id="user-profile-icon" />
					</div>
					<div className="user-end-of-banner">
					</div>
				</div>
				<div className="user-loot">
					<div className="user-coffer">
						0
					</div>
					<div className="user-boost">
						0
					</div>
					<div className="user-reroll">
						0
					</div>
				</div>
			</div>
			<div className="user-stats">
				<div className="user-setting">
					<div className="user-2auth">
						<input type="checkbox" id='user-checkbox' onClick={(e: React.FormEvent<HTMLInputElement>) => {
							axios.patch('/user',
								{ twoFactorAuth: !me.twoFactorAuth })
						}} defaultChecked={me.twoFactorAuth} />
						<label id='user-checkbox-label'>
							2F-Auth
						</label>
						<div id='user-2auth-description'>
							Two-factor authentication is a security feature that helps protect your account and your password.
							If you set up two-factor authentication, you'll receive a notification on your e-mail address
							when someone tries logging into your account from a device we don't recognize.
						</div>
					</div>
					<div className="user-email">
						E-MAIL : {me.email}
					</div>
				</div>
				<div className="user-lol-stats">
					<div className="user-rank">
						<h3>Rank</h3>
						<div className="user-txt">
							unranked
						</div>
					</div>
					<div className="user-honor">
						<h3>Honor</h3>
						<div className="user-txt">
							none
						</div>
					</div>
					<div className="user-champion">
						<h3>Victories</h3>
						<div className="user-txt">
							No game yet
						</div>
					</div>
					<div className="user-trophee">
						<h3>Trophee</h3>
						<div className="user-txt">
							none
						</div>
					</div>
					<div className="user-clash">
						<div id='user-stats-column'>
							<h3>Banner</h3>
							<div className="user-txt">
								none
							</div>
						</div>
					</div>
				</div>
			</div>
		</div >
	);
}