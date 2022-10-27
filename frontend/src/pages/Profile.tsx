// Extern:
import React, { SyntheticEvent, useContext, useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";

// Intern:
import { IUser } from "../types";
import { IAvatar } from '../types/interfaces/IAvatar';

//Hooks
import { AxiosJwt } from '../hooks/AxiosJwt';
import { useCookies } from 'react-cookie';
// import { useForme } from '../hooks/UseForm';
import { useForm, Resolver } from 'react-hook-form'

// Assets:
import '../styles/pages/Profile.css'

type FormValues = {
	username: string;
};



export function Profile() {

	const user: IUser = useOutletContext();
	const axios = AxiosJwt();


	const [toggle2facheckbox, set2facheckbox] = useState(user.twoFactorAuth);
	const [toggleEdit, setToggleEdit] = useState(false);

	const inputRef = useRef<HTMLInputElement>(null);

	const [users, setUsers] = useState<string[]>([]);

	useEffect(() => {
		axios.get('/user/all').then((res) => setUsers(res.data.username));
	});

	const checkExistantNickname = (us: string[], value: string): boolean => {
		return users.includes(value);
	};

	const resolver: Resolver<FormValues> = async (values) => {
		return {
			values: values.username ? values : {},
			errors: !values.username
				? {
					username: {
						type: 'required',
						message: 'This is required.',
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
						checkExistantNickname(users, values.username) ?
						{
							username: {
								type: "required",
								message: 'This username is already taken.'
							}
						}
						: {}
		};
	};


	const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ resolver });
	const onSubmit = handleSubmit((data) => {
		console.log(data);
		axios.patch('/user', data)
			.catch(function (error) {
				if (error.response && error.request) {
					console.log('this nickname is already taken');
				}
			})
		toggleUserEdit();
		user.username = data.username;
	});

	const editUser = (e: React.ChangeEvent<HTMLInputElement>): void => {
		axios.patch('/user', values)
			.catch(function (error) {
				if (error.response && error.request) {
					alert('pseudonyme deja pris');
					console.log('this nickname is already taken');
				}
			})
		toggleUserEdit();
		// location.reload();
	}



	const toggleTFA = () => {
		set2facheckbox(!toggle2facheckbox);
		axios.patch('/user',
			{ twoFactorAuth: { toggle2facheckbox } },
		).catch(function (error) {
			if (error.response || error.request) {
				console.log('this nickname is already taken');
				return false;
			}
			return toggle2facheckbox;
		})
	}

	const toggleUserEdit = () => {
		setToggleEdit(!toggleEdit);
	}

	// const initialState = {
	// 	username: ''
	// };

	// const { onChange, onSubmit, values } = useForm(
	// 	editUser,
	// 	initialState
	// );

	useEffect(() => {
		document.title = user.username + "'s profile";
	}, [user]);

	return (
		<div className="user-body" >
			<div className="user-left-side">
				<div className="user-banner">
					<div className="user-nickname">
						<div className={toggleEdit ? "user-disabled" : "user-nick"}>
							{user.username}
							<button onClick={toggleUserEdit} className={toggleEdit === true ? "user-edit-up" : "user-no-edit"}>
							</button>
						</div>
						<form onSubmit={onSubmit} className={toggleEdit ? "user-edit-input" : "user-disabled"}>
							{/* <input className={toggleEdit ? "user-edit-input" : "user-disabled"} placeholder={user.username} onChange={onChange} name="username" ref={inputRef} /> */}
							<input {...register("username")} placeholder={user.username} />
							{/* <button onClick={on} className={toggleEdit ? "user-validate-edit" : "user-disabled"}>
								Validate
							</button> */}

							<button onClick={onSubmit} className={toggleEdit ? "user-validate-edit" : "user-disabled"}>
								Validate
							</button>
							{errors?.username && <p>{errors.username.message}</p>}

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

						<img src={user.avatarUrl} id="user-profile-icon" />
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
						<input type="checkbox" id='user-checkbox' onChange={toggleTFA} checked={true} />
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
						E-MAIL : {user.email}
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