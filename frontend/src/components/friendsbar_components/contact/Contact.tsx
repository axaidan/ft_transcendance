// Extern:
import React, { useContext, useEffect } from "react";

// Intern:
import { colorStatus, ContactStatus } from ".";
import { IUser } from "../../../types";

import '../../../styles/components/friendsbar_components/Contact.css'
import { SocketContext } from "../../../context";



type NotificationProps = { notif: number };
export function Notification({ notif }:NotificationProps ) {
	return (( notif ? (<div className='contact-notification'>{notif}</div>) : (<></>)))
} 

type ContactProps = { user: IUser};
export function Contact({ user }: ContactProps) {

	const { users, friends } = useContext(SocketContext).SocketState;

	const getStatus = ( uid: number ) => {
		return users.find((user) => { return uid == user.userId })?.status;
	}

	if (user == undefined)
		return <></>

	let status: number = 4;
	if ( getStatus(user.id) != undefined ) 
		status = getStatus(user.id)!;


	return (
		<li className='contact-container'>
			<div className="chat-user-avatar">
				<img src={user.avatarUrl} className="chat-user-icon" />
			</div>
			<div className='contact-info'>
				<div id={colorStatus( status , 'username', false)} className="contact-name">
					<p>{user.username}</p>
				</div>
				<ContactStatus mode={status} />
			</div>
		</li>
	)
}
